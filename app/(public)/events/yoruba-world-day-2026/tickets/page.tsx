import type { Metadata } from "next";
import Link from "next/link";
import TicketForm from "./_TicketForm";
import { YWD_EVENT } from "@/lib/yoruba-world-day-2026";

export const metadata: Metadata = {
  title: `Buy Delegate Pass — ${YWD_EVENT.title}`,
  description: `Reserve your seat at ${YWD_EVENT.title} (${YWD_EVENT.dateLabel}, ${YWD_EVENT.city}). $${YWD_EVENT.ticketPriceUsd} per delegate.`,
};

export default function TicketsPage() {
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
            Delegate Registration
          </div>
          <h1 className="mt-2 font-serif text-4xl text-[var(--yif-navy-dark)]">
            Reserve Your Seat
          </h1>
          <p className="mt-3 text-[var(--yif-charcoal)]/80">
            {YWD_EVENT.title} · {YWD_EVENT.dateLabel} · {YWD_EVENT.venue},{" "}
            {YWD_EVENT.city}
          </p>
        </div>

        <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-10">
          <TicketForm />
        </div>
      </div>
    </main>
  );
}
