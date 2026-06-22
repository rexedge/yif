import type { Metadata } from "next";
import Link from "next/link";
import {
  paystackRequest,
  fromKobo,
  type TransactionVerifyData,
} from "@/lib/paystack";
import { recordTransactionVerified } from "@/lib/transactions";
import {
  sendTicketConfirmation,
  sendDonationThankYou,
  sendMembershipWelcome,
} from "@/lib/send-email";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Payment Status | YIF",
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PaymentCallbackPage({ searchParams }: Props) {
  const params = await searchParams;
  const reference = Array.isArray(params.reference)
    ? params.reference[0]
    : (params.reference ?? "");

  if (!reference) {
    return (
      <StatusCard
        type="error"
        message="No payment reference found. Please try again."
      />
    );
  }

  let data: TransactionVerifyData | null = null;
  let fetchError = "";

  try {
    const result = await paystackRequest<TransactionVerifyData>(
      `/transaction/verify/${encodeURIComponent(reference)}`,
    );
    data = result.data;
  } catch (err) {
    fetchError =
      err instanceof Error ? err.message : "Could not verify payment.";
  }

  if (fetchError || !data) {
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

  const success = data.status === "success";
  const amountPaid = fromKobo(data.amount);
  const currency = data.currency ?? "NGN";

  // Extract custom fields from metadata
  const customFields =
    (
      data.metadata as
        | { custom_fields?: Array<{ variable_name: string; value: string }> }
        | undefined
    )?.custom_fields ?? [];
  const getField = (key: string) =>
    customFields.find((f) => f.variable_name === key)?.value ?? "";
  const eventTitle = getField("event_title");
  const tierName = getField("tier_name");
  const quantity = getField("quantity");
  const donationType = getField("donation_type");
  const cause = getField("cause");
  const frequency = getField("frequency");
  const fullName = getField("full_name");
  const paymentType = getField("payment_type");
  const memberId = getField("member_id");
  const membershipTier = getField("membership_tier");
  const tierId = getField("tier_id");
  const toTierId = getField("to_tier_id");

  const isMembershipFlow =
    paymentType === "membership" ||
    paymentType === "membership_upgrade" ||
    paymentType === "membership_renewal";

  // Persist the verify result so admins can audit it (fees, channel, raw payload).
  const purpose = isMembershipFlow
    ? "MEMBERSHIP"
    : eventTitle
      ? "TICKET"
      : donationType === "donation"
        ? "DONATION"
        : "OTHER";

  // Link transaction to a registered user if their email matches.
  const linkedUser = await prisma.user
    .findUnique({ where: { email: data.customer.email }, select: { id: true } })
    .catch(() => null);

  await recordTransactionVerified(data, { purpose, userId: linkedUser?.id ?? null }).catch((err) => {
    console.error("[callback] tx verify record failed:", err);
  });

  // Membership activation — run before sending email
  let membershipNumber = "";
  if (success && paymentType === "membership" && memberId && tierId) {
    try {
      const year = new Date().getFullYear();
      const count = await prisma.member.count({ where: { status: "ACTIVE" } });
      membershipNumber = `YIF-${year}-${String(count + 1).padStart(4, "0")}`;

      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      await prisma.member.update({
        where: { id: memberId },
        data: {
          tierId,
          status: "ACTIVE",
          expiresAt,
          membershipNumber,
          paystackRef: data.reference,
        },
      });
    } catch (err) {
      console.error("[callback] membership activation failed:", err);
    }
  }

  // Membership tier change (upgrade or renewal)
  if (
    success &&
    (paymentType === "membership_upgrade" ||
      paymentType === "membership_renewal") &&
    memberId &&
    toTierId
  ) {
    try {
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      await prisma.member.update({
        where: { id: memberId },
        data: {
          tierId: toTierId,
          status: "ACTIVE",
          expiresAt,
          pendingTierId: null,
          paystackRef: data.reference,
        },
      });
    } catch (err) {
      console.error("[callback] membership tier change failed:", err);
    }
  }

  // Send transactional email — failures must not block page render
  if (success) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.yifww.org";
    const customerEmail = data.customer.email;
    const formattedAmount = `${currency} ${amountPaid.toLocaleString()}`;

    if (eventTitle) {
      void sendTicketConfirmation({
        recipientName: fullName || customerEmail,
        eventTitle,
        tierName,
        quantity: Number(quantity) || 1,
        amountPaid: formattedAmount,
        eventDate: "",
        eventTime: "",
        eventLocation: "",
        reference: data.reference,
        recipientEmail: customerEmail,
        eventsUrl: `${appUrl}/events`,
      }).catch((err: unknown) => {
        console.error("[callback] ticket email failed:", err);
      });
    } else if (donationType === "donation") {
      void sendDonationThankYou({
        recipientName: fullName || customerEmail,
        cause: cause || "General Fund",
        amountDonated: formattedAmount,
        frequency: frequency || "one-time",
        reference: data.reference,
        recipientEmail: customerEmail,
        donateUrl: `${appUrl}/donate`,
      }).catch((err: unknown) => {
        console.error("[callback] donation email failed:", err);
      });
    } else if (paymentType === "membership" && membershipNumber) {
      const expiresDate = new Date();
      expiresDate.setFullYear(expiresDate.getFullYear() + 1);
      const tierLabel =
        membershipTier.charAt(0) + membershipTier.slice(1).toLowerCase();

      void sendMembershipWelcome({
        recipientName: fullName || customerEmail,
        tierName: tierLabel,
        membershipNumber,
        amountPaid: formattedAmount,
        expiresAt: expiresDate.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        reference: data.reference,
        recipientEmail: customerEmail,
        dashboardUrl: `${appUrl}/dashboard`,
      }).catch((err: unknown) => {
        console.error("[callback] membership email failed:", err);
      });
    }
  }

  return (
    <div className="min-h-screen bg-[var(--yif-cream)] py-24 px-4">
      <div className="mx-auto max-w-lg">
        {success ? (
          <div className="rounded-2xl bg-white border border-green-100 shadow-lg p-8 text-center animate-fade-up">
            {/* Icon */}
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
                    : "You\'re confirmed!"}
            </h1>

            {paymentType === "membership" ? (
              <p className="text-[var(--muted)] mb-6">
                Your{" "}
                <strong className="text-[var(--yif-navy)]">
                  {membershipTier.charAt(0) +
                    membershipTier.slice(1).toLowerCase()}
                </strong>{" "}
                membership is now active.
              </p>
            ) : paymentType === "membership_upgrade" ? (
              <p className="text-[var(--muted)] mb-6">
                Your membership tier has been upgraded — your new benefits start
                immediately.
              </p>
            ) : paymentType === "membership_renewal" ? (
              <p className="text-[var(--muted)] mb-6">
                Your{" "}
                <strong className="text-[var(--yif-navy)]">
                  {membershipTier || "membership"}
                </strong>{" "}
                has been renewed for another year.
              </p>
            ) : eventTitle ? (
              <p className="text-[var(--muted)] mb-6">
                {quantity} × {tierName} for{" "}
                <strong className="text-[var(--yif-navy)]">{eventTitle}</strong>
              </p>
            ) : null}

            <div className="rounded-xl bg-[var(--yif-cream)] border border-[var(--yif-cream-dark)] p-4 mb-6 text-sm text-left">
              {membershipNumber && (
                <div className="flex justify-between py-1.5 border-b border-[var(--yif-cream-dark)]">
                  <span className="text-[var(--muted)]">Membership No.</span>
                  <span className="font-mono text-xs text-[var(--yif-charcoal)]">
                    {membershipNumber}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-[var(--yif-cream-dark)]">
                <span className="text-[var(--muted)]">Amount Paid</span>
                <span className="font-semibold text-[var(--yif-navy)]">
                  {currency} {amountPaid.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[var(--yif-cream-dark)]">
                <span className="text-[var(--muted)]">Paid by</span>
                <span className="font-semibold text-[var(--yif-navy)]">
                  {data.customer.email}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[var(--muted)]">Reference</span>
                <span className="font-mono text-xs text-[var(--yif-charcoal)] break-all">
                  {data.reference}
                </span>
              </div>
            </div>

            <p className="text-xs text-[var(--muted)] mb-6">
              A confirmation has been sent to {data.customer.email}. Please save
              your reference number for records.
            </p>

            {isMembershipFlow ? (
              <Link
                href="/dashboard/membership"
                className="inline-block rounded-lg bg-[var(--yif-navy)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--yif-navy-light)] transition-colors"
              >
                Go to Member Portal
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
              Payment {data.status === "abandoned" ? "Abandoned" : "Failed"}
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
                href={`mailto:info@yif.org?subject=Payment%20Issue&body=Reference:%20${encodeURIComponent(reference)}`}
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
                d="M16 10v8M16 22v.01"
                stroke="#dc2626"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="16" cy="16" r="13" stroke="#dc2626" strokeWidth="2" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-semibold text-[var(--yif-navy)] mb-3">
            Something went wrong
          </h1>
          <p className="text-[var(--muted)] mb-6">{message}</p>
          <Link
            href="/events"
            className="inline-block rounded-lg bg-[var(--yif-navy)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--yif-navy-light)] transition-colors"
          >
            Back to Events
          </Link>
        </div>
      </div>
    </div>
  );
}
