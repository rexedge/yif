import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Scholarship Programme | YIF — Yoruba Indigenes' Foundation",
  description:
    "YIF Scholarship Programme 2024–2025. Open to Yoruba indigenes with academic merit and financial need. Registration fee: ₦5,000.",
};

export default function ScholarshipPage() {
  return (
    <div className="min-h-screen bg-[var(--yif-cream)]">
      {/* Hero */}
      <section className="bg-[var(--yif-navy)] py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-3">
            Programs
          </p>
          <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl mb-4">
            YIF Scholarship Programme
          </h1>
          <p className="text-lg text-white/60">
            2024–2025 Batch — Empowering Yoruba students in premium universities
            at home and abroad.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* About */}
        <div className="mb-14">
          <p className="text-[var(--yif-navy)]/70 text-lg leading-relaxed">
            Several students who are Yoruba indigenes now stand the chance of
            winning top-slot scholarships in premium universities both home and
            abroad — with a registration fee of just ₦5,000. The Yoruba
            Indigenes&apos; Foundation (Reg. No. IT 28744) is committed to
            investing in the next generation of Yoruba leaders.
          </p>
        </div>

        {/* Eligibility */}
        <div className="bg-white rounded-2xl border border-[var(--yif-navy)]/10 p-8 mb-10 shadow-sm">
          <h2 className="font-display text-2xl font-semibold text-[var(--yif-navy)] mb-6">
            Eligibility Criteria
          </h2>
          <ul className="space-y-3">
            {[
              { icon: "🌿", label: "Yoruba heritage requirement" },
              { icon: "🎓", label: "Academic merit — strong academic record" },
              {
                icon: "💛",
                label: "Financial need — demonstrated economic need",
              },
              {
                icon: "💳",
                label: "Registration fee of ₦5,000 (approx. $14 USD / £11 GBP)",
              },
            ].map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                <span className="text-xl shrink-0">{item.icon}</span>
                <span className="text-[var(--yif-navy)]/70">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Features */}
        <div className="grid gap-6 sm:grid-cols-3 mb-14">
          {[
            {
              icon: "🏛️",
              title: "Home Universities",
              desc: "Top Nigerian universities across Lagos, Ibadan, and beyond.",
            },
            {
              icon: "✈️",
              title: "Diaspora Awards",
              desc: "Scholarships available for Yoruba students studying abroad.",
            },
            {
              icon: "🏅",
              title: "Annual Cohort",
              desc: "Awards made once a year — apply early to secure your spot.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-[var(--yif-navy)]/10 p-6 shadow-sm text-center"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-display text-lg font-semibold text-[var(--yif-navy)] mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--yif-navy)]/60">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-[var(--yif-navy)] rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-white mb-3">
            Ready to Apply?
          </h2>
          <p className="text-white/50 text-sm mb-6">
            Log in to your member portal to access the scholarship application
            form.
          </p>
          <Link
            href="/dashboard/scholarship"
            className="inline-block rounded-xl bg-[var(--yif-gold)] text-[var(--yif-navy)] px-8 py-3 font-semibold hover:opacity-90 transition-opacity"
          >
            Apply for Scholarship
          </Link>
          <p className="text-white/25 text-xs mt-5">
            Registration No. IT 28744 · UN/ECOSOC Special Consultative Status
            (2019)
          </p>
        </div>
      </div>
    </div>
  );
}
