import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "My Tickets | YIF Member Portal",
};

function metaStr(metadata: unknown, key: string): string {
  if (metadata && typeof metadata === "object" && !Array.isArray(metadata)) {
    const v = (metadata as Record<string, unknown>)[key];
    if (typeof v === "string") return v;
    if (typeof v === "number") return String(v);
  }
  return "";
}

export default async function TicketsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const tickets = await prisma.transaction.findMany({
    where: { userId: session.user.id, purpose: "TICKET", status: "SUCCESS" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      amount: true,
      currency: true,
      reference: true,
      metadata: true,
      createdAt: true,
      paidAt: true,
    },
  });

  // Batch-fetch events referenced by eventId in metadata.
  const eventIds = [
    ...new Set(
      tickets
        .map((t) => metaStr(t.metadata, "eventId"))
        .filter(Boolean),
    ),
  ];
  const events =
    eventIds.length > 0
      ? await prisma.event.findMany({
          where: { id: { in: eventIds } },
          select: { id: true, date: true, time: true, address: true, country: true, slug: true },
        })
      : [];
  const eventMap = new Map(events.map((e) => [e.id, e]));

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-1">
          Member Portal
        </p>
        <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          My Tickets
        </h1>
        <p className="mt-1 text-white/50 text-sm">
          Your event registrations and ticket history.
        </p>
      </div>

      <section className="mb-10">
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="rounded-xl bg-white/5 border border-white/10 px-5 py-10 text-center text-white/40 text-sm">
              No tickets yet.{" "}
              <Link
                href="/events"
                className="text-[var(--yif-gold)] hover:underline"
              >
                Browse events →
              </Link>
            </div>
          ) : (
            tickets.map((t) => {
              const eventTitle = metaStr(t.metadata, "eventTitle") || "Event ticket";
              const tierName = metaStr(t.metadata, "tierName") || "Ticket";
              const quantity = metaStr(t.metadata, "quantity") || "1";
              const eventId = metaStr(t.metadata, "eventId");
              const eventSlug = metaStr(t.metadata, "eventSlug");
              const event = eventId ? eventMap.get(eventId) : undefined;

              const eventDate = event?.date
                ? new Date(event.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : null;
              const isUpcoming = event?.date
                ? new Date(event.date) > new Date()
                : null;

              return (
                <div
                  key={t.id}
                  className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-stretch">
                    <div
                      className={`w-full sm:w-1.5 h-1.5 sm:h-auto shrink-0 ${
                        isUpcoming === true
                          ? "bg-[var(--yif-gold)]"
                          : isUpcoming === false
                          ? "bg-white/20"
                          : "bg-[var(--yif-gold)]"
                      }`}
                    />

                    <div className="flex-1 px-5 py-5">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-base font-semibold text-white leading-snug">
                            {eventSlug ? (
                              <Link
                                href={`/events/${eventSlug}`}
                                className="hover:text-[var(--yif-gold)] transition-colors"
                              >
                                {eventTitle}
                              </Link>
                            ) : (
                              eventTitle
                            )}
                          </p>

                          {(eventDate || event?.address) && (
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-white/50">
                              {eventDate && (
                                <span className="flex items-center gap-1">
                                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="2" y="3" width="12" height="11" rx="1.5" />
                                    <path d="M5 1v4M11 1v4M2 7h12" />
                                  </svg>
                                  {eventDate}
                                  {isUpcoming === true && (
                                    <span className="ml-1 text-[var(--yif-gold)]">· Upcoming</span>
                                  )}
                                </span>
                              )}
                              {event?.address && (
                                <span className="flex items-center gap-1">
                                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M8 1.5a4.5 4.5 0 0 1 4.5 4.5c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 0 1 8 1.5Z" />
                                    <circle cx="8" cy="6" r="1.5" />
                                  </svg>
                                  {event.address}{event.country ? `, ${event.country}` : ""}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="rounded-full bg-[var(--yif-gold)]/10 text-[var(--yif-gold)] text-xs px-2.5 py-0.5 font-medium border border-[var(--yif-gold)]/20">
                              {tierName}
                            </span>
                            <span className="rounded-full bg-white/10 text-white/60 text-xs px-2.5 py-0.5">
                              {quantity}{" "}
                              {quantity === "1" ? "ticket" : "tickets"}
                            </span>
                            <span className="rounded-full bg-[var(--yif-green)]/20 text-[var(--yif-green)] text-xs px-2.5 py-0.5 font-medium">
                              Confirmed
                            </span>
                          </div>
                        </div>
                        <div className="sm:text-right shrink-0">
                          <p className="font-display text-xl font-semibold text-[var(--yif-gold)]">
                            {t.currency} {Number(t.amount).toLocaleString()}
                          </p>
                          <p className="text-xs text-white/30 mt-0.5 font-mono">
                            {t.reference}
                          </p>
                          <p className="text-xs text-white/30 mt-0.5">
                            Purchased{" "}
                            {new Date(t.paidAt ?? t.createdAt).toLocaleDateString(
                              "en-GB",
                              { day: "numeric", month: "short", year: "numeric" },
                            )}
                          </p>
                        </div>
                      </div>

                      {/* QR placeholder */}
                      <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                          <svg
                            viewBox="0 0 24 24"
                            className="w-7 h-7 text-white/40"
                            fill="currentColor"
                          >
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="3" height="3" rx="0.5" />
                            <rect x="19" y="14" width="2" height="2" rx="0.5" />
                            <rect x="17" y="17" width="4" height="4" rx="0.5" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-white/50">
                            {isUpcoming === true
                              ? "Your QR code will be available 48 hours before the event."
                              : "Present your confirmation email at the venue."}
                          </p>
                          <p className="text-xs text-white/30 mt-0.5">
                            A confirmation email was sent to your registered address.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Browse more events CTA */}
      <div className="mt-8 text-center">
        <p className="text-white/40 text-sm mb-3">
          Looking for upcoming events?
        </p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--yif-gold)] px-6 py-2.5 text-sm font-semibold text-[var(--yif-navy-dark)] hover:bg-[var(--yif-gold-light)] transition-colors"
        >
          Browse Events →
        </Link>
      </div>
    </div>
  );
}
