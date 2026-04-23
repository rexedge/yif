import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard | YIF Member Portal",
};

const QUICK_STATS = [
  {
    label: "Membership",
    value: "Gold",
    sub: "Active · Expires Dec 2026",
    color: "var(--yif-gold)",
  },
  {
    label: "Total Donated",
    value: "₦185,000",
    sub: "12 transactions lifetime",
    color: "var(--yif-green)",
  },
  {
    label: "Events Attended",
    value: "7",
    sub: "3 upcoming registered",
    color: "var(--yif-terracotta)",
  },
  {
    label: "Member Since",
    value: "2021",
    sub: "5 years of impact",
    color: "#7b8fcf",
  },
];

const RECENT_DONATIONS = [
  {
    cause: "Scholarship Fund",
    amount: "₦25,000",
    date: "Apr 10, 2026",
    status: "Completed",
    ref: "PS-ABC123",
  },
  {
    cause: "Karo-Ojire Cultural Fund",
    amount: "₦15,000",
    date: "Mar 5, 2026",
    status: "Completed",
    ref: "PS-DEF456",
  },
  {
    cause: "General Fund",
    amount: "₦10,000",
    date: "Feb 1, 2026",
    status: "Completed",
    ref: "PS-GHI789",
  },
];

const UPCOMING_EVENTS = [
  {
    title: "Karo-Ojire Annual Cultural Festival 2026",
    date: "Jun 14, 2026",
    location: "Eko Hotel & Suites, Lagos",
    tier: "General Admission",
    qty: 2,
    ref: "TKT-001",
  },
  {
    title: "YIF Annual Awards Night 2026",
    date: "Sep 20, 2026",
    location: "Transcorp Hilton, Abuja",
    tier: "VIP",
    qty: 1,
    ref: "TKT-002",
  },
];

const QUICK_ACTIONS = [
  {
    href: "/donate",
    label: "Make a Donation",
    icon: "♡",
    desc: "Support our programmes",
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

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-1">
          Member Portal
        </p>
        <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          Welcome back, Adewale
        </h1>
        <p className="mt-1 text-white/50 text-sm">
          Here&apos;s an overview of your account activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 mb-8">
        {QUICK_STATS.map((s) => (
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
          <div className="divide-y divide-white/5">
            {UPCOMING_EVENTS.map((e) => (
              <div key={e.ref} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white leading-snug truncate">
                      {e.title}
                    </p>
                    <p className="text-xs text-white/40 mt-1">
                      {e.date} · {e.location}
                    </p>
                    <p className="text-xs text-white/40">
                      {e.tier} × {e.qty}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[var(--yif-green)]/20 text-[var(--yif-green)] text-xs px-2 py-0.5 font-medium">
                    Upcoming
                  </span>
                </div>
                <p className="text-xs text-white/20 mt-2 font-mono">{e.ref}</p>
              </div>
            ))}
          </div>
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
          <div className="divide-y divide-white/5">
            {RECENT_DONATIONS.map((d) => (
              <div
                key={d.ref}
                className="flex items-center justify-between px-5 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-white">{d.cause}</p>
                  <p className="text-xs text-white/40 mt-0.5">{d.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[var(--yif-gold)]">
                    {d.amount}
                  </p>
                  <span className="text-xs text-[var(--yif-green)]">
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Membership status banner */}
      <div className="mt-6 rounded-xl bg-gradient-to-r from-[var(--yif-gold)]/10 to-[var(--yif-navy-light)]/50 border border-[var(--yif-gold)]/20 px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-[var(--yif-gold)] font-semibold mb-1">
            Gold Member
          </p>
          <p className="text-white font-medium">
            Your membership is active and in good standing.
          </p>
          <p className="text-white/40 text-sm mt-0.5">
            Renews automatically on 31 December 2026 · Annual fee: ₦50,000
          </p>
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
