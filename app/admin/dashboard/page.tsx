import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Admin Overview | YIF" };

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function formatNaira(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}k`;
  return `₦${amount.toLocaleString()}`;
}

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [
    memberCount,
    donationAgg,
    eventCount,
    userCount,
    recentMembers,
    recentDonations,
    pendingMembers,
  ] = await Promise.all([
    prisma.member.count(),
    prisma.transaction.groupBy({
      by: ["currency"],
      where: { purpose: "DONATION", status: "SUCCESS" },
      _sum: { amount: true },
      orderBy: { currency: "asc" },
    }),
    prisma.event.count({ where: { date: { gte: startOfYear } } }),
    prisma.user.count(),
    prisma.member.findMany({
      orderBy: { joinedAt: "desc" },
      take: 4,
      include: { user: { select: { name: true } }, tier: { select: { name: true } } },
    }),
    prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      where: { purpose: "DONATION", status: "SUCCESS" },
    }),
    prisma.member.findMany({
      where: { status: "PENDING" },
      include: { user: { select: { name: true } }, tier: { select: { name: true } } },
      orderBy: { joinedAt: "desc" },
      take: 5,
    }),
  ]);

  // Build per-currency donation totals e.g. "₦309k · $15 · £50"
  const donationSummary = donationAgg
    .filter((g) => Number(g._sum.amount ?? 0) > 0)
    .map((g) => {
      const amt = Number(g._sum.amount ?? 0);
      if (g.currency === "NGN") return formatNaira(amt);
      const sym: Record<string, string> = { USD: "$", GBP: "£", EUR: "€" };
      return `${sym[g.currency] ?? g.currency}${amt.toLocaleString()}`;
    })
    .join(" · ") || "₦0";

  const STATS = [
    { label: "Total Members", value: String(memberCount) },
    { label: "Donations", value: donationSummary },
    { label: "Events This Year", value: String(eventCount) },
    { label: "Registered Users", value: String(userCount) },
  ];

  const activity = [
    ...recentMembers.map((m) => ({
      time: timeAgo(m.joinedAt),
      icon: "◈",
      color: "#c9913d",
      text: `${m.user.name} joined as ${m.tier.name} member`,
      date: m.joinedAt,
    })),
    ...recentDonations.map((d) => ({
      time: timeAgo(d.createdAt),
      icon: "◆",
      color: "#2d6a4f",
      text: `${d.currency === "NGN" ? formatNaira(Number(d.amount)) : `${d.currency} ${Number(d.amount).toLocaleString()}`} donation received${d.customerName ? ` — ${d.customerName}` : ""}`,
      date: d.createdAt,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-terracotta)] mb-1">
            Admin Panel
          </p>
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Overview
          </h1>
          <p className="mt-1 text-white/40 text-sm">Foundation summary</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-[var(--yif-green)]/15 border border-[var(--yif-green)]/25 text-[var(--yif-green)] px-3 py-1.5 rounded-full">
            ● All systems operational
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-white/5 border border-white/8 px-5 py-5"
          >
            <p className="text-xs text-white/40 font-medium uppercase tracking-wide mb-2">
              {s.label}
            </p>
            <p className="font-display text-3xl font-bold text-white">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity Feed */}
        <div className="lg:col-span-2 rounded-2xl bg-white/5 border border-white/8 px-6 py-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold text-white">
              Recent Activity
            </h2>
            <span className="text-xs text-white/30">Live feed</span>
          </div>
          {activity.length === 0 ? (
            <p className="text-white/30 text-sm py-4">No recent activity.</p>
          ) : (
            <div className="space-y-3">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
                    style={{ backgroundColor: `${a.color}20`, color: a.color }}
                  >
                    {a.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white/70 leading-snug">
                      {a.text}
                    </p>
                    <p className="text-xs text-white/25 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Applications */}
        <div className="rounded-2xl bg-white/5 border border-white/8 px-6 py-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold text-white">
              Pending Applications
            </h2>
            <span className="bg-[var(--yif-terracotta)]/15 text-[var(--yif-terracotta)] text-xs font-bold px-2 py-0.5 rounded-full">
              {pendingMembers.length}
            </span>
          </div>
          {pendingMembers.length === 0 ? (
            <p className="text-white/30 text-sm">No pending applications.</p>
          ) : (
            <div className="space-y-4">
              {pendingMembers.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl bg-white/3 border border-white/6 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm text-white/80 font-medium">
                      {p.user.name}
                    </p>
                    <span className="text-xs text-[var(--yif-gold)] font-medium capitalize">
                      {p.tier.name}
                    </span>
                  </div>
                  <p className="text-xs text-white/35 mb-2">Awaiting review</p>
                  <div className="flex items-center gap-2">
                    <button className="text-xs px-2.5 py-1 rounded-lg bg-[var(--yif-green)]/15 text-[var(--yif-green)] border border-[var(--yif-green)]/20 hover:bg-[var(--yif-green)]/25 transition-colors">
                      Approve
                    </button>
                    <button className="text-xs px-2.5 py-1 rounded-lg bg-[var(--yif-terracotta)]/10 text-[var(--yif-terracotta)] border border-[var(--yif-terracotta)]/20 hover:bg-[var(--yif-terracotta)]/20 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: "Manage Members",
            href: "/admin/members",
            color: "var(--yif-gold)",
          },
          { label: "Manage Events", href: "/admin/events", color: "#5dade2" },
          {
            label: "View Donations",
            href: "/admin/donations",
            color: "var(--yif-green)",
          },
          { label: "Public Site", href: "/", color: "var(--muted)" },
        ].map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="rounded-xl bg-white/4 border border-white/8 px-4 py-4 text-sm font-medium hover:bg-white/8 transition-colors text-center"
            style={{ color: q.color }}
          >
            {q.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
