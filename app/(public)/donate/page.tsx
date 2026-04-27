import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import DonateForm from "./DonateForm";

export const metadata: Metadata = {
  title: "Donate | Yoruba Indigenes' Foundation",
  description:
    "Support the Yoruba Indigenes' Foundation. Your donation funds scholarships, cultural preservation, and community development Programs worldwide.",
};

const IMPACT_ITEMS = [
  {
    icon: "🎓",
    value: "₦500k",
    label: "funds one university scholarship for a year",
  },
  {
    icon: "🌍",
    value: "₦25k",
    label: "supports one youth in our leadership Program",
  },
  {
    icon: "📚",
    value: "₦10k",
    label: "preserves one piece of Yoruba cultural heritage",
  },
  {
    icon: "🤝",
    value: "₦5k",
    label: "connects a diaspora family to community resources",
  },
];

const TRUST_ITEMS = [
  "UN/ECOSOC Consultative Status NGO",
  "Registered NGO · IT 28744",
  "Transparent annual financial reports",
  "Over 10,000 beneficiaries served",
];

export default async function DonatePage() {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);
  const user = session?.user
    ? { name: session.user.name ?? "", email: session.user.email }
    : null;

  return (
    <>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-[var(--yif-navy)] py-24 sm:py-32">
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="donate-pat"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="30"
                cy="30"
                r="14"
                fill="none"
                stroke="white"
                strokeWidth="0.6"
              />
              <circle
                cx="30"
                cy="30"
                r="6"
                fill="none"
                stroke="white"
                strokeWidth="0.4"
              />
              <line
                x1="30"
                y1="0"
                x2="30"
                y2="16"
                stroke="white"
                strokeWidth="0.4"
              />
              <line
                x1="30"
                y1="44"
                x2="30"
                y2="60"
                stroke="white"
                strokeWidth="0.4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#donate-pat)" />
        </svg>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--yif-gold)] mb-4">
            Make a Difference
          </p>
          <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">
            Support the Yoruba Indigenes&#39; Foundation
          </h1>
          <p className="mt-5 text-lg text-white/70 leading-relaxed">
            Your contribution funds scholarships, cultural preservation, youth
            development, and community Programs that uplift Yoruba people across
            the globe.
          </p>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="bg-[var(--yif-cream)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Donate form — wider */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl bg-white border border-[var(--yif-cream-dark)] shadow-sm p-6 sm:p-8">
                <h2 className="mb-6 font-display text-2xl font-semibold text-[var(--yif-navy)]">
                  Make Your Gift
                </h2>
                <DonateForm user={user} />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-2 space-y-6">
              {/* Trust badges */}
              <div className="rounded-2xl border border-[var(--yif-cream-dark)] bg-white p-6">
                <h3 className="mb-4 font-display text-lg font-semibold text-[var(--yif-navy)]">
                  Your Trust Matters
                </h3>
                <ul className="space-y-2">
                  {TRUST_ITEMS.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-[var(--yif-charcoal)]"
                    >
                      <svg
                        aria-hidden="true"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="mt-0.5 shrink-0"
                      >
                        <path
                          d="M3 8l3.5 3.5 6.5-7"
                          stroke="var(--yif-green)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Impact */}
              <div className="rounded-2xl border border-[var(--yif-cream-dark)] bg-white p-6">
                <h3 className="mb-4 font-display text-lg font-semibold text-[var(--yif-navy)]">
                  Your Impact
                </h3>
                <div className="space-y-4">
                  {IMPACT_ITEMS.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <p className="text-sm text-[var(--yif-charcoal)] leading-snug">
                        <span className="font-bold text-[var(--yif-gold)]">
                          {item.value}
                        </span>{" "}
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <blockquote className="rounded-2xl border border-[var(--yif-gold)]/30 bg-[var(--yif-gold)]/5 p-6">
                <p className="text-sm italic text-[var(--yif-charcoal)] leading-relaxed">
                  &ldquo;Every contribution, no matter the size, strengthens the
                  foundation upon which future generations of Yoruba people will
                  stand.&rdquo;
                </p>
                <footer className="mt-3 text-xs font-semibold text-[var(--yif-gold)]">
                  — YIF Leadership Council
                </footer>
              </blockquote>
            </aside>
          </div>
        </div>
      </div>

      {/* ── Impact stats ── */}
      <div className="bg-[var(--yif-navy)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            {[
              { value: "10,000+", label: "Lives touched" },
              { value: "50+", label: "Scholarships awarded" },
              { value: "30+", label: "Countries reached" },
              { value: "15+", label: "Years of service" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl font-semibold text-[var(--yif-gold)] sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
