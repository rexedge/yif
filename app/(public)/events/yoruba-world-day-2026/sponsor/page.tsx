import type { Metadata } from "next";
import Link from "next/link";
import SponsorForm from "./_SponsorForm";
import { YWD_EVENT, YWD_SPONSORSHIP_TIERS } from "@/lib/yoruba-world-day-2026";
import { formatCurrency } from "@/lib/currency";

export const metadata: Metadata = {
  title: `Sponsor — ${YWD_EVENT.title}`,
  description: `Align your brand with ${YWD_EVENT.title}. Headline, Platinum, Gold and Silver tiers available.`,
};

export default function SponsorPage() {
  return (
    <main className="bg-[var(--yif-cream-dark)] py-16">
      <div className="mx-auto max-w-5xl px-6">
        <Link
          href="/events/yoruba-world-day-2026"
          className="text-sm text-[var(--yif-charcoal)]/70 hover:text-[var(--yif-navy-dark)]"
        >
          ← Back to event
        </Link>

        <div className="mt-6">
          <div className="text-xs tracking-wider text-[var(--yif-gold)] uppercase">
            Sponsorship
          </div>
          <h1 className="mt-2 font-serif text-4xl text-[var(--yif-navy-dark)]">
            Become a Sponsor of Yoruba World Day 2026
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--yif-charcoal)]/80">
            Place your brand alongside Heads of State, Federal Ministers, and
            the global Yoruba diaspora in New York City this August.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
            <SponsorForm />
          </div>

          <aside className="space-y-3">
            <h2 className="font-serif text-lg text-[var(--yif-navy-dark)]">
              Tiers at a glance
            </h2>
            {YWD_SPONSORSHIP_TIERS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl bg-white p-4 ring-1 ring-black/5"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-[var(--yif-navy-dark)]">
                    {t.name}
                  </span>
                  <span className="font-serif text-lg text-[var(--yif-gold)]">
                    ${t.amountUsd.toLocaleString("en-US")}
                  </span>
                </div>
                <div className="text-xs text-[var(--yif-charcoal)]/60">
                  {formatCurrency(t.amountNgn, "NGN")} approx.
                </div>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </main>
  );
}
