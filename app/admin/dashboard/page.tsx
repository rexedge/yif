import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Overview | YIF",
};

const STATS = [
  { label: "Total Members", value: "248", delta: "+12 this month", up: true },
  { label: "Monthly Revenue (MRR)", value: "₦520k", delta: "+8% vs last month", up: true },
  { label: "Events This Year", value: "4", delta: "2 upcoming", up: null },
  { label: "Total Donations", value: "₦12.4M", delta: "+₦890k this quarter", up: true },
];

const ACTIVITY = [
  { time: "2 min ago", icon: "◈", color: "#c9913d", text: "Fatima Yusuf joined as Gold member" },
  { time: "14 min ago", icon: "◆", color: "#2d6a4f", text: "₦50,000 donation received — Scholarship Fund" },
  { time: "1 hr ago", icon: "◷", color: "#5dade2", text: "18 tickets purchased — Cultural Gala 2026" },
  { time: "3 hrs ago", icon: "◈", color: "#c9913d", text: "Tunde Adeyemi upgraded to Platinum" },
  { time: "6 hrs ago", icon: "◆", color: "#2d6a4f", text: "₦25,000 recurring donation set up — General Fund" },
  { time: "Yesterday", icon: "◈", color: "#7f8c8d", text: "Adeola Bello joined as Silver member" },
  { time: "Yesterday", icon: "◷", color: "#5dade2", text: "New event created — Annual Leadership Summit" },
  { time: "2 days ago", icon: "◆", color: "#2d6a4f", text: "₦100,000 donation — Karo-Ojire programme" },
];

const PENDING = [
  { name: "Chinwe Obi", tier: "Gold", applied: "Dec 12, 2025", reason: "Pending payment verification" },
  { name: "Babatunde Ojo", tier: "Silver", applied: "Dec 10, 2025", reason: "Awaiting referee approval" },
  { name: "Kemi Adewumi", tier: "Platinum", applied: "Dec 8, 2025", reason: "Document review" },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-terracotta)] mb-1">Admin Panel</p>
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">Overview</h1>
          <p className="mt-1 text-white/40 text-sm">Foundation summary — December 2025</p>
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
            <p className="text-xs text-white/40 font-medium uppercase tracking-wide mb-2">{s.label}</p>
            <p className="font-display text-3xl font-bold text-white mb-1">{s.value}</p>
            <p className={`text-xs font-medium ${s.up === true ? "text-[var(--yif-green)]" : s.up === false ? "text-[var(--yif-terracotta)]" : "text-white/40"}`}>
              {s.delta}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity Feed */}
        <div className="lg:col-span-2 rounded-2xl bg-white/5 border border-white/8 px-6 py-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold text-white">Recent Activity</h2>
            <span className="text-xs text-white/30">Live feed</span>
          </div>
          <div className="space-y-3">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
                  style={{ backgroundColor: `${a.color}20`, color: a.color }}
                >
                  {a.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white/70 leading-snug">{a.text}</p>
                  <p className="text-xs text-white/25 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Applications */}
        <div className="rounded-2xl bg-white/5 border border-white/8 px-6 py-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold text-white">Pending Applications</h2>
            <span className="bg-[var(--yif-terracotta)]/15 text-[var(--yif-terracotta)] text-xs font-bold px-2 py-0.5 rounded-full">
              {PENDING.length}
            </span>
          </div>
          <div className="space-y-4">
            {PENDING.map((p) => (
              <div key={p.name} className="rounded-xl bg-white/3 border border-white/6 px-4 py-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm text-white/80 font-medium">{p.name}</p>
                  <span className="text-xs text-[var(--yif-gold)] font-medium">{p.tier}</span>
                </div>
                <p className="text-xs text-white/35 mb-2">{p.reason}</p>
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
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Manage Members", href: "/admin/members", color: "var(--yif-gold)" },
          { label: "Manage Events", href: "/admin/events", color: "#5dade2" },
          { label: "View Donations", href: "/admin/donations", color: "var(--yif-green)" },
          { label: "Public Site", href: "/", color: "var(--muted)" },
        ].map((q) => (
          <a
            key={q.href}
            href={q.href}
            className="rounded-xl bg-white/4 border border-white/8 px-4 py-4 text-sm font-medium hover:bg-white/8 transition-colors text-center"
            style={{ color: q.color }}
          >
            {q.label}
          </a>
        ))}
      </div>
    </div>
  );
}
