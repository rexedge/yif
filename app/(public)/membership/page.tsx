import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Membership | YIF",
  description:
    "Join the Yoruba Indigenes' Foundation as a member and be part of a global community committed to Yoruba unity and progress.",
};

const TIERS = [
  {
    name: "Silver",
    slug: "silver",
    price: "₦5,000",
    period: "/year",
    color: "#7f8c8d",
    badge: null,
    summary: "Start your journey as a YIF community member.",
    benefits: [
      "Access to monthly e-newsletter",
      "Cultural events invitations",
      "Member directory listing",
      "Online community forum access",
      "YIF Welcome Kit (digital)",
    ],
  },
  {
    name: "Gold",
    slug: "gold",
    price: "₦10,000",
    period: "/year",
    color: "#c9913d",
    badge: null,
    summary: "Full member privileges with voting rights.",
    benefits: [
      "All Silver benefits",
      "10% discount on event tickets",
      "Voting rights at general meetings",
      "Mentorship Program access",
      "Name in annual member listing",
    ],
  },
  {
    name: "Diamond",
    slug: "diamond",
    price: "₦15,000",
    period: "/year",
    color: "#9b59b6",
    badge: "Most Popular",
    summary: "Enhanced access and scholarship nomination rights.",
    benefits: [
      "All Gold benefits",
      "20% discount on event tickets",
      "Priority event registration",
      "Scholarship nomination rights",
      "Quarterly board briefings",
      "YIF Ambassador certificate",
    ],
  },
  {
    name: "Platinum",
    slug: "platinum",
    price: "₦20,000",
    period: "/year",
    color: "#5dade2",
    badge: "Elite",
    summary: "Leadership-level recognition and board access.",
    benefits: [
      "All Diamond benefits",
      "Complimentary annual gala seat",
      "Name in printed annual report",
      "Program committee invite",
      "Dedicated member liaison officer",
      "Exclusive networking receptions",
    ],
  },
];

const STEPS = [
  {
    num: "01",
    title: "Choose a Tier",
    desc: "Select the membership level that fits your goals and commitment.",
  },
  {
    num: "02",
    title: "Complete Application",
    desc: "Fill out the membership form with your personal and contact details.",
  },
  {
    num: "03",
    title: "Make Payment",
    desc: "Pay securely via Paystack — card, bank transfer, or mobile money.",
  },
  {
    num: "04",
    title: "Get Activated",
    desc: "Receive your membership number and access your member portal within 24 hours.",
  },
];

export default function MembershipPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, var(--yif-navy) 0%, var(--yif-navy-dark) 60%, #0d1526 100%)",
        }}
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, var(--yif-gold) 0px, var(--yif-gold) 1px, transparent 1px, transparent 40px)`,
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--yif-gold)] mb-4">
            Join the Foundation
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Become a
            <br />
            <span className="text-[var(--yif-gold)]">YIF Member</span>
          </h1>
          <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Be part of a global community of Yoruba professionals, scholars, and
            advocates dedicated to preserving our heritage, uplifting our
            communities, and amplifying our collective voice.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#tiers"
              className="rounded-full bg-[var(--yif-gold)] text-[var(--yif-navy-dark)] px-8 py-3.5 font-semibold text-sm hover:bg-[var(--yif-gold-light)] transition-colors"
            >
              View Membership Tiers
            </a>
            <Link
              href="/login"
              className="rounded-full border border-white/20 text-white px-8 py-3.5 font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          </div>
          {/* Stats strip */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {[
              { n: "1,200+", l: "Members" },
              { n: "32", l: "Countries" },
              { n: "UN/ECOSOC", l: "Consultative Status" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="font-display text-xl font-bold text-[var(--yif-gold)]">
                  {s.n}
                </p>
                <p className="text-xs text-white/40 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section
        id="tiers"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--yif-cream)]"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--yif-gold)] mb-2">
              Membership Tiers
            </p>
            <h2 className="font-display text-4xl font-semibold text-[var(--yif-navy)]">
              Choose Your Level
            </h2>
            <p className="mt-3 text-[var(--muted)] max-w-xl mx-auto text-sm">
              All memberships are renewed annually and include access to the YIF
              Member Portal.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TIERS.map((tier) => (
              <div
                key={tier.slug}
                className="relative rounded-2xl bg-white border flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                style={{
                  borderColor: `color-mix(in srgb, ${tier.color} 25%, #e5e7eb)`,
                }}
              >
                {tier.badge && (
                  <div
                    className="absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-xl"
                    style={{ backgroundColor: tier.color }}
                  >
                    {tier.badge}
                  </div>
                )}
                <div className="px-5 pt-6 pb-4">
                  <p
                    className="font-display text-lg font-semibold"
                    style={{ color: tier.color }}
                  >
                    {tier.name}
                  </p>
                  <p className="font-display text-3xl font-bold text-[var(--yif-navy)] mt-1">
                    {tier.price}
                    <span className="text-sm font-sans font-normal text-[var(--muted)]">
                      {tier.period}
                    </span>
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-2">
                    {tier.summary}
                  </p>
                </div>
                <div className="px-5 pb-4 flex-1">
                  <ul className="space-y-2">
                    {tier.benefits.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-sm text-[var(--yif-charcoal)]"
                      >
                        <span
                          className="mt-0.5 shrink-0 font-bold"
                          style={{ color: tier.color }}
                        >
                          ✓
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-5 pb-5">
                  <Link
                    href={`/membership/apply?tier=${tier.slug}`}
                    className="block w-full text-center rounded-xl py-2.5 text-sm font-semibold transition-colors text-white"
                    style={{ backgroundColor: tier.color }}
                  >
                    Join as {tier.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits comparison table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--yif-cream-dark)]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--yif-gold)] mb-2">
              Compare Plans
            </p>
            <h2 className="font-display text-4xl font-semibold text-[var(--yif-navy)]">
              Benefits at a Glance
            </h2>
          </div>
          <div className="overflow-x-auto rounded-2xl shadow-sm">
            <table className="w-full text-sm bg-white">
              <thead>
                <tr className="border-b border-[var(--yif-cream-dark)]">
                  <th className="text-left px-5 py-4 text-[var(--yif-navy)] font-semibold">
                    Benefit
                  </th>
                  {TIERS.map((t) => (
                    <th
                      key={t.slug}
                      className="px-3 py-4 text-center font-display font-semibold"
                      style={{ color: t.color }}
                    >
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--yif-cream-dark)]">
                {[
                  { label: "Newsletter & community", from: 0 },
                  { label: "Cultural event invitations", from: 0 },
                  { label: "Member directory listing", from: 0 },
                  { label: "Event ticket discount (10%)", from: 1 },
                  { label: "Voting rights", from: 1 },
                  { label: "Mentorship Program", from: 1 },
                  { label: "Event ticket discount (20%)", from: 2 },
                  { label: "Scholarship nominations", from: 2 },
                  { label: "Priority registration", from: 2 },
                  { label: "Quarterly board briefings", from: 2 },
                  { label: "Annual gala seat", from: 3 },
                  { label: "Annual report listing", from: 3 },
                  { label: "Program committee invite", from: 3 },
                ].map((row) => (
                  <tr
                    key={row.label}
                    className="hover:bg-[var(--yif-cream)]/50 transition-colors"
                  >
                    <td className="px-5 py-3 text-[var(--yif-charcoal)]">
                      {row.label}
                    </td>
                    {TIERS.map((t, i) => (
                      <td key={t.slug} className="px-3 py-3 text-center">
                        {i >= row.from ? (
                          <span
                            style={{ color: t.color }}
                            className="font-bold text-base"
                          >
                            ✓
                          </span>
                        ) : (
                          <span className="text-[var(--muted)]/30 text-base">
                            –
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How to join */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--yif-cream)]">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--yif-gold)] mb-2">
              How It Works
            </p>
            <h2 className="font-display text-4xl font-semibold text-[var(--yif-navy)]">
              Join in 4 Steps
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-14 h-14 rounded-full border-2 border-[var(--yif-gold)]/30 bg-[var(--yif-gold)]/8 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display text-[var(--yif-gold)] font-bold text-lg">
                    {step.num}
                  </span>
                </div>
                <p className="font-display text-lg font-semibold text-[var(--yif-navy)] mb-2">
                  {step.title}
                </p>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{
          background:
            "linear-gradient(135deg, var(--yif-navy) 0%, var(--yif-navy-dark) 100%)",
        }}
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--yif-gold)] mb-3">
            Ready to Join?
          </p>
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Àgbájọ owó la ń gberu dori
          </h2>
          <p className="text-white/50 text-sm mb-2 italic">
            &ldquo;We carry the load on our heads collectively.&rdquo;
          </p>
          <p className="text-white/50 text-sm mt-4 mb-8">
            Your membership directly funds scholarships, cultural Programs, and
            community advocacy. Join over 1,200 members worldwide.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#tiers"
              className="rounded-full bg-[var(--yif-gold)] text-[var(--yif-navy-dark)] px-8 py-3.5 font-bold text-sm hover:bg-[var(--yif-gold-light)] transition-colors"
            >
              Apply for Membership
            </a>
            <Link
              href="/contact"
              className="rounded-full border border-white/30 text-white px-8 py-3.5 font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
