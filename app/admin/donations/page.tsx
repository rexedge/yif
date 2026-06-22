import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export const metadata: Metadata = { title: "Admin — Donations | YIF" };

function formatNaira(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}k`;
  return `₦${amount.toLocaleString()}`;
}

function getCause(metadata: Prisma.JsonValue): string {
  if (
    metadata &&
    typeof metadata === "object" &&
    !Array.isArray(metadata) &&
    "cause" in metadata &&
    typeof (metadata as Record<string, unknown>).cause === "string"
  ) {
    return (metadata as Record<string, string>).cause;
  }
  return "General Fund";
}

export default async function AdminDonationsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const BASE = { purpose: "DONATION" as const, status: "SUCCESS" as const };

  const CURRENCY_SYMBOLS: Record<string, string> = { NGN: "₦", USD: "$", GBP: "£", EUR: "€" };

  function fmtAmount(amount: number, currency: string): string {
    const sym = CURRENCY_SYMBOLS[currency] ?? currency;
    return `${sym}${amount.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Group aggregates by currency so we never mix units
  const [allTimeByCurrency, thisYearByCurrency, completedCount, donations] =
    await Promise.all([
      prisma.transaction.groupBy({
        by: ["currency"],
        where: BASE,
        _sum: { amount: true },
        _avg: { amount: true },
        orderBy: { currency: "asc" },
      }),
      prisma.transaction.groupBy({
        by: ["currency"],
        where: { ...BASE, createdAt: { gte: startOfYear } },
        _sum: { amount: true },
        orderBy: { currency: "asc" },
      }),
      prisma.transaction.count({ where: BASE }),
      prisma.transaction.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        where: BASE,
        select: {
          id: true,
          reference: true,
          customerName: true,
          customerEmail: true,
          amount: true,
          currency: true,
          netAmount: true,
          channel: true,
          status: true,
          createdAt: true,
          paidAt: true,
          metadata: true,
        },
      }),
    ]);

  function summariseByCurrency(rows: { currency: string; _sum: { amount: unknown } }[]): string {
    const parts = rows
      .filter((g) => Number(g._sum.amount ?? 0) > 0)
      .map((g) => fmtAmount(Number(g._sum.amount ?? 0), g.currency));
    return parts.join(" · ") || "₦0";
  }

  const totalAllLabel = summariseByCurrency(allTimeByCurrency);
  const totalYearLabel = summariseByCurrency(thisYearByCurrency);

  // Average: only meaningful per-currency; show NGN avg or first available
  const ngnAvg = allTimeByCurrency.find((g) => g.currency === "NGN");
  const avgLabel = ngnAvg
    ? formatNaira(Number(ngnAvg._avg?.amount ?? 0))
    : allTimeByCurrency[0]
      ? fmtAmount(Number(allTimeByCurrency[0]._avg?.amount ?? 0), allTimeByCurrency[0].currency)
      : "₦0";

  // Cause breakdown — NGN only (mixing currencies in a % bar is meaningless)
  const ngnDonations = donations.filter((d) => d.currency === "NGN");
  const causeMap = new Map<string, number>();
  for (const d of ngnDonations) {
    const cause = getCause(d.metadata);
    causeMap.set(cause, (causeMap.get(cause) ?? 0) + Number(d.amount));
  }
  const causeTotal = [...causeMap.values()].reduce((s, v) => s + v, 0) || 1;
  const CAUSES = [...causeMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, amt]) => ({
      name,
      amount: formatNaira(amt),
      pct: Math.round((amt / causeTotal) * 100),
    }));

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-terracotta)] mb-1">
            Admin Panel
          </p>
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Donations
          </h1>
          <p className="mt-1 text-white/40 text-sm">
            Financial overview and donor report
          </p>
        </div>
        <a
          href="/api/admin/export/transactions?purpose=DONATION"
          className="rounded-xl bg-white/6 border border-white/10 text-white/60 px-5 py-2.5 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors"
        >
          Export CSV
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        {[
          { label: "Total Raised (All Time)", value: totalAllLabel },
          { label: "This Year", value: totalYearLabel },
          { label: "Avg Donation (NGN)", value: avgLabel },
          { label: "Completed Donations", value: String(completedCount) },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-white/5 border border-white/8 px-5 py-4"
          >
            <p className="text-xs text-white/40 font-medium uppercase tracking-wide mb-1.5">
              {s.label}
            </p>
            <p className="font-display text-2xl font-bold text-white">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        {/* Cause Breakdown */}
        <div className="rounded-2xl bg-white/5 border border-white/8 px-6 py-6">
          <h2 className="font-display text-lg font-semibold text-white mb-1">
            By Cause
          </h2>
          <p className="text-xs text-white/30 mb-5">NGN donations only</p>
          <div className="space-y-4">
            {CAUSES.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white/60 font-medium">
                    {c.name}
                  </span>
                  <span className="text-xs text-white/50 font-medium">
                    {c.amount}
                  </span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--yif-gold)]"
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
                <p className="text-xs text-white/25 mt-1">{c.pct}% of total</p>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly trend (visual placeholder) */}
        <div className="lg:col-span-2 rounded-2xl bg-white/5 border border-white/8 px-6 py-6">
          <h2 className="font-display text-lg font-semibold text-white mb-5">
            Monthly Donations — 2025
          </h2>
          <div className="flex items-end gap-2 h-32">
            {[28, 45, 35, 60, 48, 72, 55, 80, 65, 90, 78, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-sm bg-[var(--yif-gold)]/40 hover:bg-[var(--yif-gold)]/70 transition-colors"
                  style={{ height: `${h}%` }}
                />
                <span className="text-xs text-white/20 hidden sm:block">
                  {
                    [
                      "J",
                      "F",
                      "M",
                      "A",
                      "M",
                      "J",
                      "J",
                      "A",
                      "S",
                      "O",
                      "N",
                      "D",
                    ][i]
                  }
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="rounded-2xl bg-white/5 border border-white/8 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8">
          <h2 className="font-display text-lg font-semibold text-white">
            Recent Donations
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-5 py-3 text-xs text-white/40 font-medium uppercase tracking-wide">
                  Donor
                </th>
                <th className="text-left px-4 py-3 text-xs text-white/40 font-medium uppercase tracking-wide hidden sm:table-cell">
                  Cause
                </th>
                <th className="text-left px-4 py-3 text-xs text-white/40 font-medium uppercase tracking-wide">
                  Amount
                </th>
                <th className="text-left px-4 py-3 text-xs text-white/40 font-medium uppercase tracking-wide hidden md:table-cell">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-xs text-white/40 font-medium uppercase tracking-wide hidden lg:table-cell">
                  Reference
                </th>
                <th className="text-left px-4 py-3 text-xs text-white/40 font-medium uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {donations.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-white/30 text-sm"
                  >
                    No donations yet.
                  </td>
                </tr>
              ) : (
                donations.map((d) => (
                  <tr key={d.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3.5 text-white/80">
                      <div className="font-medium text-sm">
                        {d.customerName ?? "Anonymous"}
                      </div>
                      <div className="text-xs text-white/40">
                        {d.customerEmail}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-white/40 text-xs hidden sm:table-cell">
                      {getCause(d.metadata)}
                    </td>
                    <td className="px-4 py-3.5 text-white/80 font-semibold text-sm">
                      {fmtAmount(Number(d.amount), d.currency)}
                    </td>
                    <td className="px-4 py-3.5 text-white/35 text-xs hidden md:table-cell">
                      {(d.paidAt ?? d.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-white/25 text-xs hidden lg:table-cell">
                      {d.reference}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full border bg-green-500/10 text-green-400 border-green-500/20">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
