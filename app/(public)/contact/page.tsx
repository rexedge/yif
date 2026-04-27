import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Yoruba Indigenes' Foundation",
  description:
    "Get in touch with YIF. Reach our Lagos headquarters, UK regional office, or global diaspora representatives. We'd love to hear from you.",
  openGraph: {
    title: "Contact Us | Yoruba Indigenes' Foundation",
    description:
      "Reach our Lagos headquarters, UK regional office, or global diaspora representatives.",
    type: "website",
  },
};

/* ── Data ─────────────────────────────────────────── */

const phones = ["+234 816 919 9745", "+1 (917) 703-0107", "+234 802 288 9403"];

const emails = ["info@yifworldwide.org", "yorubaindigenesngo@gmail.com"];

const ukTeam = [
  {
    name: "Princess M. Adewunmi King (Labamba)",
    role: "National Co-ordinator (UK)",
    email: "labamba2002@aol.com",
  },
  {
    name: "Hon. Adeoye Ayinde Obanleowo",
    role: "Director of Communications & PR",
    email: "adeoyeobanleowo196750@outlook.com",
  },
];

const diasporaReps = [
  {
    name: "Mr Ayobami Prosper Micheal",
    location: "Mali",
    phone: "+22351498661",
  },
  {
    name: "Dr. Gbenga Adeyeye",
    location: "South Africa",
    phone: "+27747422831",
  },
  {
    name: "Princess Bolajoko Oyeronke",
    location: "South West, Nigeria",
    phone: "+2348038043484",
  },
  {
    name: "Mr. Bamidele Akindola",
    location: "Brazil",
    phone: "+5511999552841",
  },
  {
    name: "Prince Akintunde Awoyera",
    location: "China",
    phone: "+8613711503141",
  },
  {
    name: "Ms. Olushola Olude",
    location: "United States",
    phone: "+1-480-217-1937",
  },
  {
    name: "Princess Omolabake Margret King",
    location: "London, UK",
    phone: "+447948731711",
  },
  { name: "Alhaji Abiola Olumola", location: "Uganda", phone: "+256755708622" },
  {
    name: "Princess Ogundowole Oluwaseyi",
    location: "France",
    phone: "+33615597525",
  },
];

/* ── Page ─────────────────────────────────────────── */

export default function ContactPage() {
  return (
    <>
      {/* ─── Hero ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[var(--yif-navy)] py-20 sm:py-28">
        <div className="pattern-adinkra absolute inset-0 opacity-[0.06]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-xs text-white/50"
          >
            <Link href="/" className="hover:text-white/80 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white/80">Contact</span>
          </nav>

          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--yif-gold)]">
              Reach Us
            </p>
            <h1 className="font-display text-5xl font-semibold text-white sm:text-6xl">
              Get In Touch
            </h1>
            <div className="mt-4 h-1 w-20 rounded bg-[var(--yif-gold)]" />
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              Whether you&apos;re looking to join our mission, partner with us,
              or simply learn more — our team is here to help. Reach us at our
              Lagos headquarters or through any of our global representatives.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Contact Info + Form ───────────────────── */}
      <section className="bg-[var(--yif-cream)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-0 lg:grid-cols-5 lg:overflow-hidden lg:rounded-2xl lg:shadow-2xl">
            {/* Info panel — navy */}
            <div className="flex flex-col gap-8 bg-[var(--yif-navy)] px-8 py-12 lg:col-span-2">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--yif-gold)]">
                  Headquarters
                </p>
                <h2 className="font-display text-2xl font-semibold text-white">
                  Lagos, Nigeria
                </h2>
              </div>

              {/* Address */}
              <div className="flex gap-4">
                <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--yif-gold)]/20">
                  <svg
                    className="h-4 w-4 text-[var(--yif-gold)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50 mb-1">
                    Address
                  </p>
                  <p className="text-sm text-white/80 leading-relaxed">
                    33A Bode Thomas Street
                    <br />
                    Surulere, Lagos State
                    <br />
                    Nigeria
                  </p>
                </div>
              </div>

              {/* Phones */}
              <div className="flex gap-4">
                <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--yif-gold)]/20">
                  <svg
                    className="h-4 w-4 text-[var(--yif-gold)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50 mb-1">
                    Phone
                  </p>
                  <ul className="space-y-1">
                    {phones.map((p) => (
                      <li key={p}>
                        <a
                          href={`tel:${p.replace(/[^+\d]/g, "")}`}
                          className="text-sm text-white/80 hover:text-[var(--yif-gold)] transition-colors"
                        >
                          {p}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Emails */}
              <div className="flex gap-4">
                <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--yif-gold)]/20">
                  <svg
                    className="h-4 w-4 text-[var(--yif-gold)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50 mb-1">
                    Email
                  </p>
                  <ul className="space-y-1">
                    {emails.map((e) => (
                      <li key={e}>
                        <a
                          href={`mailto:${e}`}
                          className="text-sm text-white/80 hover:text-[var(--yif-gold)] transition-colors break-all"
                        >
                          {e}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-auto pt-4 border-t border-white/10">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50 mb-3">
                  Quick Connect
                </p>
                <a
                  href="https://wa.me/2348169199745"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-xl bg-[#25D366] px-6 py-3.5 text-white font-semibold text-sm hover:bg-[#1ebe59] transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Form panel — white */}
            <div className="bg-white px-8 py-12 lg:col-span-3">
              <div className="mb-8">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--yif-gold)]">
                  Send a Message
                </p>
                <h2 className="font-display text-3xl font-semibold text-[var(--yif-navy)]">
                  How Can We Help?
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Fill in the form below and a member of our team will respond
                  within 2–3 business days.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Google Maps ──────────────────────────── */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--yif-gold)]">
              Find Us
            </p>
            <h2 className="font-display text-3xl font-semibold text-[var(--yif-navy)] sm:text-4xl">
              Our Location
            </h2>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-xl border border-[var(--yif-cream-dark)]">
            <iframe
              title="YIF Headquarters — 33A Bode Thomas Street, Surulere, Lagos"
              src="https://www.google.com/maps?q=33A+Bode+Thomas+Street,+Surulere,+Lagos+State,+Nigeria&output=embed&z=15"
              width="100%"
              height="420"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block border-0"
            />
          </div>
          <p className="mt-4 text-center text-sm text-[var(--muted)]">
            33A Bode Thomas Street, Surulere, Lagos State, Nigeria
          </p>
        </div>
      </section>

      {/* ─── UK Regional Office ───────────────────── */}
      <section className="bg-[var(--yif-navy)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--yif-gold)]">
              Regional Office
            </p>
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
              United Kingdom
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:max-w-3xl">
            {ukTeam.map((member) => (
              <div
                key={member.email}
                className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors"
              >
                <div className="mb-3 h-10 w-10 rounded-full bg-[var(--yif-gold)]/20 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-[var(--yif-gold)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-white text-base mb-1">
                  {member.name}
                </h3>
                <p className="text-xs uppercase tracking-[0.15em] text-[var(--yif-gold)] mb-3 font-semibold">
                  {member.role}
                </p>
                <a
                  href={`mailto:${member.email}`}
                  className="text-sm text-white/60 hover:text-[var(--yif-gold)] transition-colors break-all"
                >
                  {member.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Diaspora Directory ────────────────────── */}
      <section className="bg-[var(--yif-cream)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--yif-gold)]">
              Global Reach
            </p>
            <h2 className="font-display text-4xl font-semibold text-[var(--yif-navy)] sm:text-5xl">
              Diaspora Representatives
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-base text-[var(--muted)]">
              YIF maintains an active global network of representatives serving
              Yoruba communities around the world.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {diasporaReps.map((rep) => (
              <div
                key={rep.phone}
                className="group rounded-xl border border-[var(--yif-cream-dark)] bg-white p-6 hover:border-[var(--yif-gold)]/40 hover:shadow-md transition-all"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--yif-navy)]/10 flex-shrink-0">
                    <svg
                      className="h-4 w-4 text-[var(--yif-navy)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--yif-gold)]">
                    {rep.location}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-[var(--yif-navy)] leading-snug mb-2">
                  {rep.name}
                </h3>
                <a
                  href={`tel:${rep.phone.replace(/[^+\d]/g, "")}`}
                  className="text-sm text-[var(--muted)] hover:text-[var(--yif-terracotta)] transition-colors"
                >
                  {rep.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
