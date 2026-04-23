import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Donations | YIF",
};

const DONATIONS = [
  {
    donor: "Chidi Okonkwo",
    cause: "Scholarship Fund",
    amount: "₦100,000",
    date: "Dec 15, 2025",
    ref: "DON-2025-0089",
    type: "One-time",
  },
  {
    donor: "Anonymous",
    cause: "General Fund",
    amount: "₦50,000",
    date: "Dec 14, 2025",
    ref: "DON-2025-0088",
    type: "Recurring",
  },
  {
    donor: "Ngozi Eze",
    cause: "Karo-Ojire",
    amount: "₦75,000",
    date: "Dec 12, 2025",
    ref: "DON-2025-0087",
    type: "One-time",
  },
  {
    donor: "Tunde Adeyemi",
    cause: "Youth Empowerment",
    amount: "₦25,000",
    date: "Dec 10, 2025",
    ref: "DON-2025-0086",
    type: "Recurring",
  },
  {
    donor: "Bisi Oladele",
    cause: "Scholarship Fund",
    amount: "₦200,000",
    date: "Dec 8, 2025",
    ref: "DON-2025-0085",
    type: "One-time",
  },
  {
    donor: "Fatima Yusuf",
    cause: "General Fund",
    amount: "₦15,000",
    date: "Dec 7, 2025",
    ref: "DON-2025-0084",
    type: "One-time",
  },
  {
    donor: "Wale Adesanya",
    cause: "Karo-Ojire",
    amount: "₦50,000",
    date: "Dec 5, 2025",
    ref: "DON-2025-0083",
    type: "Recurring",
  },
  {
    donor: "Emeka Uche",
    cause: "Scholarship Fund",
    amount: "₦30,000",
    date: "Dec 3, 2025",
    ref: "DON-2025-0082",
    type: "One-time",
  },
  {
    donor: "Kunle Fashola",
    cause: "Youth Empowerment",
    amount: "₦20,000",
    date: "Nov 30, 2025",
    ref: "DON-2025-0081",
    type: "Recurring",
  },
  {
    donor: "Adeola Bello",
    cause: "General Fund",
    amount: "₦10,000",
    date: "Nov 28, 2025",
    ref: "DON-2025-0080",
    type: "One-time",
  },
];

const CAUSES = [
  { name: "Scholarship Fund", amount: "₦5.2M", pct: 42 },
  { name: "Karo-Ojire Programme", amount: "₦3.1M", pct: 25 },
  { name: "General Fund", amount: "₦2.8M", pct: 23 },
  { name: "Youth Empowerment", amount: "₦1.3M", pct: 10 },
];

const TYPE_STYLE: Record<string, string> = {
  "One-time": "bg-white/5 text-white/40 border-white/10",
  Recurring:
    "bg-[var(--yif-green)]/12 text-[var(--yif-green)] border-[var(--yif-green)]/25",
};

export default function AdminDonationsPage() {
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
        <button className="rounded-xl bg-white/6 border border-white/10 text-white/60 px-5 py-2.5 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors">
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        {[
          { label: "Total Raised (All Time)", value: "₦12.4M" },
          { label: "This Year", value: "₦4.2M" },
          { label: "Average Donation", value: "₦8,500" },
          { label: "Recurring Donors", value: "45" },
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
          <h2 className="font-display text-lg font-semibold text-white mb-5">
            By Cause
          </h2>
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
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {DONATIONS.map((d) => (
                <tr key={d.ref} className="hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3.5 text-white/70 font-medium text-sm">
                    {d.donor}
                  </td>
                  <td className="px-4 py-3.5 text-white/40 text-xs hidden sm:table-cell">
                    {d.cause}
                  </td>
                  <td className="px-4 py-3.5 text-white/80 font-semibold text-sm">
                    {d.amount}
                  </td>
                  <td className="px-4 py-3.5 text-white/35 text-xs hidden md:table-cell">
                    {d.date}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-white/25 text-xs hidden lg:table-cell">
                    {d.ref}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${TYPE_STYLE[d.type]}`}
                    >
                      {d.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
