import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  YWD_EVENT,
  YWD_EXECUTIVE_SUMMARY,
  YWD_OBJECTIVES,
  YWD_AGENDA,
  YWD_DIGNITARIES,
  YWD_HOSTS,
  YWD_NY_TEAM,
  YWD_SECTORS,
  YWD_SPONSORSHIP_TIERS,
  YWD_HOTELS,
  YWD_KPIS,
  YWD_CONTACTS,
  YWD_IMAGE_DIR,
} from "@/lib/yoruba-world-day-2026";
import { formatCurrency } from "@/lib/currency";

export const metadata: Metadata = {
  title: `${YWD_EVENT.title} — ${YWD_EVENT.subtitle}`,
  description: `${YWD_EVENT.theme}. ${YWD_EVENT.dateLabel} · ${YWD_EVENT.city}. A flagship YIF gathering convening Heads of State, Federal Ministers, the Ooni of Ife, and the global Yoruba diaspora.`,
  openGraph: {
    title: `${YWD_EVENT.title} — ${YWD_EVENT.subtitle}`,
    description: YWD_EVENT.theme,
    images: [`${YWD_IMAGE_DIR}/og-image.jpg`],
  },
};

function initials(name: string): string {
  return name
    .replace(
      /H\.E\.|HIM|Sen\.|Hon\.|Dr\.|Mr\.|Mrs\.|Maj\. Gen\.|\(Rtd\.\)|Prof\.|Chief|GCFR|CFR/g,
      "",
    )
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function DignitaryCard({
  d,
}: {
  d: { name: string; role: string; image: string; status?: string };
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-xl">
      <div className="relative aspect-[4/5] w-full bg-gradient-to-br from-[var(--yif-navy)] to-[var(--yif-navy-dark)]">
        <Image
          src={d.image}
          alt={d.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition group-hover:scale-105"
        />
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center text-5xl font-serif font-bold text-[var(--yif-gold)]/40"
        >
          {initials(d.name)}
        </div>
        {d.status && (
          <span className="absolute top-3 right-3 z-10 rounded-full bg-[var(--yif-gold)] px-2.5 py-1 text-[10px] font-semibold tracking-wider text-[var(--yif-navy-dark)] uppercase">
            {d.status}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-[var(--yif-navy-dark)] leading-snug">
          {d.name}
        </h3>
        <p className="mt-1 text-xs text-[var(--yif-charcoal)]/80">{d.role}</p>
      </div>
    </div>
  );
}

export default function YorubaWorldDay2026Page() {
  const vvips = YWD_DIGNITARIES.filter((d) => d.group === "vvip");
  const royal = YWD_DIGNITARIES.filter((d) => d.group === "royal");
  const keynote = YWD_DIGNITARIES.filter((d) => d.group === "keynote");
  const ministers = YWD_DIGNITARIES.filter((d) => d.group === "minister");

  return (
    <main className="bg-[var(--yif-cream-dark)]">
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[var(--yif-navy-dark)] text-white">
        <div className="absolute inset-0 -z-10">
          <Image
            src={`${YWD_IMAGE_DIR}/hero.jpg`}
            alt=""
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--yif-navy-dark)]/95 via-[var(--yif-navy)]/80 to-[var(--yif-navy-dark)]/95" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--yif-gold)]/40 bg-[var(--yif-gold)]/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-[var(--yif-gold-light)] uppercase">
            <span className="size-1.5 rounded-full bg-[var(--yif-gold)]" />
            Flagship Event · UN/ECOSOC Consultative Status
          </div>

          <h1 className="mt-6 font-serif text-5xl leading-tight md:text-7xl">
            Yoruba World Day{" "}
            <span className="text-[var(--yif-gold)]">2026</span>
          </h1>
          <p className="mt-4 max-w-3xl font-serif text-xl text-white/90 md:text-2xl">
            {YWD_EVENT.subtitle}
          </p>
          <p className="mt-2 max-w-3xl text-base text-white/70 italic">
            “{YWD_EVENT.theme}”
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <div className="text-xs tracking-wider text-[var(--yif-gold)] uppercase">
                Dates
              </div>
              <div className="mt-1 text-lg font-semibold">
                {YWD_EVENT.dateLabel}
              </div>
            </div>
            <div>
              <div className="text-xs tracking-wider text-[var(--yif-gold)] uppercase">
                Venue
              </div>
              <div className="mt-1 text-lg font-semibold">
                {YWD_EVENT.venue}
              </div>
              <div className="text-sm text-white/70">{YWD_EVENT.city}</div>
            </div>
            <div>
              <div className="text-xs tracking-wider text-[var(--yif-gold)] uppercase">
                Delegate Pass
              </div>
              <div className="mt-1 text-lg font-semibold">
                ${YWD_EVENT.ticketPriceUsd} USD
              </div>
              <div className="text-sm text-white/70">
                {formatCurrency(YWD_EVENT.ticketPriceNgn, "NGN")}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/events/yoruba-world-day-2026/tickets"
              className="rounded-full bg-[var(--yif-gold)] px-7 py-3 text-sm font-bold text-[var(--yif-navy-dark)] uppercase tracking-wider shadow-lg shadow-[var(--yif-gold)]/30 transition hover:bg-[var(--yif-gold-light)]"
            >
              Buy Delegate Pass
            </Link>
            <Link
              href="/events/yoruba-world-day-2026/sponsor"
              className="rounded-full border-2 border-white/80 bg-white/0 px-7 py-3 text-sm font-bold text-white uppercase tracking-wider transition hover:bg-white/10"
            >
              Become a Sponsor
            </Link>
            <Link
              href="/events/yoruba-world-day-2026/exhibit"
              className="rounded-full border-2 border-[var(--yif-gold)]/60 bg-[var(--yif-gold)]/10 px-7 py-3 text-sm font-bold text-[var(--yif-gold-light)] uppercase tracking-wider transition hover:bg-[var(--yif-gold)]/20"
            >
              Exhibit at YWD
            </Link>
          </div>
        </div>
      </section>

      {/* ── EXECUTIVE SUMMARY ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <div className="text-xs tracking-wider text-[var(--yif-gold)] uppercase">
              Executive Summary
            </div>
            <h2 className="mt-3 font-serif text-4xl text-[var(--yif-navy-dark)]">
              A diaspora-driven engine for Nigeria&rsquo;s next chapter.
            </h2>
            <p className="mt-6 text-[var(--yif-charcoal)]/85 leading-relaxed">
              Yoruba World Day 2026 is the flagship gathering of the Yoruba
              Indigenes&rsquo; Foundation — convened in New York to rebrand
              Nigeria, attract investment, and amplify the Renewed Hope Agenda
              across the global diaspora.
            </p>
            <p className="mt-4 text-[var(--yif-charcoal)]/85 leading-relaxed">
              Prepared in honour of {YWD_EVENT.preparedFor}, the summit unites
              Heads of State, Federal Ministers, royal fathers, and the most
              influential Yoruba voices worldwide.
            </p>
          </div>
          <ul className="space-y-3">
            {YWD_EXECUTIVE_SUMMARY.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl bg-white p-4 ring-1 ring-black/5"
              >
                <span className="mt-1 size-2 shrink-0 rounded-full bg-[var(--yif-gold)]" />
                <span className="text-sm font-medium text-[var(--yif-navy-dark)]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── OBJECTIVES + KPIS ─────────────────────────────────────────── */}
      <section className="bg-[var(--yif-navy-dark)] text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <div className="text-xs tracking-wider text-[var(--yif-gold)] uppercase">
              Strategic Objectives
            </div>
            <h2 className="mt-3 font-serif text-4xl">
              Five outcomes. One Renewed Hope.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {YWD_OBJECTIVES.map((o, i) => (
              <div
                key={o}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <div className="font-serif text-3xl text-[var(--yif-gold)]">
                  0{i + 1}
                </div>
                <p className="mt-3 text-sm font-medium leading-snug">{o}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-2 gap-6 border-t border-white/10 pt-12 md:grid-cols-5">
            {YWD_KPIS.map((k) => (
              <div key={k.label} className="text-center">
                <div className="font-serif text-3xl text-[var(--yif-gold)] md:text-4xl">
                  {k.value}
                </div>
                <div className="mt-2 text-xs tracking-wider text-white/70 uppercase">
                  {k.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENDA ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <div className="text-xs tracking-wider text-[var(--yif-gold)] uppercase">
            Programme
          </div>
          <h2 className="mt-3 font-serif text-4xl text-[var(--yif-navy-dark)]">
            Two Days That Will Move Markets and Hearts.
          </h2>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {YWD_AGENDA.map((day) => (
            <div
              key={day.day}
              className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5"
            >
              <div className="bg-gradient-to-br from-[var(--yif-navy)] to-[var(--yif-navy-dark)] p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="text-xs tracking-wider text-[var(--yif-gold)] uppercase">
                    Day {day.day}
                  </div>
                  <div className="text-xs text-white/70">{day.date}</div>
                </div>
                <h3 className="mt-2 font-serif text-2xl">{day.title}</h3>
                <p className="mt-1 text-sm text-white/75 italic">{day.focus}</p>
              </div>
              <ul className="divide-y divide-black/5">
                {day.items.map((item, i) => (
                  <li key={i} className="flex gap-4 px-6 py-4">
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--yif-gold)]/20 text-xs font-bold text-[var(--yif-navy-dark)]">
                      {i + 1}
                    </span>
                    <span className="text-sm text-[var(--yif-charcoal)]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIGNITARIES ──────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <div className="text-xs tracking-wider text-[var(--yif-gold)] uppercase">
              Confirmed Dignitaries
            </div>
            <h2 className="mt-3 font-serif text-4xl text-[var(--yif-navy-dark)]">
              The Highest Office. The Highest Calibre.
            </h2>
          </div>

          {/* VVIP row */}
          <div className="mt-10">
            <h3 className="font-serif text-lg text-[var(--yif-navy-dark)]">
              Heads of State & Government
            </h3>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {[...vvips, ...keynote].map((d) => (
                <DignitaryCard key={d.name} d={d} />
              ))}
            </div>
          </div>

          {/* Royal */}
          <div className="mt-12">
            <h3 className="font-serif text-lg text-[var(--yif-navy-dark)]">
              Royal Father of the Day
            </h3>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {royal.map((d) => (
                <DignitaryCard key={d.name} d={d} />
              ))}
            </div>
          </div>

          {/* Ministers */}
          <div className="mt-12">
            <h3 className="font-serif text-lg text-[var(--yif-navy-dark)]">
              Federal Ministers & Reform Drivers
            </h3>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {ministers.map((d) => (
                <DignitaryCard key={d.name} d={d} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTORS ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <div className="text-xs tracking-wider text-[var(--yif-gold)] uppercase">
            Sectors of Focus
          </div>
          <h2 className="mt-3 font-serif text-4xl text-[var(--yif-navy-dark)]">
            Where the Capital Will Flow.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {YWD_SECTORS.map((s) => (
            <div
              key={s.name}
              className="group rounded-2xl border-2 border-[var(--yif-gold)]/20 bg-white p-6 transition hover:border-[var(--yif-gold)] hover:shadow-md"
            >
              <div className="font-serif text-2xl text-[var(--yif-gold)]">
                ◆
              </div>
              <h3 className="mt-3 font-semibold text-[var(--yif-navy-dark)]">
                {s.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* ── SPONSORSHIP ──────────────────────────────────────────────── */}
      <section className="bg-[var(--yif-cream-dark)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <div className="text-xs tracking-wider text-[var(--yif-gold)] uppercase">
              Sponsorship Opportunities
            </div>
            <h2 className="mt-3 font-serif text-4xl text-[var(--yif-navy-dark)]">
              Align Your Brand with the Renewed Hope Agenda.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {YWD_SPONSORSHIP_TIERS.map((t) => (
              <div
                key={t.name}
                className={`relative flex flex-col rounded-3xl p-6 ring-1 transition ${
                  t.highlight
                    ? "bg-[var(--yif-navy-dark)] text-white ring-[var(--yif-gold)] shadow-2xl scale-[1.02]"
                    : "bg-white text-[var(--yif-charcoal)] ring-black/5 shadow-sm"
                }`}
              >
                {t.highlight && (
                  <span className="absolute -top-3 left-6 rounded-full bg-[var(--yif-gold)] px-3 py-1 text-[10px] font-bold tracking-wider text-[var(--yif-navy-dark)] uppercase">
                    Most Visible
                  </span>
                )}
                <h3
                  className={`font-serif text-xl ${
                    t.highlight
                      ? "text-[var(--yif-gold)]"
                      : "text-[var(--yif-navy-dark)]"
                  }`}
                >
                  {t.name}
                </h3>
                <div className="mt-3">
                  <div className="font-serif text-3xl font-bold">
                    ${t.amountUsd.toLocaleString("en-US")}
                  </div>
                  <div
                    className={`text-xs ${
                      t.highlight
                        ? "text-white/60"
                        : "text-[var(--yif-charcoal)]/60"
                    }`}
                  >
                    {formatCurrency(t.amountNgn, "NGN")} approx.
                  </div>
                </div>
                <ul
                  className={`mt-5 flex-1 space-y-2 text-sm ${
                    t.highlight ? "text-white/90" : "text-[var(--yif-charcoal)]"
                  }`}
                >
                  {t.benefits.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[var(--yif-gold)]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/events/yoruba-world-day-2026/sponsor"
                  className={`mt-6 rounded-full px-5 py-2.5 text-center text-xs font-bold uppercase tracking-wider transition ${
                    t.highlight
                      ? "bg-[var(--yif-gold)] text-[var(--yif-navy-dark)] hover:bg-[var(--yif-gold-light)]"
                      : "bg-[var(--yif-navy-dark)] text-white hover:bg-[var(--yif-navy)]"
                  }`}
                >
                  Sponsor at this Tier
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOSTS / NY TEAM ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="text-xs tracking-wider text-[var(--yif-gold)] uppercase">
              Convened By
            </div>
            <h2 className="mt-3 font-serif text-3xl text-[var(--yif-navy-dark)]">
              YIF Worldwide Leadership
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
              {YWD_HOSTS.map((h) => (
                <DignitaryCard key={h.name} d={h} />
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs tracking-wider text-[var(--yif-gold)] uppercase">
              New York Local Team
            </div>
            <h2 className="mt-3 font-serif text-3xl text-[var(--yif-navy-dark)]">
              On the Ground in NYC
            </h2>
            <ul className="mt-6 space-y-3">
              {YWD_NY_TEAM.map((n) => (
                <li
                  key={n}
                  className="flex items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-black/5"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-[var(--yif-gold)]/20 text-sm font-bold text-[var(--yif-navy-dark)]">
                    {initials(n)}
                  </span>
                  <span className="text-sm font-medium text-[var(--yif-navy-dark)]">
                    {n}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── HOTELS ───────────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <div className="text-xs tracking-wider text-[var(--yif-gold)] uppercase">
              Recommended Hospitality
            </div>
            <h2 className="mt-3 font-serif text-4xl text-[var(--yif-navy-dark)]">
              Where Our Delegations Stay.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {YWD_HOTELS.map((h) => (
              <div
                key={h.name}
                className="group overflow-hidden rounded-2xl bg-[var(--yif-cream-dark)] ring-1 ring-black/5"
              >
                <div className="relative aspect-[4/3] w-full bg-[var(--yif-navy-dark)]">
                  <Image
                    src={h.image}
                    alt={h.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-[var(--yif-navy-dark)]">
                    {h.name}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--yif-charcoal)]/70">
                    {h.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACTS / FINAL CTA ─────────────────────────────────────── */}
      <section className="bg-[var(--yif-navy-dark)] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="text-xs tracking-wider text-[var(--yif-gold)] uppercase">
                Contact
              </div>
              <h2 className="mt-3 font-serif text-4xl">
                Let&rsquo;s build the Renewed Hope together.
              </h2>
              <p className="mt-4 text-white/70">
                Sponsorship, exhibitor, media, and protocol enquiries are
                welcomed via the contacts below. {YWD_EVENT.status} ·{" "}
                {YWD_EVENT.registration}.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/events/yoruba-world-day-2026/tickets"
                  className="rounded-full bg-[var(--yif-gold)] px-6 py-3 text-sm font-bold text-[var(--yif-navy-dark)] uppercase tracking-wider transition hover:bg-[var(--yif-gold-light)]"
                >
                  Buy Delegate Pass
                </Link>
                <Link
                  href="/events/yoruba-world-day-2026/sponsor"
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white uppercase tracking-wider transition hover:bg-white/10"
                >
                  Sponsor
                </Link>
                <Link
                  href="/events/yoruba-world-day-2026/exhibit"
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white uppercase tracking-wider transition hover:bg-white/10"
                >
                  Exhibit
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              {YWD_CONTACTS.map((c) => (
                <div
                  key={c.email}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="font-serif text-lg text-[var(--yif-gold)]">
                    {c.name}
                  </div>
                  <div className="text-sm text-white/70">{c.role}</div>
                  <div className="mt-3 space-y-1 text-sm">
                    <div>
                      <span className="text-white/50">Email · </span>
                      <a
                        href={`mailto:${c.email}`}
                        className="text-white hover:text-[var(--yif-gold-light)]"
                      >
                        {c.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-white/50">Phone · </span>
                      <a
                        href={`tel:${c.phone.replace(/\s+/g, "")}`}
                        className="text-white hover:text-[var(--yif-gold-light)]"
                      >
                        {c.phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
