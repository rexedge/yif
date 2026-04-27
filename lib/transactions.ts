import { prisma } from "@/lib/prisma";
import { fromKobo, type TransactionVerifyData } from "@/lib/paystack";
import type { Prisma } from "@/generated/prisma/client";
import type {
  TransactionPurpose,
  TransactionStatus,
} from "@/generated/prisma/enums";

/**
 * Record a freshly-initialised Paystack transaction in PENDING state.
 * Idempotent: if the reference already exists it updates the row.
 */
export async function recordTransactionInit(input: {
  reference: string;
  purpose: TransactionPurpose;
  amountNaira: number;
  currency?: string;
  provider?: "paystack" | "stripe";
  customerEmail: string;
  customerName?: string | null;
  customerPhone?: string | null;
  userId?: string | null;
  memberId?: string | null;
  ticketId?: string | null;
  donationId?: string | null;
  metadata?: Prisma.InputJsonValue;
}) {
  const data = {
    provider: input.provider ?? "paystack",
    reference: input.reference,
    purpose: input.purpose,
    status: "PENDING" as TransactionStatus,
    amount: input.amountNaira,
    currency: input.currency ?? "NGN",
    customerEmail: input.customerEmail,
    customerName: input.customerName ?? null,
    customerPhone: input.customerPhone ?? null,
    userId: input.userId ?? null,
    memberId: input.memberId ?? null,
    ticketId: input.ticketId ?? null,
    donationId: input.donationId ?? null,
    metadata: input.metadata,
  };

  return prisma.transaction.upsert({
    where: { reference: input.reference },
    update: data,
    create: data,
  });
}

const STATUS_MAP: Record<TransactionVerifyData["status"], TransactionStatus> = {
  success: "SUCCESS",
  failed: "FAILED",
  abandoned: "ABANDONED",
};

/**
 * Persist the result of `/transaction/verify/:reference` against an existing
 * Transaction row (or create one if the init step somehow missed it).
 */
export async function recordTransactionVerified(
  data: TransactionVerifyData,
  fallback?: { purpose?: TransactionPurpose; userId?: string | null },
) {
  const status = STATUS_MAP[data.status] ?? "PENDING";
  const amount = fromKobo(data.amount);
  const fees = data.fees != null ? fromKobo(data.fees) : null;
  const netAmount = fees != null ? amount - fees : null;

  const update = {
    providerTxId: String(data.id),
    status,
    amount,
    fees,
    netAmount,
    currency: data.currency ?? "NGN",
    channel: data.channel ?? null,
    cardBrand: data.authorization?.brand ?? null,
    cardLast4: data.authorization?.last4 ?? null,
    cardBank: data.authorization?.bank ?? null,
    gatewayResponse: data.gateway_response ?? null,
    ipAddress: data.ip_address ?? null,
    customerEmail: data.customer.email,
    customerName:
      [data.customer.first_name, data.customer.last_name]
        .filter(Boolean)
        .join(" ") || null,
    customerPhone: data.customer.phone ?? null,
    paidAt: data.paid_at ? new Date(data.paid_at) : null,
    rawResponse: data as unknown as Prisma.InputJsonValue,
  };

  return prisma.transaction.upsert({
    where: { reference: data.reference },
    update,
    create: {
      provider: "paystack",
      reference: data.reference,
      purpose: fallback?.purpose ?? "OTHER",
      userId: fallback?.userId ?? null,
      ...update,
    },
  });
}
