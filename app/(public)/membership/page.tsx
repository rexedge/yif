import type { Metadata } from "next";
import Link from "next/link";
import { getActiveTiers } from "@/lib/membership";
import { TierCards } from "./TierCards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Membership | YIF",
  description:
    "Join the Yoruba Indigenes' Foundation as a member and be part of a global community committed to Yoruba unity and progress.",
  openGraph: {
    title: "Join YIF — Membership",
    description: "Choose a membership tier and join the global Yoruba community.",
    images: [{ url: "/logo.jpg", width: 1200, height: 630, alt: "YIF Membership" }],
  },
  twitter: { card: "summary_large_image", images: ["/logo.jpg"] },
};

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
    desc: "Pay securely via Paystack (NGN) or Stripe (USD, GBP, EUR).",
  },
  {
    num: "04",
    title: "Get Activated",
    desc: "Receive your membership number and access your member portal within 24 hours.",
  },
];

const BENEFIT_ROWS = [
  { label: "Newsletter & community forum" },
  { label: "Cultural event invitations" },
  { label: "Member directory listing" },
  { label: "Event ticket discount (10%)" },
  { label: "Voting rights at general meetings" },
  { label: "Mentorship Programme access" },
  { label: "Event ticket discount (20%)" },
  { label: "Scholarship nomination rights" },
  { label: "Priority event registration" },
  { label: "Quarterly board briefings" },
  { label: "Complimentary annual gala seat" },
  { label: "Annual report listing" },
  { label: "Programme committee invite" },
];

export default async function MembershipPage() {
  const tiers = await getActiveTiers();

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
      <section id="tiers" className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--yif-cream)]">
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
              Member Portal. Toggle the currency to pay in your preferred denomination.
            </p>
          </div>
          <TierCards tiers={tiers} />
        </div>
      </section>

      {/* Benefits comparison */}
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
                  {tiers.map((t) => (
                    <th
                      key={t.slug}
                      className="px-3 py-4 text-center font-display font-semibold"
                      style={{ color: t.color ?? undefined }}
                    >
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--yif-cream-dark)]">
                {BENEFIT_ROWS.map((row, rowIdx) => (
                  <tr
                    key={row.label}
                    className="hover:bg-[var(--yif-cream)]/50 transition-colors"
                  >
                    <td className="px-5 py-3 text-[var(--yif-charcoal)]">
                      {row.label}
                    </td>
                    {tiers.map((t, tierIdx) => {
                      // Tiers are sorted by sortOrder; higher-tier tiers include more benefits
                      // First 3 rows → all tiers; rows 3-5 → tier ≥ 1; rows 6-9 → tier ≥ 2; rows 10+ → tier ≥ 3
                      const threshold =
                        rowIdx < 3 ? 0 : rowIdx < 6 ? 1 : rowIdx < 10 ? 2 : 3;
                      const included = tierIdx >= threshold;
                      return (
                        <td key={t.slug} className="px-3 py-3 text-center">
                          {included ? (
                            <span
                              style={{ color: t.color ?? undefined }}
                              className="font-bold text-base"
                            >
                              ✓
                            </span>
                          ) : (
                            <span className="text-[var(--muted)]/30 text-base">–</span>
                          )}
                        </td>
                      );
                    })}
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
          background: "linear-gradient(135deg, var(--yif-navy) 0%, var(--yif-navy-dark) 100%)",
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
            Your membership directly funds scholarships, cultural programmes, and
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
