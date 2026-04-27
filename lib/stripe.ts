// lib/stripe.ts — server-side only. Never import from client components.

import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

/**
 * Singleton Stripe client. We don't throw at module load so the rest of the
 * app keeps building when STRIPE_SECRET_KEY is missing — only Stripe code
 * paths fail (they call assertStripeConfigured first).
 */
export const stripe = new Stripe(key ?? "sk_test_placeholder_not_configured", {
  // Pin to the SDK's bundled API version (avoids drift between SDK + account default).
  typescript: true,
  appInfo: {
    name: "YIF",
    url: "https://yif.org",
  },
});

export function assertStripeConfigured(): void {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Configure Stripe in .env to accept non-NGN payments.",
    );
  }
}

/** Convert a major-unit amount (e.g. 25.50 USD) to Stripe minor units (cents). */
export const toStripeMinor = (amount: number): number =>
  Math.round(amount * 100);

/** Convert Stripe minor units (cents) back to a major-unit amount. */
export const fromStripeMinor = (minor: number): number => minor / 100;
