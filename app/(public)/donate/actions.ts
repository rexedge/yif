"use server";

import { paystackRequest, type TransactionInitData } from "@/lib/paystack";
import {
  CURRENCIES,
  isSupportedCurrency,
  toSmallestUnit,
  usdToNgn,
  type SupportedCurrency,
} from "@/lib/currency";
import { recordTransactionInit } from "@/lib/transactions";
import { stripe, assertStripeConfigured, toStripeMinor } from "@/lib/stripe";
import { redirect } from "next/navigation";

export type DonateState = {
  error?: string;
};

export async function initiateDonation(
  _prev: DonateState,
  formData: FormData,
): Promise<DonateState> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const cause = (formData.get("cause") as string | null) ?? "General Fund";
  const frequency = (formData.get("frequency") as string | null) ?? "one-time";
  const rawAmount = (formData.get("amount") as string | null) ?? "";
  const rawCurrency = (formData.get("currency") as string | null) ?? "NGN";

  const currency: SupportedCurrency = isSupportedCurrency(rawCurrency)
    ? rawCurrency
    : "NGN";
  const config = CURRENCIES[currency];

  const amount = parseFloat(rawAmount.replace(/[^0-9.]/g, ""));

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!name) {
    return { error: "Please enter your full name." };
  }
  if (!amount || amount < config.min) {
    return {
      error: `Minimum donation amount is ${config.symbol}${config.min}.`,
    };
  }
  if (amount > config.max) {
    return {
      error: `Please contact us for donations above ${config.symbol}${config.max.toLocaleString()}.`,
    };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // ── Non-NGN via Stripe ──────────────────────────────────────────────────
  if (currency !== "NGN") {
    try {
      assertStripeConfigured();
    } catch (err) {
      console.error("[initiateDonation] Stripe not configured:", err);
      return {
        error:
          "International donations are temporarily unavailable. Please choose NGN, or contact us.",
      };
    }

    let stripeUrl: string | null = null;
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: email,
        submit_type: "donate",
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              unit_amount: toStripeMinor(amount),
              product_data: {
                name: `Donation to YIF — ${cause}`,
                description:
                  frequency === "monthly"
                    ? "Monthly donation (one-time charge; recurring setup coming soon)"
                    : "One-time donation",
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${appUrl}/payment/stripe-callback?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/donate`,
        metadata: {
          purpose: "DONATION",
          cause,
          frequency,
          customerName: name,
          fullName: name,
        },
      });

      const amountNaira = currency === "USD" ? usdToNgn(amount) : amount; // store EUR/GBP raw too
      await recordTransactionInit({
        provider: "stripe",
        reference: session.id,
        purpose: "DONATION",
        amountNaira,
        currency,
        customerEmail: email,
        customerName: name,
        metadata: { cause, frequency, currency, originalAmount: amount },
      }).catch((err) =>
        console.error("[initiateDonation] tx init record failed:", err),
      );

      stripeUrl = session.url;
    } catch (err) {
      console.error("[initiateDonation] Stripe init failed:", err);
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
  try {
    const result = await paystackRequest<TransactionInitData>(
      "/transaction/initialize",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          amount: toSmallestUnit(amount).toString(),
          currency,
          callback_url: `${appUrl}/payment/callback`,
          metadata: {
            cancel_action: `${appUrl}/donate`,
            custom_fields: [
              {
                display_name: "Full Name",
                variable_name: "full_name",
                value: name,
              },
              { display_name: "Cause", variable_name: "cause", value: cause },
              {
                display_name: "Type",
                variable_name: "donation_type",
                value: "donation",
              },
              {
                display_name: "Frequency",
                variable_name: "frequency",
                value: frequency,
              },
            ],
          },
        }),
      },
    );

    await recordTransactionInit({
      reference: result.data.reference,
      purpose: "DONATION",
      amountNaira: amount,
      currency,
      customerEmail: email,
      customerName: name,
      metadata: { cause, frequency, currency },
    }).catch((err) =>
      console.error("[initiateDonation] tx init record failed:", err),
    );

    redirect(result.data.authorization_url);
  } catch (err: unknown) {
    if (
      err !== null &&
      typeof err === "object" &&
      "message" in err &&
      typeof (err as { message: unknown }).message === "string" &&
      (err as { message: string }).message.startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
    const msg =
      err instanceof Error
        ? err.message
        : "Payment initialisation failed. Please try again.";
    return { error: msg };
  }
  // redirect() throws, so this is unreachable — satisfies TypeScript's return-type check
  return {};
}
