import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import {
  getRevenueSummary,
  getRevenueTimeSeries,
  getMembershipTierBreakdown,
  getTopDonationCauses,
  getRecentFailures,
  type Period,
} from "@/lib/reporting";
import {
  RevenueTrendChart,
  SourceSplitChart,
  TierDistributionChart,
} from "./RevenueCharts";
import { currencySymbol } from "@/lib/currency";

export const metadata: Metadata = { title: "Revenue — Admin | YIF" };

const PERIODS: { value: Period; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "1y", label: "1 year" },
  { value: "all", label: "All time" },
];

type Props = {
  searchParams: Promise<Record<string, string | undefined>>;
};

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n.toLocaleString()}`;
}

export default async function RevenuePage({ searchParams }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const params = await searchParams;
  const period: Period = (PERIODS.find((p) => p.value === params.period)?.value) ?? "30d";

  const [summary, timeSeries, tierBreakdown, topCauses, failures] =
    await Promise.all([
      getRevenueSummary(period),
      getRevenueTimeSeries(period),
      getMembershipTierBreakdown(),
      getTopDonationCauses(period),
      getRecentFailures(period),
    ]);

  const membershipRevenue =
    summary.totalByPurpose.find((p) => p.purpose === "MEMBERSHIP")?.total ?? 0;
  const ticketRevenue =
    summary.totalByPurpose.find((p) => p.purpose === "TICKET")?.total ?? 0;
  const donationRevenue =
    summary.totalByPurpose.find((p) => p.purpose === "DONATION")?.total ?? 0;

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-terracotta)] mb-1">
            Finance
          </p>
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Revenue Dashboard
          </h1>
          <p className="mt-1 text-white/40 text-sm">
            Real-time view of all income streams and payment performance.
          </p>
          <p className="mt-1 text-white/30 text-xs">
            All totals shown in USD, converted at payment-time FX rates and
            rounded down to the nearest dollar.
          </p>
        </div>
        <a
          href={`/api/admin/export/revenue?period=${period}`}
          className="rounded-xl border border-white/15 text-white/60 hover:text-white hover:border-white/30 px-4 py-2 text-sm font-medium transition-colors"
        >
          Export CSV
        </a>
      </div>

      {/* Period selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {PERIODS.map((p) => (
          <Link
            key={p.value}
            href={`/admin/revenue?period=${p.value}`}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              period === p.value
                ? "bg-[var(--yif-terracotta)] text-white"
                : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"
            }`}
          >
            {p.label}
          </Link>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 mb-8">
        {[
          { label: "Total Revenue (≈ USD)", value: fmt(summary.grandTotal), accent: "var(--yif-gold)" },
          { label: "Memberships", value: fmt(membershipRevenue), accent: "#c2873f" },
          { label: "Tickets", value: fmt(ticketRevenue), accent: "#2c4a8c" },
          { label: "Donations", value: fmt(donationRevenue), accent: "#b5502a" },
          {
            label: "Failed / Abandoned",
            value: String(summary.failedCount),
            accent: "#ef4444",
            sub: summary.failedCount > 0 ? fmt(summary.failedTotal) : undefined,
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl bg-white/5 border border-white/8 p-5"
          >
            <p className="text-xs text-white/40 mb-2">{card.label}</p>
            <p
              className="font-display text-2xl font-bold"
              style={{ color: card.accent }}
            >
              {card.value}
            </p>
            {card.sub && (
              <p className="text-xs text-white/30 mt-1">{card.sub} total</p>
            )}
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Trend */}
        <div className="lg:col-span-2 rounded-2xl bg-white/5 border border-white/8 p-5">
          <h2 className="font-display text-base font-semibold text-white mb-4">
            Revenue Trend
          </h2>
          {timeSeries.length > 0 ? (
            <RevenueTrendChart data={timeSeries} />
          ) : (
            <div className="flex items-center justify-center h-52 text-white/25 text-sm">
              No transactions in this period
            </div>
          )}
        </div>

        {/* Source split */}
        <div className="rounded-2xl bg-white/5 border border-white/8 p-5">
          <h2 className="font-display text-base font-semibold text-white mb-2">
            Revenue by Source
          </h2>
          <SourceSplitChart summary={summary} />
          <div className="mt-3 space-y-1.5">
            {summary.totalByPurpose.map((p) => (
              <div key={p.purpose} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        p.purpose === "MEMBERSHIP"
                          ? "#c2873f"
                          : p.purpose === "TICKET"
                            ? "#2c4a8c"
                            : p.purpose === "DONATION"
                              ? "#b5502a"
                              : "#888",
                    }}
                  />
                  <span className="text-white/50">{p.purpose}</span>
                </div>
                <span className="text-white/70 font-medium">
                  ${p.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tier distribution */}
      {tierBreakdown.length > 0 && (
        <div className="rounded-2xl bg-white/5 border border-white/8 p-5 mb-8">
          <h2 className="font-display text-base font-semibold text-white mb-4">
            Membership Tier Distribution
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TierDistributionChart tiers={tierBreakdown} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-white/30 border-b border-white/8">
                    <th className="pb-2 font-medium">Tier</th>
                    <th className="pb-2 font-medium text-right">Members</th>
                    <th className="pb-2 font-medium text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tierBreakdown.map((t) => (
                    <tr key={t.tierId}>
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: t.tierColor ?? "#888" }}
                          />
                          <span className="text-white/80">{t.tierName}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-right text-white/60">
                        {t.activeMembers}
                      </td>
                      <td className="py-2.5 text-right text-white/80 font-medium">
                        ${t.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Top causes + failures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top donation causes */}
        <div className="rounded-2xl bg-white/5 border border-white/8 p-5">
          <h2 className="font-display text-base font-semibold text-white mb-4">
            Top Donation Causes
          </h2>
          {topCauses.length === 0 ? (
            <p className="text-white/25 text-sm py-6 text-center">
              No donations in this period
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-white/30 border-b border-white/8">
                  <th className="pb-2 font-medium">Cause</th>
                  <th className="pb-2 font-medium text-right">Txns</th>
                  <th className="pb-2 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topCauses.map((c) => (
                  <tr key={c.cause}>
                    <td className="py-2.5 text-white/70 truncate max-w-[180px]">
                      {c.cause}
                    </td>
                    <td className="py-2.5 text-right text-white/40">{c.count}</td>
                    <td className="py-2.5 text-right text-white/80 font-medium">
                      ${c.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent failures */}
        <div className="rounded-2xl bg-white/5 border border-white/8 p-5">
          <h2 className="font-display text-base font-semibold text-white mb-4">
            Failed / Abandoned Payments
          </h2>
          {failures.length === 0 ? (
            <p className="text-green-400 text-sm py-6 text-center">
              ✓ No failures in this period
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-white/30 border-b border-white/8">
                    <th className="pb-2 font-medium">Reference</th>
                    <th className="pb-2 font-medium">Purpose</th>
                    <th className="pb-2 font-medium text-right">Amount</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {failures.map((f) => (
                    <tr key={f.id}>
                      <td className="py-2.5">
                        <Link
                          href={`/admin/transactions/${f.id}`}
                          className="font-mono text-[10px] text-[var(--yif-terracotta)] hover:underline"
                        >
                          {f.reference.slice(0, 16)}…
                        </Link>
                      </td>
                      <td className="py-2.5 text-white/50">{f.purpose}</td>
                      <td className="py-2.5 text-right text-white/60">
                        {currencySymbol(f.currency)}
                        {f.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            f.status === "FAILED"
                              ? "bg-red-500/15 text-red-400"
                              : "bg-white/8 text-white/40"
                          }`}
                        >
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
