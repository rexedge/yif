import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Youth Development & Empowerment | YIF",
  description:
    "YIF Youth Development and Empowerment Program — building the next generation of Yoruba leaders at home and in the diaspora.",
};

export default function YouthPage() {
  return (
    <div className="min-h-screen bg-[var(--yif-cream)]">
      {/* Hero */}
      <section className="bg-[var(--yif-navy)] py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-3">
            Programs
          </p>
          <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl mb-4">
            Youth Development &amp; Empowerment
          </h1>
          <p className="text-lg text-white/60">
            Equipping young Yorubas worldwide with tools, networks, and
            opportunities to lead the next chapter.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Leadership */}
        <div className="grid gap-5 sm:grid-cols-2 mb-14">
          {[
            {
              role: "Youth Coordinator",
              name: "Ogundare Adenike",
              desc: "Leads youth engagement and coordination across all YIF chapters.",
            },
            {
              role: "Director of IT & Youth Affairs",
              name: "Mr. Oluwatosin Famori",
              desc: "Oversees digital strategy and youth affairs for YIF Worldwide.",
            },
          ].map((p) => (
            <div
              key={p.name}
              className="bg-white rounded-2xl border border-[var(--yif-navy)]/10 p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--yif-gold)] mb-1">
                {p.role}
              </p>
              <p className="font-display text-xl font-semibold text-[var(--yif-navy)] mb-2">
                {p.name}
              </p>
              <p className="text-sm text-[var(--yif-navy)]/60">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Pillars */}
        <h2 className="font-display text-2xl font-semibold text-[var(--yif-navy)] mb-6">
          Program Pillars
        </h2>
        <div className="grid gap-5 sm:grid-cols-3 mb-14">
          {[
            {
              icon: "📚",
              title: "Education & Mentorship",
              desc: "Connecting youth with Yoruba professionals and scholars for guidance and mentorship.",
            },
            {
              icon: "💡",
              title: "Skills & Entrepreneurship",
              desc: "Workshops, training, and cooperative economy participation through Karo-Ojire Investments.",
            },
            {
              icon: "🌍",
              title: "Cultural Identity",
              desc: "Celebrating Yoruba heritage, language, and values through events and diaspora programming.",
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
            Get Involved
          </h2>
          <p className="text-white/50 text-sm mb-6">
            Join YIF to connect with our youth network and access exclusive
            Programs.
          </p>
          <Link
            href="/membership"
            className="inline-block rounded-xl bg-[var(--yif-gold)] text-[var(--yif-navy)] px-8 py-3 font-semibold hover:opacity-90 transition-opacity"
          >
            Become a Member
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
