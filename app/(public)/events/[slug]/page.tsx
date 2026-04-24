import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TicketCheckout from "./TicketCheckout";

type Props = { params: Promise<{ slug: string }> };

const CATEGORY_GRADIENTS: Record<string, string> = {
  Awards: "from-[#c9913d] to-[#1a2744]",
  Conference: "from-[#1a2744] to-[#2d3e6b]",
  Workshop: "from-[#2d6a4f] to-[#1a3d30]",
  Fundraiser: "from-[#c0553a] to-[#7a2a18]",
  Cultural: "from-[#c9913d] to-[#8b5e1e]",
};

function formatEventDate(date: Date, endDate?: Date | null): string {
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const start = date.toLocaleDateString("en-GB", opts);
  if (!endDate) return start;
  return `${date.toLocaleDateString("en-GB", { day: "numeric", month: "long" })} – ${endDate.toLocaleDateString("en-GB", opts)}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) return { title: "Event Not Found | YIF" };
  return {
    title: `${event.title} | YIF`,
    description: (event.description ?? "").slice(0, 160),
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: { tiers: true },
  });
  if (!event) notFound();

  const isPast = event.date < new Date();
  const gradient =
    CATEGORY_GRADIENTS[event.category ?? "Conference"] ??
    CATEGORY_GRADIENTS.Conference;
  const agenda = Array.isArray(event.agenda) ? (event.agenda as string[]) : [];
  const speakers = Array.isArray(event.speakers)
    ? (event.speakers as Array<{ name: string; role: string }>)
    : [];

  return (
    <>
      {/* ── Hero band ── */}
      <div
        className={`relative overflow-hidden bg-gradient-to-br ${gradient} py-24 sm:py-32`}
      >
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="ev-detail-p"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="30"
                cy="30"
                r="12"
                fill="none"
                stroke="white"
                strokeWidth="0.7"
              />
              <rect
                x="10"
                y="10"
                width="40"
                height="40"
                fill="none"
                stroke="white"
                strokeWidth="0.4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ev-detail-p)" />
        </svg>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M13 7H1M6 3L2 7l4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            All Events
          </Link>

          <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
            {event.category}
          </span>
          <h1 className="mt-2 font-display text-4xl font-semibold text-white sm:text-5xl">
            {event.title}
          </h1>
          {event.tagline && (
            <p className="mt-3 text-lg text-white/70 italic">{event.tagline}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/80">
            <span className="flex items-center gap-2">
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <rect
                  x="1"
                  y="2"
                  width="14"
                  height="13"
                  rx="2"
                  stroke="white"
                  strokeWidth="1.2"
                />
                <path
                  d="M1 7h14M5 1v2M11 1v2"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <time dateTime={event.date.toISOString()}>
                {formatEventDate(event.date, event.endDate)}{" "}
                {event.time ? `· ${event.time}` : ""}
              </time>
            </span>
            {event.location && (
              <span className="flex items-center gap-2">
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M8 1C5.24 1 3 3.24 3 6c0 4.25 5 9 5 9s5-4.75 5-9c0-2.76-2.24-5-5-5z"
                    stroke="white"
                    strokeWidth="1.2"
                  />
                  <circle
                    cx="8"
                    cy="6"
                    r="2"
                    stroke="white"
                    strokeWidth="1.2"
                  />
                </svg>
                {event.location}
                {event.country ? `, ${event.country}` : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left: details */}
          <div className="lg:col-span-2 space-y-10">
            {/* About */}
            {event.description && (
              <section>
                <h2 className="mb-4 font-display text-2xl font-semibold text-[var(--yif-navy)]">
                  About This Event
                </h2>
                <p className="leading-relaxed text-[var(--yif-charcoal)]">
                  {event.description}
                </p>
              </section>
            )}

            {/* Agenda */}
            {agenda.length > 0 && (
              <section>
                <h2 className="mb-4 font-display text-2xl font-semibold text-[var(--yif-navy)]">
                  Agenda
                </h2>
                <ol className="space-y-2">
                  {agenda.map((item, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm text-[var(--yif-charcoal)]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--yif-gold)]/10 text-xs font-bold text-[var(--yif-gold)]">
                        {i + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Speakers */}
            {speakers.length > 0 && (
              <section>
                <h2 className="mb-4 font-display text-2xl font-semibold text-[var(--yif-navy)]">
                  Speakers &amp; Organisers
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {speakers.map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center gap-3 rounded-xl border border-[var(--yif-cream-dark)] bg-[var(--yif-cream)] p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--yif-navy)] text-sm font-bold text-[var(--yif-gold)]">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--yif-navy)]">
                          {s.name}
                        </p>
                        <p className="text-xs text-[var(--muted)]">{s.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Venue */}
            {event.location && (
              <section>
                <h2 className="mb-4 font-display text-2xl font-semibold text-[var(--yif-navy)]">
                  Venue
                </h2>
                <div className="rounded-xl border border-[var(--yif-cream-dark)] bg-[var(--yif-cream)] p-4 text-sm text-[var(--yif-charcoal)]">
                  <p className="font-semibold">{event.location}</p>
                  {event.address && (
                    <p className="text-[var(--muted)]">{event.address}</p>
                  )}
                  {event.country && (
                    <p className="text-[var(--muted)]">{event.country}</p>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right: ticket checkout */}
          <aside className="lg:sticky lg:top-24 h-fit">
            {isPast ? (
              <div className="rounded-2xl border border-[var(--yif-cream-dark)] bg-[var(--yif-cream)] p-6 text-center">
                <p className="text-[var(--muted)]">
                  This event has already taken place.
                </p>
                <Link
                  href="/events"
                  className="mt-4 inline-block rounded-lg bg-[var(--yif-navy)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--yif-navy-light)] transition-colors"
                >
                  View upcoming events
                </Link>
              </div>
            ) : (
              <>
                {/* Price summary */}
                {event.tiers.length > 0 && (
                  <div className="mb-4 rounded-xl border border-[var(--yif-cream-dark)] bg-[var(--yif-cream)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
                      Tickets from
                    </p>
                    <p className="mt-1 font-display text-3xl font-semibold text-[var(--yif-navy)]">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        minimumFractionDigits: 0,
                      }).format(
                        Math.min(...event.tiers.map((t) => Number(t.price))),
                      )}
                    </p>
                  </div>
                )}
                {event.tiers.length > 0 ? (
                  <TicketCheckout eventSlug={event.slug} tiers={event.tiers} />
                ) : (
                  <div className="rounded-2xl border border-[var(--yif-cream-dark)] bg-[var(--yif-cream)] p-6 text-center">
                    <p className="text-[var(--muted)]">
                      Ticket details coming soon.
                    </p>
                  </div>
                )}
              </>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
