import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Donations | YIF Member Portal",
};

const ALL_DONATIONS = [
  {
    ref: "PS-ABC123",
    cause: "Scholarship Fund",
    amount: "₦25,000",
    date: "Apr 10, 2026",
    method: "Card",
    type: "One-time",
    status: "completed",
    year: 2026,
  },
  {
    ref: "PS-DEF456",
    cause: "Karo-Ojire Cultural Fund",
    amount: "₦15,000",
    date: "Mar 5, 2026",
    method: "Card",
    type: "One-time",
    status: "completed",
    year: 2026,
  },
  {
    ref: "PS-GHI789",
    cause: "General Fund",
    amount: "₦10,000",
    date: "Feb 1, 2026",
    method: "Transfer",
    type: "Monthly",
    status: "completed",
    year: 2026,
  },
  {
    ref: "PS-JKL012",
    cause: "General Fund",
    amount: "₦10,000",
    date: "Jan 1, 2026",
    method: "Transfer",
    type: "Monthly",
    status: "completed",
    year: 2026,
  },
  {
    ref: "PS-MNO345",
    cause: "Youth Development Fund",
    amount: "₦20,000",
    date: "Dec 12, 2025",
    method: "Card",
    type: "One-time",
    status: "completed",
    year: 2025,
  },
  {
    ref: "PS-PQR678",
    cause: "General Fund",
    amount: "₦10,000",
    date: "Nov 1, 2025",
    method: "Transfer",
    type: "Monthly",
    status: "completed",
    year: 2025,
  },
  {
    ref: "PS-STU901",
    cause: "Scholarship Fund",
    amount: "₦50,000",
    date: "Jul 4, 2025",
    method: "Card",
    type: "One-time",
    status: "completed",
    year: 2025,
  },
  {
    ref: "PS-VWX234",
    cause: "General Fund",
    amount: "₦10,000",
    date: "Jun 1, 2025",
    method: "Transfer",
    type: "Monthly",
    status: "completed",
    year: 2025,
  },
];

const CAUSE_COLORS: Record<string, string> = {
  "Scholarship Fund": "text-[var(--yif-gold)]",
  "Karo-Ojire Cultural Fund": "text-[var(--yif-terracotta)]",
  "General Fund": "text-[var(--yif-green)]",
  "Youth Development Fund": "text-[#7b8fcf]",
};

const SUMMARY = [
  { label: "Total Donated (All Time)", value: "₦185,000" },
  { label: "This Year (2026)", value: "₦60,000" },
  { label: "Transactions", value: "12" },
  { label: "Active Recurring", value: "₦10,000/mo" },
];

export default function DonationsPage() {
  const years = [...new Set(ALL_DONATIONS.map((d) => d.year))].sort(
    (a, b) => b - a,
  );

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-1">
          Member Portal
        </p>
        <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          My Donations
        </h1>
        <p className="mt-1 text-white/50 text-sm">
          Your full contribution history to the Yoruba Indigenes&apos;
          Foundation.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {SUMMARY.map((s) => (
          <div
            key={s.label}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-4"
          >
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
              {s.label}
            </p>
            <p className="font-display text-xl font-semibold text-[var(--yif-gold)]">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tax receipt notice */}
      <div className="mb-6 rounded-xl bg-[var(--yif-gold)]/8 border border-[var(--yif-gold)]/20 px-5 py-4 flex items-start gap-3">
        <span className="text-[var(--yif-gold)] text-lg shrink-0 mt-0.5">
          ℹ
        </span>
        <div>
          <p className="text-sm text-white font-medium">
            Tax Receipts Available
          </p>
          <p className="text-xs text-white/50 mt-0.5">
            As a registered NGO (RC IT 28744), YIF can issue tax-deductible
            donation receipts. Contact{" "}
            <a
              href="mailto:treasurer@yif.ng"
              className="text-[var(--yif-gold)] hover:underline"
            >
              treasurer@yif.ng
            </a>{" "}
            with your transaction reference to request a receipt.
          </p>
        </div>
      </div>

      {/* Grouped by year */}
      <div className="space-y-8">
        {years.map((year) => {
          const yearDonations = ALL_DONATIONS.filter((d) => d.year === year);
          const yearTotal = yearDonations.reduce((acc, d) => {
            const num = parseInt(d.amount.replace(/[₦,]/g, ""), 10);
            return acc + num;
          }, 0);

          return (
            <section key={year}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-lg font-semibold text-white">
                  {year}
                </h2>
                <span className="text-sm text-[var(--yif-gold)] font-semibold">
                  ₦{yearTotal.toLocaleString()} total
                </span>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-5 py-3 text-xs text-white/40 uppercase tracking-wider font-medium">
                        Cause
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium hidden sm:table-cell">
                        Date
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium hidden md:table-cell">
                        Type
                      </th>
                      <th className="text-right px-5 py-3 text-xs text-white/40 uppercase tracking-wider font-medium">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {yearDonations.map((d) => (
                      <tr
                        key={d.ref}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <p
                            className={`font-medium ${CAUSE_COLORS[d.cause] ?? "text-white/70"}`}
                          >
                            {d.cause}
                          </p>
                          <p className="text-xs text-white/30 font-mono mt-0.5">
                            {d.ref}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-white/40 hidden sm:table-cell">
                          {d.date}
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className="rounded-full bg-white/10 text-white/50 text-xs px-2 py-0.5">
                            {d.type}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <p className="font-semibold text-white">{d.amount}</p>
                          <p className="text-xs text-[var(--yif-green)] mt-0.5">
                            {d.status}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <p className="text-white/40 text-sm mb-3">
          Make a new contribution to our mission
        </p>
        <Link
          href="/donate"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--yif-gold)] px-6 py-2.5 text-sm font-semibold text-[var(--yif-navy-dark)] hover:bg-[var(--yif-gold-light)] transition-colors"
        >
          Donate Now →
        </Link>
      </div>
    </div>
  );
}
