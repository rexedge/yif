"use server";

import { redirect } from "next/navigation";
import {
  paystackRequest,
  toKobo,
  type TransactionInitData,
} from "@/lib/paystack";
import { recordTransactionInit } from "@/lib/transactions";
import { prisma } from "@/lib/prisma";
import { YWD_SLUG, YWD_EVENT } from "@/lib/yoruba-world-day-2026";
import { stripe, assertStripeConfigured, toStripeMinor } from "@/lib/stripe";
import { usdToNgn } from "@/lib/currency";

export type TicketCheckoutState = { error?: string };

export async function buyDelegatePass(
  _prev: TicketCheckoutState,
  formData: FormData,
): Promise<TicketCheckoutState> {
  const currency = (formData.get("currency") as string | null) ?? "NGN";

  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const phone = (formData.get("phone") as string | null)?.trim() ?? "";
  const country = (formData.get("country") as string | null)?.trim() ?? "";
  const qty = parseInt((formData.get("qty") as string | null) ?? "1", 10);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!name) return { error: "Please enter your full name." };
  if (qty < 1 || qty > 20)
    return { error: "Quantity must be between 1 and 20." };

  const event = await prisma.event.findUnique({
    where: { slug: YWD_SLUG },
    include: { tiers: { take: 1 } },
  });
  if (!event || event.tiers.length === 0) {
    return {
      error:
        "The event is not yet seeded in the database. Please run `pnpm events:reset`.",
    };
  }

  const tier = event.tiers[0];
  const totalNaira = Number(tier.price) * qty;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // ── USD via Stripe ──────────────────────────────────────────────────────
  if (currency !== "NGN") {
    try {
      assertStripeConfigured();
    } catch (err) {
      console.error("[buyDelegatePass] Stripe not configured:", err);
      return {
        error:
          "USD payments are temporarily unavailable. Please choose NGN, or contact us.",
      };
    }

    const totalUsd = YWD_EVENT.ticketPriceUsd * qty;
    let stripeUrl: string | null = null;
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: toStripeMinor(totalUsd),
              product_data: {
                name: `${YWD_EVENT.title} — ${tier.name}`,
                description: `${qty} delegate pass${qty > 1 ? "es" : ""}`,
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${appUrl}/payment/stripe-callback?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/events/${YWD_SLUG}/tickets`,
        metadata: {
          purpose: "TICKET",
          eventSlug: YWD_SLUG,
          eventTitle: YWD_EVENT.title,
          tierId: tier.id,
          tierName: tier.name,
          quantity: String(qty),
          customerName: name,
          customerPhone: phone,
          country,
          fullName: name,
        },
      });

      await recordTransactionInit({
        provider: "stripe",
        reference: session.id,
        purpose: "TICKET",
        amountNaira: usdToNgn(totalUsd),
        currency: "USD",
        customerEmail: email,
        customerName: name,
        customerPhone: phone || null,
        metadata: {
          eventSlug: YWD_SLUG,
          eventTitle: YWD_EVENT.title,
          tierId: tier.id,
          tierName: tier.name,
          quantity: qty,
          country,
          totalUsd,
        },
      });

      stripeUrl = session.url;
    } catch (err) {
      console.error("[buyDelegatePass] Stripe init failed:", err);
      return {
        error:
          "We couldn't start the Stripe checkout. Please try again, or contact us if the problem persists.",
      };
    }

    if (!stripeUrl) {
      return { error: "Stripe did not return a checkout URL. Please retry." };
    }
    redirect(stripeUrl);
  }

  // ── NGN via Paystack ────────────────────────────────────────────────────
  let authorizationUrl: string | null = null;
  try {
    const result = await paystackRequest<TransactionInitData>(
      "/transaction/initialize",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          amount: toKobo(totalNaira).toString(),
          callback_url: `${appUrl}/payment/callback`,
          metadata: {
            cancel_action: `${appUrl}/events/${YWD_SLUG}/tickets`,
            custom_fields: [
              {
                display_name: "Full Name",
                variable_name: "full_name",
                value: name,
              },
              { display_name: "Phone", variable_name: "phone", value: phone },
              {
                display_name: "Country",
                variable_name: "country",
                value: country,
              },
              {
                display_name: "Event",
                variable_name: "event",
                value: YWD_EVENT.title,
              },
              { display_name: "Tier", variable_name: "tier", value: tier.name },
              {
                display_name: "Quantity",
                variable_name: "quantity",
                value: String(qty),
              },
            ],
          },
        }),
      },
    );

    await recordTransactionInit({
      reference: result.data.reference,
      purpose: "TICKET",
      amountNaira: totalNaira,
      customerEmail: email,
      customerName: name,
      customerPhone: phone || null,
      metadata: {
        eventSlug: YWD_SLUG,
        eventTitle: YWD_EVENT.title,
        tierId: tier.id,
        tierName: tier.name,
        quantity: qty,
        country,
      },
    });

    authorizationUrl = result.data.authorization_url;
  } catch (err) {
    console.error("[buyDelegatePass] Paystack init failed:", err);
    return {
      error:
        "We couldn't start the payment. Please try again, or contact us if the problem persists.",
    };
  }

  redirect(authorizationUrl!);
}
