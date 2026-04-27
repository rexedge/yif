import type { Metadata } from "next";
import Link from "next/link";
import { stripe, fromStripeMinor } from "@/lib/stripe";
import { fulfillStripeCheckoutSession } from "@/lib/stripe-fulfillment";

export const metadata: Metadata = {
  title: "Payment Status | YIF",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function StripePaymentCallbackPage({
  searchParams,
}: Props) {
  const params = await searchParams;
  const sessionId = Array.isArray(params.session_id)
    ? params.session_id[0]
    : (params.session_id ?? "");

  if (!sessionId) {
    return (
      <StatusCard
        type="error"
        message="No payment session found. Please try again."
      />
    );
  }

  let session: Awaited<
    ReturnType<typeof stripe.checkout.sessions.retrieve>
  > | null = null;
  let fetchError = "";
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "payment_intent.latest_charge"],
    });
  } catch (err) {
    fetchError =
      err instanceof Error ? err.message : "Could not verify payment.";
  }

  if (fetchError || !session) {
    return (
      <StatusCard
        type="error"
        message={
          fetchError ||
          "Unable to verify your payment. If you were charged, please contact support."
        }
      />
    );
  }

  const success = session.payment_status === "paid";

  // Fallback fulfillment path (verification method #2): if the webhook hasn't
  // arrived yet, fulfill from this session retrieval. Idempotent.
  if (success) {
    await fulfillStripeCheckoutSession(session).catch((err) => {
      console.error("[stripe-callback] fulfillment failed:", err);
    });
  }

  const amountPaid = fromStripeMinor(session.amount_total ?? 0);
  const currency = (session.currency ?? "usd").toUpperCase();
  const meta = session.metadata ?? {};
  const purpose = meta.purpose ?? "";
  const eventTitle = meta.eventTitle ?? "";
  const tierName = meta.tierName ?? "";
  const quantity = meta.quantity ?? "1";
  const cause = meta.cause ?? "";
  const fullName = meta.customerName ?? meta.fullName ?? "";
  const paymentType = meta.paymentType ?? "";
  const membershipTier = meta.membershipTier ?? "";
  const fromTier = meta.fromTier ?? "";
  const toTier = meta.toTier ?? "";
  const customerEmail =
    session.customer_details?.email ?? session.customer_email ?? "";

  const isMembershipFlow =
    paymentType === "membership" ||
    paymentType === "membership_upgrade" ||
    paymentType === "membership_renewal";

  return (
    <div className="min-h-screen bg-[var(--yif-cream)] py-24 px-4">
      <div className="mx-auto max-w-lg">
        {success ? (
          <div className="rounded-2xl bg-white border border-green-100 shadow-lg p-8 text-center animate-fade-up">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                aria-hidden="true"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  d="M8 16l6 6 10-12"
                  stroke="#16a34a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-green-600 mb-2">
              Payment Successful
            </p>
            <h1 className="font-display text-3xl font-semibold text-[var(--yif-navy)] mb-3">
              {paymentType === "membership"
                ? "Welcome to YIF!"
                : paymentType === "membership_upgrade"
                  ? "Tier Upgraded!"
                  : paymentType === "membership_renewal"
                    ? "Membership Renewed!"
                    : "You're confirmed!"}
            </h1>

            {paymentType === "membership" ? (
              <p className="text-[var(--muted)] mb-6">
                Your{" "}
                <strong className="text-[var(--yif-navy)]">
                  {membershipTier
                    ? membershipTier.charAt(0) +
                      membershipTier.slice(1).toLowerCase()
                    : "Member"}
                </strong>{" "}
                membership is now active.
              </p>
            ) : paymentType === "membership_upgrade" ? (
              <p className="text-[var(--muted)] mb-6">
                You&rsquo;ve moved from{" "}
                <strong className="text-[var(--yif-navy)]">
                  {fromTier.charAt(0) + fromTier.slice(1).toLowerCase()}
                </strong>{" "}
                to{" "}
                <strong className="text-[var(--yif-navy)]">
                  {toTier.charAt(0) + toTier.slice(1).toLowerCase()}
                </strong>
                .
              </p>
            ) : purpose === "DONATION" ? (
              <p className="text-[var(--muted)] mb-6">
                Thank you for your gift to{" "}
                <strong className="text-[var(--yif-navy)]">
                  {cause || "the YIF General Fund"}
                </strong>
                .
              </p>
            ) : eventTitle ? (
              <p className="text-[var(--muted)] mb-6">
                {quantity} × {tierName} for{" "}
                <strong className="text-[var(--yif-navy)]">{eventTitle}</strong>
              </p>
            ) : null}

            <div className="rounded-xl bg-[var(--yif-cream)] border border-[var(--yif-cream-dark)] p-4 mb-6 text-sm text-left">
              <div className="flex justify-between py-1.5 border-b border-[var(--yif-cream-dark)]">
                <span className="text-[var(--muted)]">Amount Paid</span>
                <span className="font-semibold text-[var(--yif-navy)]">
                  {currency} {amountPaid.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[var(--yif-cream-dark)]">
                <span className="text-[var(--muted)]">Paid by</span>
                <span className="font-semibold text-[var(--yif-navy)]">
                  {customerEmail}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[var(--muted)]">Reference</span>
                <span className="font-mono text-xs text-[var(--yif-charcoal)] break-all">
                  {session.id}
                </span>
              </div>
            </div>

            <p className="text-xs text-[var(--muted)] mb-6">
              {fullName ? `${fullName}, a` : "A"} confirmation has been sent to{" "}
              {customerEmail}. Please save your reference for records.
            </p>

            {isMembershipFlow ? (
              <Link
                href="/dashboard/membership"
                className="inline-block rounded-lg bg-[var(--yif-navy)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--yif-navy-light)] transition-colors"
              >
                Go to Member Portal
              </Link>
            ) : purpose === "DONATION" ? (
              <Link
                href="/donate"
                className="inline-block rounded-lg bg-[var(--yif-navy)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--yif-navy-light)] transition-colors"
              >
                Back to Donate
              </Link>
            ) : (
              <Link
                href="/events"
                className="inline-block rounded-lg bg-[var(--yif-navy)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--yif-navy-light)] transition-colors"
              >
                View More Events
              </Link>
            )}
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-red-100 shadow-lg p-8 text-center animate-fade-up">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                aria-hidden="true"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  d="M10 22L22 10M10 10l12 12"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-600 mb-2">
              Payment {session.status === "expired" ? "Expired" : "Incomplete"}
            </p>
            <h1 className="font-display text-3xl font-semibold text-[var(--yif-navy)] mb-3">
              Transaction unsuccessful
            </h1>
            <p className="text-[var(--muted)] mb-6">
              Your payment was not completed. You have not been charged.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/events"
                className="rounded-lg border border-[var(--yif-navy)] px-5 py-2.5 text-sm font-semibold text-[var(--yif-navy)] hover:bg-[var(--yif-navy)] hover:text-white transition-colors"
              >
                Back to Events
              </Link>
              <Link
                href={`mailto:info@yif.org?subject=Payment%20Issue&body=Reference:%20${encodeURIComponent(session.id)}`}
                className="rounded-lg bg-[var(--yif-gold)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--yif-gold-light)] transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusCard({ type, message }: { type: "error"; message: string }) {
  void type;
  return (
    <div className="min-h-screen bg-[var(--yif-cream)] py-24 px-4">
      <div className="mx-auto max-w-lg">
        <div className="rounded-2xl bg-white border border-red-100 shadow-lg p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              aria-hidden="true"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M10 22L22 10M10 10l12 12"
                stroke="#dc2626"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-semibold text-[var(--yif-navy)] mb-3">
            Something went wrong
          </h1>
          <p className="text-[var(--muted)] mb-6">{message}</p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-[var(--yif-navy)] px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
