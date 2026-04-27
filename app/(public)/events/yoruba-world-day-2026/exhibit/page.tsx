import type { Metadata } from "next";
import Link from "next/link";
import ExhibitForm from "./_ExhibitForm";
import { YWD_EVENT } from "@/lib/yoruba-world-day-2026";

export const metadata: Metadata = {
  title: `Exhibit — ${YWD_EVENT.title}`,
  description: `Exhibit your products and services to a global Yoruba diaspora audience at ${YWD_EVENT.title}.`,
};

export default function ExhibitPage() {
  return (
    <main className="bg-[var(--yif-cream-dark)] py-16">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/events/yoruba-world-day-2026"
          className="text-sm text-[var(--yif-charcoal)]/70 hover:text-[var(--yif-navy-dark)]"
        >
          ← Back to event
        </Link>

        <div className="mt-6">
          <div className="text-xs tracking-wider text-[var(--yif-gold)] uppercase">
            Exhibitors
          </div>
          <h1 className="mt-2 font-serif text-4xl text-[var(--yif-navy-dark)]">
            Exhibit at Yoruba World Day 2026
          </h1>
          <p className="mt-3 text-[var(--yif-charcoal)]/80">
            Showcase Nigerian innovation, culture, and craft to a global
            audience of investors, ministers, and diaspora leaders.
          </p>
        </div>

        <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-10">
          <ExhibitForm />
        </div>
      </div>
    </main>
  );
}
