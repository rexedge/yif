// lib/stripe.ts — server-side only. Never import from client components.

import Stripe from "stripe";

/**
 * Lazy singleton Stripe client. The real `Stripe` instance is only constructed
 * on first property access, so importing this module during `next build` page
 * data collection (when STRIPE_SECRET_KEY may be absent) does not throw.
 * Code paths that actually need Stripe should call `assertStripeConfigured()`
 * first to surface a clear error.
 */
let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Configure Stripe in .env to accept non-NGN payments.",
    );
  }
  _stripe = new Stripe(key, {
    typescript: true,
    appInfo: {
      name: "YIF",
      url: "https://www.yifww.org",
    },
  });
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    return Reflect.get(getStripe() as object, prop, receiver);
  },
}) as Stripe;

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
