// app/api/stripe/webhook/route.ts — Stripe webhook receiver.
// Must run on the Node.js runtime (not edge) so we can read the raw request
// body for signature verification.

import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import {
  fulfillStripeCheckoutSession,
  markStripeTransactionFailed,
} from "@/lib/stripe-fulfillment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[stripe webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  // Read the raw body for signature verification.
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[stripe webhook] Signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Re-retrieve with expanded payment_intent + latest_charge so we can
        // capture card details and accurate amounts.
        const fullSession = await stripe.checkout.sessions.retrieve(
          session.id,
          { expand: ["payment_intent", "payment_intent.latest_charge"] },
        );
        await fulfillStripeCheckoutSession(fullSession);
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await markStripeTransactionFailed(
          session.id,
          "Checkout session expired",
        );
        break;
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await markStripeTransactionFailed(session.id, "Async payment failed");
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        // Look up the originating session if possible.
        try {
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: pi.id,
            limit: 1,
          });
          const sessionId = sessions.data[0]?.id;
          if (sessionId) {
            await markStripeTransactionFailed(
              sessionId,
              pi.last_payment_error?.message ?? "Payment failed",
            );
          }
        } catch (err) {
          console.error(
            "[stripe webhook] could not look up session for failed PI:",
            err,
          );
        }
        break;
      }
      default:
        // Ignore other event types — we only care about Checkout outcomes.
        break;
    }
  } catch (err) {
    console.error("[stripe webhook] handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
