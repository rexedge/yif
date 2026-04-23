import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Membership | YIF Member Portal",
};

const TIERS = [
  {
    name: "Yoruba Community",
    price: "₦5,000",
    period: "year",
    color: "var(--yif-green)",
    current: false,
    benefits: [
      "Access to member newsletter",
      "Cultural events invitations",
      "Member directory listing",
      "Online community access",
    ],
  },
  {
    name: "Silver",
    price: "₦25,000",
    period: "year",
    color: "#7f8c8d",
    current: false,
    benefits: [
      "All Community benefits",
      "Discounted event tickets (10%)",
      "Voting rights at general meetings",
      "Mentorship programme access",
    ],
  },
  {
    name: "Gold",
    price: "₦50,000",
    period: "year",
    color: "var(--yif-gold)",
    current: true,
    benefits: [
      "All Silver benefits",
      "Priority event registration",
      "Discounted event tickets (20%)",
      "Scholarship nomination rights",
      "Quarterly board briefings",
    ],
  },
  {
    name: "Platinum",
    price: "₦100,000",
    period: "year",
    color: "#5dade2",
    current: false,
    benefits: [
      "All Gold benefits",
      "Complimentary gala table seat",
      "Name on annual report",
      "Programme committee invite",
      "Dedicated member liaison",
    ],
  },
  {
    name: "Diamond",
    price: "₦250,000",
    period: "year",
    color: "#9b59b6",
    current: false,
    benefits: [
      "All Platinum benefits",
      "Board observer seat",
      "Dedicated sponsorship package",
      "VIP access at all events",
      "Co-branding on initiatives",
      "Direct line to Executive Director",
    ],
  },
];

const PAYMENT_HISTORY = [
  {
    ref: "MBR-2026-001",
    description: "Gold Membership — 2026",
    amount: "₦50,000",
    date: "Jan 5, 2026",
    status: "paid",
  },
  {
    ref: "MBR-2025-001",
    description: "Gold Membership — 2025",
    amount: "₦50,000",
    date: "Jan 8, 2025",
    status: "paid",
  },
  {
    ref: "MBR-2024-001",
    description: "Silver Membership — 2024",
    amount: "₦25,000",
    date: "Jan 12, 2024",
    status: "paid",
  },
];

export default function MembershipPage() {
  const currentTier = TIERS.find((t) => t.current)!;

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-1">
          Member Portal
        </p>
        <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          Membership
        </h1>
        <p className="mt-1 text-white/50 text-sm">
          Manage your YIF membership, view benefits, and upgrade your tier.
        </p>
      </div>

      {/* Current status card */}
      <div
        className="rounded-2xl border p-6 mb-8"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, ${currentTier.color} 8%, transparent), color-mix(in srgb, ${currentTier.color} 4%, transparent))`,
          borderColor: `color-mix(in srgb, ${currentTier.color} 30%, transparent)`,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">
              Current Membership
            </p>
            <div className="flex items-center gap-3">
              <span
                className="font-display text-2xl font-bold"
                style={{ color: currentTier.color }}
              >
                {currentTier.name} Member
              </span>
              <span className="rounded-full bg-[var(--yif-green)]/20 text-[var(--yif-green)] text-xs px-2 py-0.5 border border-[var(--yif-green)]/30 font-medium">
                Active
              </span>
            </div>
            <p className="text-sm text-white/50 mt-1">
              Renews <strong className="text-white/70">January 5, 2027</strong>{" "}
              · {currentTier.price}/{currentTier.period}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-lg bg-white/10 border border-white/20 text-white text-sm px-4 py-2 hover:bg-white/15 transition-colors font-medium">
              Renew Early
            </button>
            <button
              className="rounded-lg text-sm px-4 py-2 font-semibold transition-colors"
              style={{
                backgroundColor: currentTier.color,
                color: "var(--yif-navy-dark)",
              }}
            >
              Upgrade Tier
            </button>
          </div>
        </div>

        {/* Benefits of current tier */}
        <div className="mt-5 pt-5 border-t border-white/10">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3">
            Your {currentTier.name} Benefits
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentTier.benefits.map((b) => (
              <div
                key={b}
                className="flex items-center gap-2 text-sm text-white/70"
              >
                <span style={{ color: currentTier.color }}>✓</span>
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tier comparison */}
      <section className="mb-8">
        <h2 className="font-display text-lg font-semibold text-white mb-4">
          All Membership Tiers
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl border px-4 py-5 relative ${tier.current ? "ring-1" : ""}`}
              style={{
                borderColor: tier.current
                  ? `color-mix(in srgb, ${tier.color} 50%, transparent)`
                  : "rgba(255,255,255,0.08)",
                background: tier.current
                  ? `color-mix(in srgb, ${tier.color} 8%, rgba(255,255,255,0.03))`
                  : "rgba(255,255,255,0.03)",
                ...(tier.current
                  ? ({
                      "--tw-ring-color": `color-mix(in srgb, ${tier.color} 50%, transparent)`,
                    } as React.CSSProperties)
                  : {}),
              }}
            >
              {tier.current && (
                <span
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: tier.color,
                    color: "var(--yif-navy-dark)",
                  }}
                >
                  Current
                </span>
              )}
              <p
                className="font-display text-base font-semibold mb-0.5"
                style={{ color: tier.color }}
              >
                {tier.name}
              </p>
              <p className="font-display text-xl font-bold text-white">
                {tier.price}
                <span className="text-xs font-sans font-normal text-white/40">
                  /{tier.period}
                </span>
              </p>
              <ul className="mt-3 space-y-1.5">
                {tier.benefits.slice(0, 4).map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-1.5 text-xs text-white/55"
                  >
                    <span
                      style={{ color: tier.color }}
                      className="mt-0.5 shrink-0"
                    >
                      ✓
                    </span>
                    {b}
                  </li>
                ))}
                {tier.benefits.length > 4 && (
                  <li className="text-xs text-white/30 pl-4">
                    +{tier.benefits.length - 4} more
                  </li>
                )}
              </ul>
              {!tier.current && (
                <button
                  className="mt-4 w-full rounded-lg py-2 text-xs font-semibold border transition-colors hover:bg-white/10"
                  style={{
                    borderColor: `color-mix(in srgb, ${tier.color} 40%, transparent)`,
                    color: tier.color,
                  }}
                >
                  Upgrade to {tier.name}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Payment history */}
      <section>
        <h2 className="font-display text-lg font-semibold text-white mb-4">
          Membership Payment History
        </h2>
        <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3 text-xs text-white/40 uppercase tracking-wider font-medium">
                  Description
                </th>
                <th className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium hidden sm:table-cell">
                  Date
                </th>
                <th className="text-right px-5 py-3 text-xs text-white/40 uppercase tracking-wider font-medium">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {PAYMENT_HISTORY.map((p) => (
                <tr key={p.ref} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-white/70 font-medium">{p.description}</p>
                    <p className="text-xs text-white/30 font-mono mt-0.5">
                      {p.ref}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-white/40 hidden sm:table-cell">
                    {p.date}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <p className="font-semibold text-white">{p.amount}</p>
                    <p className="text-xs text-[var(--yif-green)] mt-0.5">
                      {p.status}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Learn more */}
      <div className="mt-8 text-center">
        <p className="text-white/40 text-sm mb-3">
          Learn about membership benefits and how to join
        </p>
        <Link
          href="/membership"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--yif-gold)]/40 px-6 py-2.5 text-sm font-semibold text-[var(--yif-gold)] hover:bg-[var(--yif-gold)]/10 transition-colors"
        >
          View Membership Details →
        </Link>
      </div>
    </div>
  );
}
