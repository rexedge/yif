import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NotesForm } from "./NotesForm";

export const metadata: Metadata = { title: "Transaction | YIF Admin" };

const STATUS_STYLES: Record<string, string> = {
  SUCCESS: "bg-green-500/15 text-green-400 border-green-500/20",
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  FAILED: "bg-red-500/15 text-red-400 border-red-500/20",
  ABANDONED: "bg-white/10 text-white/60 border-white/15",
  REVERSED: "bg-purple-500/15 text-purple-400 border-purple-500/20",
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

function money(
  amount: number | null | undefined,
  currency = "NGN",
): string {
  if (amount == null) return "—";
  const sym = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  return `${sym}${Number(amount).toLocaleString("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(d: Date | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const { id } = await params;
  const tx = await prisma.transaction.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  if (!tx) notFound();

  const rows: Array<[string, React.ReactNode]> = [
    [
      "Reference",
      <span key="r" className="font-mono text-xs">
        {tx.reference}
      </span>,
    ],
    ["Provider", tx.provider],
    ["Provider Tx ID", tx.providerTxId ?? "—"],
    ["Purpose", tx.purpose],
    ["Amount", money(Number(tx.amount), tx.currency)],
    ["Fees", tx.fees != null ? money(Number(tx.fees), tx.currency) : "—"],
    ["Net Received", tx.netAmount != null ? money(Number(tx.netAmount), tx.currency) : "—"],
    ["Currency", tx.currency],
    [
      "NGN Equivalent",
      tx.baseAmount != null
        ? `${money(Number(tx.baseAmount))}${
            tx.fxRate != null && tx.currency !== "NGN"
              ? ` (@ ₦${Number(tx.fxRate).toLocaleString("en", { maximumFractionDigits: 2 })}/${tx.currency})`
              : ""
          }`
        : "—",
    ],
    ["Channel", tx.channel ?? "—"],
    [
      "Card",
      tx.cardLast4
        ? `${tx.cardBrand ?? "card"} •••• ${tx.cardLast4}${
            tx.cardBank ? ` (${tx.cardBank})` : ""
          }`
        : "—",
    ],
    ["Gateway Response", tx.gatewayResponse ?? "—"],
    ["IP Address", tx.ipAddress ?? "—"],
    ["Customer Name", tx.customerName ?? "—"],
    ["Customer Email", tx.customerEmail],
    ["Customer Phone", tx.customerPhone ?? "—"],
    [
      "Linked User",
      tx.user ? (
        <Link
          key="u"
          href={`/admin/members?q=${encodeURIComponent(tx.user.email)}`}
          className="text-[var(--yif-terracotta)] hover:underline"
        >
          {tx.user.name} ({tx.user.email})
        </Link>
      ) : (
        "—"
      ),
    ],
    ["Member ID", tx.memberId ?? "—"],
    ["Ticket ID", tx.ticketId ?? "—"],
    ["Donation ID", tx.donationId ?? "—"],
    ["Paid At", formatDate(tx.paidAt)],
    ["Initiated", formatDate(tx.createdAt)],
    ["Last Updated", formatDate(tx.updatedAt)],
  ];

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/admin/transactions"
          className="text-xs text-white/50 hover:text-white"
        >
          ← Back to transactions
        </Link>
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-terracotta)] mb-1">
            Transaction
          </p>
          <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl break-all">
            {tx.reference}
          </h1>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            STATUS_STYLES[tx.status] ?? STATUS_STYLES.PENDING
          }`}
        >
          {tx.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl bg-white/5 border border-white/8 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/8">
            <h2 className="font-display text-base font-semibold text-white">
              Details
            </h2>
          </div>
          <dl className="divide-y divide-white/5">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-3 gap-4 px-6 py-3 text-sm"
              >
                <dt className="text-white/40">{label}</dt>
                <dd className="col-span-2 text-white/85 break-words">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-6">
          <NotesForm txId={tx.id} initialNote={tx.notes} />

          {tx.metadata != null && (
            <div className="rounded-2xl bg-white/5 border border-white/8 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/8">
                <h2 className="font-display text-base font-semibold text-white">
                  Init Metadata
                </h2>
                <p className="text-xs text-white/40 mt-0.5">
                  Sent to Paystack on initialise
                </p>
              </div>
              <pre className="px-6 py-4 text-[11px] text-white/70 overflow-x-auto whitespace-pre-wrap break-all">
                {JSON.stringify(tx.metadata, null, 2)}
              </pre>
            </div>
          )}

          {tx.rawResponse != null && (
            <div className="rounded-2xl bg-white/5 border border-white/8 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/8">
                <h2 className="font-display text-base font-semibold text-white">
                  Verify Response
                </h2>
                <p className="text-xs text-white/40 mt-0.5">
                  Full payload from Paystack /transaction/verify
                </p>
              </div>
              <pre className="px-6 py-4 text-[11px] text-white/70 overflow-x-auto whitespace-pre-wrap break-all max-h-[600px]">
                {JSON.stringify(tx.rawResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
