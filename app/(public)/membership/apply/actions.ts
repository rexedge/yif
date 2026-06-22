"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { APIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { paystackRequest, toKobo } from "@/lib/paystack";
import { stripe, assertStripeConfigured, toStripeMinor } from "@/lib/stripe";
import { recordTransactionInit } from "@/lib/transactions";
import { sendMembershipInitialization } from "@/lib/send-email";
import { getTierBySlug, getPriceForCurrency } from "@/lib/membership";
import { COUNTRY_CONTINENT } from "@/lib/countries";

const SUPPORTED_CURRENCIES = ["NGN", "USD", "GBP", "EUR"] as const;
type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

const baseSchema = z.object({
  tierSlug: z.string().min(1, "Select a membership tier"),
  currency: z.enum(SUPPORTED_CURRENCIES).default("NGN"),
  phone: z.string().min(7, "Enter a valid phone number"),
  country: z.string().min(2, "Enter your country"),
  stateProvince: z.string().optional(),
  cityDistrict: z.string().min(2, "Enter your city or district"),
});

const registrationSchema = baseSchema.extend({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type ApplyState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function startMembershipApplication(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  const reqHeaders = await headers();
  const existingSession = await auth.api.getSession({ headers: reqHeaders });

  const raw = {
    tierSlug: formData.get("tierSlug"),
    currency: (formData.get("currency") as string | null) ?? "NGN",
    phone: formData.get("phone"),
    country: formData.get("country"),
    stateProvince: formData.get("stateProvince") || undefined,
    cityDistrict: formData.get("cityDistrict"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const schema = existingSession ? baseSchema : registrationSchema;
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { tierSlug, currency, phone, country, stateProvince, cityDistrict } =
    parsed.data;
  const continent = COUNTRY_CONTINENT[country] ?? null;

  // Fetch tier from DB
  const tier = await getTierBySlug(tierSlug);
  if (!tier) {
    return { error: "The selected membership tier was not found." };
  }

  const price = getPriceForCurrency(tier, currency);
  if (!price || price <= 0) {
    return { error: `Pricing for ${currency} is not available for this tier.` };
  }

  // Resolve user
  let userId: string;
  let userEmail: string;
  let userName: string;

  if (existingSession) {
    userId = existingSession.user.id;
    userEmail = existingSession.user.email;
    userName = existingSession.user.name ?? "Member";
  } else {
    const { fullName, email, password } = parsed.data as z.infer<
      typeof registrationSchema
    >;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return {
        fieldErrors: {
          email: [
            "An account with this email already exists. Please log in first.",
          ],
        },
      };
    }

    try {
      const signUpResult = await auth.api.signUpEmail({
        body: { name: fullName, email, password },
        headers: reqHeaders,
      });
      userId = signUpResult.user.id;
      userEmail = signUpResult.user.email;
      userName = signUpResult.user.name;
    } catch (err) {
      const message =
        err instanceof APIError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Could not create your account.";
      return { error: message };
    }
  }

  // Update user profile
  await prisma.user.update({
    where: { id: userId },
    data: { phone, country, stateProvince: stateProvince ?? null, cityDistrict, continent },
  });

  // Create or update member record in PENDING state
  const member = await prisma.member.upsert({
    where: { userId },
    update: { tierId: tier.id, status: "PENDING" },
    create: { userId, tierId: tier.id, status: "PENDING" },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.yifww.org";

  // ── NGN → Paystack ──────────────────────────────────────────────
  if (currency === "NGN") {
    type PaystackInitResponse = {
      authorization_url: string;
      access_code: string;
      reference: string;
    };

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
                  value: "membership",
                },
                {
                  display_name: "Member ID",
                  variable_name: "member_id",
                  value: member.id,
                },
                {
                  display_name: "Tier ID",
                  variable_name: "tier_id",
                  value: tier.id,
                },
                {
                  display_name: "Membership Tier",
                  variable_name: "membership_tier",
                  value: tier.name,
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
      const msg = err instanceof Error ? err.message : "Payment setup failed.";
      return { error: msg };
    }

    await prisma.member.update({
      where: { id: member.id },
      data: { paystackRef: paystackData.reference },
    });

    await recordTransactionInit({
      reference: paystackData.reference,
      purpose: "MEMBERSHIP",
      amountNaira: price,
      currency: "NGN",
      provider: "paystack",
      customerEmail: userEmail,
      customerName: userName,
      customerPhone: phone,
      userId,
      memberId: member.id,
      metadata: {
        tierId: tier.id,
        tierName: tier.name,
        country,
        stateProvince: stateProvince ?? null,
        cityDistrict,
      },
    }).catch((err) =>
      console.error("[startMembershipApplication] tx init record failed:", err),
    );

    sendMembershipInitialization({
      recipientName: userName,
      tierName: tier.name,
      amountNaira: `₦${price.toLocaleString("en-NG")}`,
      reference: paystackData.reference,
      paymentUrl: paystackData.authorization_url,
      recipientEmail: userEmail,
    }).catch((err) =>
      console.error("[startMembershipApplication] init email failed:", err),
    );

    redirect(paystackData.authorization_url);
  }

  // ── USD / GBP / EUR → Stripe ─────────────────────────────────────
  try {
    assertStripeConfigured();
  } catch {
    return { error: "International payments are not yet configured. Please pay in NGN." };
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
              name: `YIF ${tier.name} Membership`,
              description: tier.description ?? `Annual ${tier.name} membership`,
            },
          },
        },
      ],
      customer_email: userEmail,
      success_url: `${appUrl}/payment/stripe-callback?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/membership`,
      metadata: {
        purpose: "MEMBERSHIP",
        paymentType: "membership",
        tierId: tier.id,
        membershipTier: tier.name,
        memberId: member.id,
        userId,
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

  await recordTransactionInit({
    reference: checkoutSession.id,
    purpose: "MEMBERSHIP",
    amountNaira: price,
    currency,
    provider: "stripe",
    customerEmail: userEmail,
    customerName: userName,
    customerPhone: phone,
    userId,
    memberId: member.id,
    metadata: {
      tierId: tier.id,
      tierName: tier.name,
      country,
      stateProvince: stateProvince ?? null,
      cityDistrict,
    },
  }).catch((err) =>
    console.error("[startMembershipApplication] stripe tx init failed:", err),
  );

  redirect(checkoutSession.url);
}
