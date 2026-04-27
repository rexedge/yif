import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard | YIF Member Portal",
};

const QUICK_ACTIONS = [
  {
    href: "/donate",
    label: "Make a Donation",
    icon: "♡",
    desc: "Support our Programs",
  },
  {
    href: "/events",
    label: "Buy Tickets",
    icon: "◷",
    desc: "Register for events",
  },
  {
    href: "/dashboard/scholarship",
    label: "Apply for Scholarship",
    icon: "◎",
    desc: "2025-2026 cycle open",
  },
  {
    href: "/dashboard/membership",
    label: "Manage Membership",
    icon: "◈",
    desc: "Renew or upgrade tier",
  },
];

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  if ((session.user as { role?: string }).role === "admin")
    redirect("/admin/dashboard");

  const userId = session.user.id;
  const firstName = session.user.name?.split(" ")[0] ?? "Member";

  const [member, recentDonations, upcomingTickets, donationStats, ticketCount] =
    await Promise.all([
      prisma.member.findUnique({ where: { userId } }),
      prisma.donation.findMany({
        where: { userId, status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.ticket.findMany({
        where: { userId, status: { in: ["CONFIRMED", "PENDING"] } },
        include: { event: true },
        orderBy: { createdAt: "desc" },
        take: 2,
      }),
      prisma.donation.aggregate({
        where: { userId, status: "COMPLETED" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.ticket.count({ where: { userId, status: "USED" } }),
    ]);

  const totalDonated = donationStats._sum.amount
    ? `₦${Number(donationStats._sum.amount).toLocaleString("en-NG")}`
    : "₦0";
  const donationCount = donationStats._count.id;
  const memberYear = member?.joinedAt
    ? new Date(member.joinedAt).getFullYear()
    : new Date(session.user.createdAt).getFullYear();
  const tierLabel = member?.tier
    ? member.tier.charAt(0) + member.tier.slice(1).toLowerCase()
    : "—";
  const memberStatus = member?.status ?? "PENDING";
  const memberExpiry = member?.expiresAt
    ? new Date(member.expiresAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const quickStats = [
    {
      label: "Membership",
      value: member ? tierLabel : "None",
      sub: member
        ? `${memberStatus.charAt(0) + memberStatus.slice(1).toLowerCase()}${memberExpiry ? ` · Expires ${memberExpiry}` : ""}`
        : "Not yet a member",
      color: "var(--yif-gold)",
    },
    {
      label: "Total Donated",
      value: totalDonated,
      sub: `${donationCount} transaction${donationCount !== 1 ? "s" : ""} lifetime`,
      color: "var(--yif-green)",
    },
    {
      label: "Events Attended",
      value: String(ticketCount),
      sub: `${upcomingTickets.length} upcoming registered`,
      color: "var(--yif-terracotta)",
    },
    {
      label: "Member Since",
      value: String(memberYear),
      sub: `${new Date().getFullYear() - memberYear} year${new Date().getFullYear() - memberYear !== 1 ? "s" : ""} of impact`,
      color: "#7b8fcf",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-1">
          Member Portal
        </p>
        <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-white/50 text-sm">
          Here&apos;s an overview of your account activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 mb-8">
        {quickStats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-4"
          >
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
              {s.label}
            </p>
            <p
              className="font-display text-2xl font-semibold"
              style={{ color: s.color }}
            >
              {s.value}
            </p>
            <p className="text-xs text-white/40 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="font-display text-lg font-semibold text-white mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group rounded-xl border border-white/10 bg-white/5 px-4 py-4 hover:bg-[var(--yif-gold)]/10 hover:border-[var(--yif-gold)]/30 transition-all"
            >
              <span className="text-2xl text-[var(--yif-gold)] block mb-2">
                {a.icon}
              </span>
              <p className="text-sm font-medium text-white group-hover:text-[var(--yif-gold)] transition-colors">
                {a.label}
              </p>
              <p className="text-xs text-white/40 mt-0.5">{a.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming tickets */}
        <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <h2 className="font-display text-base font-semibold text-white">
              My Tickets
            </h2>
            <Link
              href="/dashboard/tickets"
              className="text-xs text-[var(--yif-gold)] hover:underline"
            >
              View all →
            </Link>
          </div>
          {upcomingTickets.length === 0 ? (
            <div className="px-5 py-8 text-center text-white/40 text-sm">
              No upcoming tickets.{" "}
              <Link
                href="/events"
                className="text-[var(--yif-gold)] hover:underline"
              >
                Browse events →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {upcomingTickets.map((t) => (
                <div key={t.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white leading-snug truncate">
                        {t.event.title}
                      </p>
                      <p className="text-xs text-white/40 mt-1">
                        {new Date(t.event.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        {t.event.location ? ` · ${t.event.location}` : ""}
                      </p>
                      <p className="text-xs text-white/40">
                        {t.tierName} × {t.quantity}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[var(--yif-green)]/20 text-[var(--yif-green)] text-xs px-2 py-0.5 font-medium">
                      {t.status.charAt(0) + t.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <p className="text-xs text-white/20 mt-2 font-mono">
                    {t.reference}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent donations */}
        <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <h2 className="font-display text-base font-semibold text-white">
              Recent Donations
            </h2>
            <Link
              href="/dashboard/donations"
              className="text-xs text-[var(--yif-gold)] hover:underline"
            >
              View all →
            </Link>
          </div>
          {recentDonations.length === 0 ? (
            <div className="px-5 py-8 text-center text-white/40 text-sm">
              No donations yet.{" "}
              <Link
                href="/donate"
                className="text-[var(--yif-gold)] hover:underline"
              >
                Make a donation →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentDonations.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{d.cause}</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {new Date(d.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--yif-gold)]">
                      ₦{Number(d.amount).toLocaleString("en-NG")}
                    </p>
                    <span className="text-xs text-[var(--yif-green)]">
                      {d.status.charAt(0) + d.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Membership status banner */}
      <div className="mt-6 rounded-xl bg-gradient-to-r from-[var(--yif-gold)]/10 to-[var(--yif-navy-light)]/50 border border-[var(--yif-gold)]/20 px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          {member ? (
            <>
              <p className="text-xs uppercase tracking-wider text-[var(--yif-gold)] font-semibold mb-1">
                {tierLabel} Member
              </p>
              <p className="text-white font-medium">
                Your membership is{" "}
                {memberStatus === "ACTIVE"
                  ? "active and in good standing"
                  : memberStatus.toLowerCase()}
                .
              </p>
              {memberExpiry && (
                <p className="text-white/40 text-sm mt-0.5">
                  Expires {memberExpiry}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-xs uppercase tracking-wider text-[var(--yif-gold)] font-semibold mb-1">
                No Active Membership
              </p>
              <p className="text-white font-medium">
                Join YIF to access member benefits.
              </p>
            </>
          )}
        </div>
        <Link
          href="/dashboard/membership"
          className="shrink-0 rounded-lg bg-[var(--yif-gold)] px-5 py-2.5 text-sm font-semibold text-[var(--yif-navy-dark)] hover:bg-[var(--yif-gold-light)] transition-colors"
        >
          Manage Membership
        </Link>
      </div>
    </div>
  );
}
