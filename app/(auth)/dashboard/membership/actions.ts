"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { paystackRequest, toKobo } from "@/lib/paystack";
import { stripe, assertStripeConfigured, toStripeMinor } from "@/lib/stripe";
import { recordTransactionInit } from "@/lib/transactions";
import { getTierBySlug, getPriceForCurrency } from "@/lib/membership";

const SUPPORTED_CURRENCIES = ["NGN", "USD", "GBP", "EUR"] as const;
type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

type ActionState = {
  error?: string;
  success?: boolean;
};

type PaystackInitResponse = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

// ────────────────────────────────────────────────
// UPGRADE: initiates payment to move member to a
// higher tier, immediately on payment success.
// ────────────────────────────────────────────────
export async function initMembershipUpgrade(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  if (!session) return { error: "You must be signed in." };

  const tierSlug = (formData.get("tierSlug") as string | null)?.trim();
  const currency = ((formData.get("currency") as string | null) ??
    "NGN") as SupportedCurrency;

  if (!tierSlug) return { error: "Invalid tier selected." };
  if (!SUPPORTED_CURRENCIES.includes(currency as SupportedCurrency)) {
    return { error: "Unsupported currency." };
  }

  // Fetch current member with their tier
  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
    include: {
      user: { select: { email: true, name: true } },
      tier: true,
    },
  });

  if (!member) return { error: "No membership record found." };
  if (member.status !== "ACTIVE") {
    return { error: "Your membership is not active. Please apply first." };
  }

  // Fetch target tier from DB
  const targetTier = await getTierBySlug(tierSlug);
  if (!targetTier) return { error: "The selected tier was not found." };

  const currentSortOrder = member.tier.sortOrder;
  const targetSortOrder = targetTier.sortOrder;

  if (targetSortOrder < currentSortOrder) {
    return { error: "Use the downgrade option to move to a lower tier." };
  }

  const price = getPriceForCurrency(targetTier, currency);
  if (!price || price <= 0) {
    return { error: `Pricing for ${currency} is not available for this tier.` };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.yifww.org";
  const userName = member.user.name ?? "Member";
  const userEmail = member.user.email;
  const isRenewal = targetSortOrder === currentSortOrder;
  const paymentType = isRenewal ? "membership_renewal" : "membership_upgrade";

  // ── NGN → Paystack ──────────────────────────────────────────────
  if (currency === "NGN") {
    let paystackData: PaystackInitResponse;
    try {
      const result = await paystackRequest<PaystackInitResponse>(
        "/transaction/initialize",
        {
          method: "POST",
          body: JSON.stringify({
            email: userEmail,
            amount: toKobo(price),
            callback_url: `${appUrl}/payment/callback`,
            metadata: {
              custom_fields: [
                {
                  display_name: "Payment Type",
                  variable_name: "payment_type",
                  value: paymentType,
                },
                {
                  display_name: "Member ID",
                  variable_name: "member_id",
                  value: member.id,
                },
                {
                  display_name: "From Tier ID",
                  variable_name: "from_tier_id",
                  value: member.tierId,
                },
                {
                  display_name: "To Tier ID",
                  variable_name: "to_tier_id",
                  value: targetTier.id,
                },
                {
                  display_name: "Membership Tier",
                  variable_name: "membership_tier",
                  value: targetTier.name,
                },
                {
                  display_name: "Full Name",
                  variable_name: "full_name",
                  value: userName,
                },
              ],
            },
          }),
        },
      );
      paystackData = result.data;
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "Payment setup failed.",
      };
    }

    recordTransactionInit({
      reference: paystackData.reference,
      purpose: "MEMBERSHIP",
      amountNaira: price,
      currency: "NGN",
      provider: "paystack",
      customerEmail: userEmail,
      customerName: userName,
      userId: session.user.id,
      memberId: member.id,
      metadata: {
        paymentType,
        tierId: targetTier.id,
        tierName: targetTier.name,
        fromTierId: member.tierId,
      },
    }).catch((e: unknown) => {
      console.error("[upgrade] tx init record failed:", e);
    });

    redirect(paystackData.authorization_url);
  }

  // ── USD / GBP / EUR → Stripe ─────────────────────────────────────
  try {
    assertStripeConfigured();
  } catch {
    return { error: "International payments are not yet configured." };
  }

  const currencyCode = currency.toLowerCase() as Lowercase<SupportedCurrency>;

  let checkoutSession: { url: string | null; id: string };
  try {
    checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: currencyCode,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: currencyCode,
            unit_amount: toStripeMinor(price),
            product_data: {
              name: `YIF ${targetTier.name} Membership`,
              description: isRenewal
                ? `Annual renewal — ${targetTier.name}`
                : `Upgrade to ${targetTier.name}`,
            },
          },
        },
      ],
      customer_email: userEmail,
      success_url: `${appUrl}/payment/stripe-callback?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard/membership`,
      metadata: {
        purpose: "MEMBERSHIP",
        paymentType,
        tierId: targetTier.id,
        toTierId: targetTier.id,
        fromTierId: member.tierId,
        membershipTier: targetTier.name,
        memberId: member.id,
        userId: session.user.id,
        customerEmail: userEmail,
        customerName: userName,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Stripe checkout failed.";
    return { error: msg };
  }

  if (!checkoutSession.url) {
    return { error: "Failed to create payment session. Please try again." };
  }

  recordTransactionInit({
    reference: checkoutSession.id,
    purpose: "MEMBERSHIP",
    amountNaira: price,
    currency,
    provider: "stripe",
    customerEmail: userEmail,
    customerName: userName,
    userId: session.user.id,
    memberId: member.id,
    metadata: {
      paymentType,
      tierId: targetTier.id,
      tierName: targetTier.name,
      fromTierId: member.tierId,
    },
  }).catch((e: unknown) => {
    console.error("[upgrade] stripe tx init failed:", e);
  });

  redirect(checkoutSession.url);
}

// ────────────────────────────────────────────────
// DOWNGRADE: schedules a tier change — no payment
// required; takes effect at next renewal.
// ────────────────────────────────────────────────
export async function scheduleMembershipDowngrade(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  if (!session) return { error: "You must be signed in." };

  const tierSlug = (formData.get("tierSlug") as string | null)?.trim();
  if (!tierSlug) return { error: "Invalid tier selected." };

  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
    include: { tier: true },
  });

  if (!member) return { error: "No membership record found." };
  if (member.status !== "ACTIVE") {
    return { error: "Your membership is not currently active." };
  }

  const targetTier = await getTierBySlug(tierSlug);
  if (!targetTier) return { error: "The selected tier was not found." };

  if (targetTier.sortOrder >= member.tier.sortOrder) {
    return { error: "Use the upgrade option to move to a higher tier." };
  }

  await prisma.member.update({
    where: { id: member.id },
    data: { pendingTierId: targetTier.id },
  });

  return { success: true };
}

// ────────────────────────────────────────────────
// CANCEL DOWNGRADE: clears pending tier change.
// ────────────────────────────────────────────────
export async function cancelPendingDowngrade(
  _prev: ActionState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formData: FormData,
): Promise<ActionState> {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  if (!session) return { error: "You must be signed in." };

  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
  });

  if (!member) return { error: "No membership record found." };

  await prisma.member.update({
    where: { id: member.id },
    data: { pendingTierId: null },
  });

  return { success: true };
}
