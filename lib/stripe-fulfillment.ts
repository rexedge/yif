// lib/stripe-fulfillment.ts — shared idempotent fulfillment for Stripe Checkout
// sessions. Called from both the webhook handler and the success callback page,
// so it must be safe to invoke multiple times for the same session.

import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { fromStripeMinor } from "@/lib/stripe";
import { convertToNgn } from "@/lib/fx";
import {
  sendTicketConfirmation,
  sendDonationThankYou,
  sendMembershipWelcome,
} from "@/lib/send-email";
import type { Prisma } from "@/generated/prisma/client";
import type {
  TransactionPurpose,
  TransactionStatus,
} from "@/generated/prisma/enums";

function mapPurpose(value: unknown): TransactionPurpose {
  if (
    value === "TICKET" ||
    value === "DONATION" ||
    value === "MEMBERSHIP" ||
    value === "OTHER"
  ) {
    return value;
  }
  return "OTHER";
}

/**
 * Persist a Stripe Checkout Session as a Transaction row and run the
 * appropriate fulfillment side-effects (membership activation, emails).
 *
 * Idempotent: relies on `Transaction.reference` (= session.id) being unique.
 * If a row already exists in SUCCESS state, side-effects are skipped.
 */
export async function fulfillStripeCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<void> {
  const meta = session.metadata ?? {};
  const purpose = mapPurpose(meta.purpose);

  const isPaid = session.payment_status === "paid";
  const status: TransactionStatus = isPaid
    ? "SUCCESS"
    : session.payment_status === "unpaid" && session.status === "expired"
      ? "ABANDONED"
      : isPaid
        ? "SUCCESS"
        : "PENDING";

  // Pull payment intent details if available (charge fees, card brand, etc).
  let pi: Stripe.PaymentIntent | null = null;
  if (session.payment_intent && typeof session.payment_intent === "object") {
    pi = session.payment_intent as Stripe.PaymentIntent;
  }
  const charge =
    pi && typeof pi.latest_charge === "object" && pi.latest_charge !== null
      ? (pi.latest_charge as Stripe.Charge)
      : null;

  const amountMinor =
    session.amount_total ?? pi?.amount_received ?? pi?.amount ?? 0;
  const currency = (session.currency ?? pi?.currency ?? "usd").toUpperCase();
  const amount = fromStripeMinor(amountMinor);

  const feeMinor = charge?.balance_transaction
    ? null // we'd need to expand balance_transaction to read fees; skip for now
    : null;
  const fees = feeMinor != null ? fromStripeMinor(feeMinor) : null;
  const netAmount = fees != null ? amount - fees : null;

  // Freeze the NGN-equivalent at fulfillment time for consolidated reporting.
  // Rates are cached in-memory, so converting cheaply covers all statuses.
  const fx = amount > 0 ? await convertToNgn(amount, currency).catch(() => null) : null;

  const customerEmail =
    session.customer_details?.email ??
    session.customer_email ??
    (typeof meta.customerEmail === "string" ? meta.customerEmail : "") ??
    "";
  const customerName =
    session.customer_details?.name ??
    (typeof meta.customerName === "string" ? meta.customerName : null);
  const customerPhone =
    session.customer_details?.phone ??
    (typeof meta.customerPhone === "string" ? meta.customerPhone : null);

  const update = {
    providerTxId: typeof pi?.id === "string" ? pi.id : null,
    status,
    amount,
    fees,
    netAmount,
    currency,
    baseAmount: fx?.baseAmount ?? null,
    baseCurrency: "NGN",
    fxRate: fx?.fxRate ?? null,
    channel: charge?.payment_method_details?.type ?? "card",
    cardBrand: charge?.payment_method_details?.card?.brand ?? null,
    cardLast4: charge?.payment_method_details?.card?.last4 ?? null,
    cardBank: null as string | null,
    gatewayResponse: charge?.outcome?.seller_message ?? null,
    ipAddress: null as string | null,
    customerEmail,
    customerName: customerName ?? null,
    customerPhone: customerPhone ?? null,
    paidAt: isPaid
      ? new Date((session.created ?? Math.floor(Date.now() / 1000)) * 1000)
      : null,
    rawResponse: JSON.parse(JSON.stringify(session)) as Prisma.InputJsonValue,
  };

  // Resolve userId from email so transactions are visible in the user's dashboard.
  const userRecord = customerEmail
    ? await prisma.user.findUnique({ where: { email: customerEmail }, select: { id: true } }).catch(() => null)
    : null;
  const userId = userRecord?.id ?? null;

  // Upsert keyed on session.id (stored as reference).
  const existing = await prisma.transaction.findUnique({
    where: { reference: session.id },
    select: { id: true, status: true, userId: true },
  });

  await prisma.transaction.upsert({
    where: { reference: session.id },
    update: { ...update, userId: existing?.userId ?? userId },
    create: {
      provider: "stripe",
      reference: session.id,
      purpose,
      userId,
      ...update,
    },
  });

  // Idempotency guard: only fire side-effects on the first SUCCESS transition.
  const alreadyFulfilled = existing?.status === "SUCCESS";
  if (!isPaid || alreadyFulfilled) return;

  await runFulfillmentSideEffects(session, meta, amount, currency);
}

async function runFulfillmentSideEffects(
  session: Stripe.Checkout.Session,
  meta: Stripe.Metadata,
  amount: number,
  currency: string,
): Promise<void> {
  const purpose = mapPurpose(meta.purpose);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.yifww.org";
  const recipientEmail =
    session.customer_details?.email ??
    session.customer_email ??
    (typeof meta.customerEmail === "string" ? meta.customerEmail : "");
  if (!recipientEmail) return;

  const fullName =
    session.customer_details?.name ??
    (typeof meta.customerName === "string" ? meta.customerName : "") ??
    "";
  const formattedAmount = `${currency} ${amount.toLocaleString()}`;

  if (purpose === "TICKET") {
    const eventTitle =
      typeof meta.eventTitle === "string" ? meta.eventTitle : "YIF Event";
    const tierName =
      typeof meta.tierName === "string" ? meta.tierName : "Delegate Pass";
    const quantity =
      typeof meta.quantity === "string" ? Number(meta.quantity) || 1 : 1;

    await sendTicketConfirmation({
      recipientName: fullName || recipientEmail,
      eventTitle,
      tierName,
      quantity,
      amountPaid: formattedAmount,
      eventDate: typeof meta.eventDate === "string" ? meta.eventDate : "",
      eventTime: typeof meta.eventTime === "string" ? meta.eventTime : "",
      eventLocation:
        typeof meta.eventLocation === "string" ? meta.eventLocation : "",
      reference: session.id,
      recipientEmail,
      eventsUrl: `${appUrl}/events`,
    }).catch((err: unknown) => {
      console.error("[stripe-fulfillment] ticket email failed:", err);
    });
    return;
  }

  if (purpose === "DONATION") {
    const cause = typeof meta.cause === "string" ? meta.cause : "General Fund";
    const frequency =
      typeof meta.frequency === "string" ? meta.frequency : "one-time";

    await sendDonationThankYou({
      recipientName: fullName || recipientEmail,
      cause,
      amountDonated: formattedAmount,
      frequency,
      reference: session.id,
      recipientEmail,
      donateUrl: `${appUrl}/donate`,
    }).catch((err: unknown) => {
      console.error("[stripe-fulfillment] donation email failed:", err);
    });
    return;
  }

  if (purpose === "MEMBERSHIP") {
    const memberId = typeof meta.memberId === "string" ? meta.memberId : "";
    const paymentType =
      typeof meta.paymentType === "string" ? meta.paymentType : "membership";
    const membershipTier =
      typeof meta.membershipTier === "string" ? meta.membershipTier : "";
    // tierId is the DB id of the target tier (set in all new checkout metadata)
    const tierId = typeof meta.tierId === "string" ? meta.tierId : "";
    const toTierId = typeof meta.toTierId === "string" ? meta.toTierId : tierId;

    let membershipNumber = "";
    try {
      if (paymentType === "membership" && memberId && tierId) {
        const year = new Date().getFullYear();
        const count = await prisma.member.count({
          where: { status: "ACTIVE" },
        });
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
            paystackRef: session.id,
          },
        });
      } else if (
        (paymentType === "membership_upgrade" ||
          paymentType === "membership_renewal") &&
        memberId &&
        toTierId
      ) {
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        await prisma.member.update({
          where: { id: memberId },
          data: {
            tierId: toTierId,
            status: "ACTIVE",
            expiresAt,
            pendingTierId: null,
            paystackRef: session.id,
          },
        });
      }
    } catch (err) {
      console.error("[stripe-fulfillment] membership update failed:", err);
    }

    if (paymentType === "membership" && membershipNumber) {
      const expiresDate = new Date();
      expiresDate.setFullYear(expiresDate.getFullYear() + 1);
      const tierLabel =
        membershipTier.charAt(0) + membershipTier.slice(1).toLowerCase();
      await sendMembershipWelcome({
        recipientName: fullName || recipientEmail,
        tierName: tierLabel,
        membershipNumber,
        amountPaid: formattedAmount,
        expiresAt: expiresDate.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        reference: session.id,
        recipientEmail,
        dashboardUrl: `${appUrl}/dashboard`,
      }).catch((err: unknown) => {
        console.error("[stripe-fulfillment] membership email failed:", err);
      });
    }
  }
}

/** Mark a transaction FAILED (e.g. on payment_intent.payment_failed). */
export async function markStripeTransactionFailed(
  reference: string,
  reason?: string,
): Promise<void> {
  await prisma.transaction
    .update({
      where: { reference },
      data: {
        status: "FAILED",
        gatewayResponse: reason ?? null,
      },
    })
    .catch(() => {
      // row may not exist (e.g. webhook arrived before init) — ignore
    });
}
