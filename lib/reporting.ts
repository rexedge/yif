// lib/reporting.ts — server-side revenue aggregation queries for the admin dashboard.
// All functions return plain JSON-serialisable objects so they can be passed as RSC props.

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export type Period = "7d" | "30d" | "90d" | "1y" | "all";

function periodToDate(period: Period): Date | null {
  if (period === "all") return null;
  const now = new Date();
  const days = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365;
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  return d;
}

function periodWhere(period: Period): Prisma.TransactionWhereInput {
  const since = periodToDate(period);
  return since ? { createdAt: { gte: since } } : {};
}

// ──────────────────────────────────────────────────────────────────────────────
// Summary cards
// ──────────────────────────────────────────────────────────────────────────────

export type RevenueSummary = {
  totalByPurpose: { purpose: string; total: number; count: number }[];
  totalByCurrency: { currency: string; total: number; count: number }[];
  failedCount: number;
  failedTotal: number;
  grandTotal: number;
  successCount: number;
};

export async function getRevenueSummary(period: Period): Promise<RevenueSummary> {
  const where = periodWhere(period);

  const [byPurpose, byCurrency, failed] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["purpose"],
      where: { ...where, status: "SUCCESS" },
      _sum: { baseAmount: true },
      _count: { _all: true },
    }),
    prisma.transaction.groupBy({
      by: ["currency"],
      where: { ...where, status: "SUCCESS" },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.transaction.aggregate({
      where: { ...where, status: { in: ["FAILED", "ABANDONED"] } },
      _count: { _all: true },
      _sum: { baseAmount: true },
    }),
  ]);

  // Purpose totals use the frozen NGN-equivalent so currencies are comparable.
  const totalByPurpose = byPurpose.map((r) => ({
    purpose: r.purpose,
    total: Number(r._sum.baseAmount ?? 0),
    count: r._count._all,
  }));

  // Currency breakdown stays exact: original amount in its own currency.
  const totalByCurrency = byCurrency.map((r) => ({
    currency: r.currency ?? "NGN",
    total: Number(r._sum.amount ?? 0),
    count: r._count._all,
  }));

  // Grand total is the consolidated NGN-equivalent across every currency.
  const grandTotal = totalByPurpose.reduce((acc, p) => acc + p.total, 0);

  const successCount = byPurpose.reduce((acc, r) => acc + r._count._all, 0);

  return {
    totalByPurpose,
    totalByCurrency,
    failedCount: failed._count._all,
    failedTotal: Number(failed._sum.baseAmount ?? 0),
    grandTotal,
    successCount,
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// Time-series for the bar chart
// ──────────────────────────────────────────────────────────────────────────────

export type TimeSeriesPoint = {
  date: string; // ISO date string YYYY-MM-DD
  MEMBERSHIP: number;
  TICKET: number;
  DONATION: number;
  OTHER: number;
  total: number;
};

export async function getRevenueTimeSeries(
  period: Period,
): Promise<TimeSeriesPoint[]> {
  const since = periodToDate(period);
  const where: Prisma.TransactionWhereInput = {
    status: "SUCCESS",
    ...(since ? { createdAt: { gte: since } } : {}),
  };

  const rows = await prisma.transaction.findMany({
    where,
    select: { createdAt: true, purpose: true, baseAmount: true },
    orderBy: { createdAt: "asc" },
  });

  const map = new Map<string, TimeSeriesPoint>();

  for (const row of rows) {
    const key = row.createdAt.toISOString().slice(0, 10);
    if (!map.has(key)) {
      map.set(key, { date: key, MEMBERSHIP: 0, TICKET: 0, DONATION: 0, OTHER: 0, total: 0 });
    }
    const point = map.get(key)!;
    const amt = Number(row.baseAmount ?? 0);
    const p = row.purpose as keyof Omit<TimeSeriesPoint, "date" | "total">;
    if (p in point) point[p] += amt;
    else point.OTHER += amt;
    point.total += amt;
  }

  return Array.from(map.values());
}

// ──────────────────────────────────────────────────────────────────────────────
// Membership tier distribution
// ──────────────────────────────────────────────────────────────────────────────

export type TierBreakdown = {
  tierId: string;
  tierName: string;
  tierColor: string | null;
  activeMembers: number;
  revenue: number;
};

export async function getMembershipTierBreakdown(): Promise<TierBreakdown[]> {
  const [tiers, revenueRows] = await Promise.all([
    prisma.membershipTier.findMany({
      where: { isActive: true },
      select: { id: true, name: true, color: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.transaction.groupBy({
      by: ["memberId"],
      where: { status: "SUCCESS", purpose: "MEMBERSHIP" },
      _sum: { amount: true },
    }),
  ]);

  // Count active members per tier
  const memberCounts = await prisma.member.groupBy({
    by: ["tierId"],
    where: { status: "ACTIVE" },
    _count: { _all: true },
  });

  const countByTier = new Map(memberCounts.map((r) => [r.tierId, r._count._all]));

  // For revenue: we need to join via member → tier. Use raw query for efficiency.
  const revenueByTier: { tierId: string; total: number }[] = await prisma.$queryRaw`
    SELECT m."tierId", COALESCE(SUM(COALESCE(t."baseAmount", t.amount)), 0)::float AS total
    FROM "transaction" t
    JOIN "member" m ON m.id = t."memberId"
    WHERE t.status = 'SUCCESS' AND t.purpose = 'MEMBERSHIP'
    GROUP BY m."tierId"
  `;

  const revByTier = new Map(revenueByTier.map((r) => [r.tierId, Number(r.total)]));

  return tiers.map((tier) => ({
    tierId: tier.id,
    tierName: tier.name,
    tierColor: tier.color,
    activeMembers: countByTier.get(tier.id) ?? 0,
    revenue: revByTier.get(tier.id) ?? 0,
  }));
}

// ──────────────────────────────────────────────────────────────────────────────
// Top donation causes
// ──────────────────────────────────────────────────────────────────────────────

export type TopCause = {
  cause: string;
  total: number;
  count: number;
};

export async function getTopDonationCauses(
  period: Period,
  limit = 10,
): Promise<TopCause[]> {
  const since = periodToDate(period);
  const rows = await prisma.transaction.findMany({
    where: {
      purpose: "DONATION",
      status: "SUCCESS",
      ...(since ? { createdAt: { gte: since } } : {}),
    },
    select: { metadata: true, baseAmount: true, amount: true },
  });

  const causeMap = new Map<string, { total: number; count: number }>();
  for (const row of rows) {
    const meta = row.metadata as Record<string, unknown> | null;
    const cause =
      (meta?.cause as string | undefined) ??
      (meta?.donationCause as string | undefined) ??
      "General Fund";
    const existing = causeMap.get(cause) ?? { total: 0, count: 0 };
    // Use frozen NGN-equivalent; fall back to raw amount for legacy rows.
    causeMap.set(cause, {
      total: existing.total + Number(row.baseAmount ?? row.amount ?? 0),
      count: existing.count + 1,
    });
  }

  return Array.from(causeMap.entries())
    .map(([cause, { total, count }]) => ({ cause, total, count }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

// ──────────────────────────────────────────────────────────────────────────────
// Recent failures
// ──────────────────────────────────────────────────────────────────────────────

export type FailedTransaction = {
  id: string;
  reference: string;
  status: string;
  purpose: string;
  amount: number;
  currency: string;
  provider: string;
  customerEmail: string;
  createdAt: string;
};

export async function getRecentFailures(
  period: Period,
  limit = 20,
): Promise<FailedTransaction[]> {
  const since = periodToDate(period);
  const rows = await prisma.transaction.findMany({
    where: {
      status: { in: ["FAILED", "ABANDONED"] },
      ...(since ? { createdAt: { gte: since } } : {}),
    },
    select: {
      id: true,
      reference: true,
      status: true,
      purpose: true,
      amount: true,
      currency: true,
      provider: true,
      customerEmail: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return rows.map((r) => ({
    id: r.id,
    reference: r.reference,
    status: r.status,
    purpose: r.purpose,
    amount: Number(r.amount ?? 0),
    currency: r.currency ?? "NGN",
    provider: r.provider,
    customerEmail: r.customerEmail,
    createdAt: r.createdAt.toISOString(),
  }));
}
