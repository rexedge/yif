import Link from "next/link";
import { TrustBadge } from "./TrustBadge";
import { AnkaraBorder } from "@/components/shared/AnkaraBorder";

const FOOTER_LINKS = {
  organization: [
    { href: "/about", label: "About YIF" },
    { href: "/about#leadership", label: "Leadership" },
    { href: "/about#history", label: "Our History" },
    { href: "/about#diaspora", label: "Global Diaspora" },
  ],
  programs: [
    { href: "/programs", label: "All Programs" },
    { href: "/programs/scholarship", label: "Karo-Ojire Scholarship" },
    { href: "/programs/youth", label: "Youth Initiative" },
    { href: "/events", label: "Events & Conferences" },
  ],
  getInvolved: [
    { href: "/donate", label: "Donate" },
    { href: "/membership", label: "Become a Member" },
    { href: "/volunteer", label: "Volunteer" },
    { href: "/contact", label: "Contact Us" },
  ],
  media: [
    { href: "/blog", label: "News & Blog" },
    { href: "/gallery", label: "Gallery" },
    { href: "/press", label: "Press Releases" },
  ],
};

const SOCIAL_LINKS = [
  {
    href: "https://facebook.com/yifworldwide",
    label: "Facebook",
    icon: IconFacebook,
  },
  {
    href: "https://twitter.com/yifworldwide",
    label: "Twitter / X",
    icon: IconTwitter,
  },
  {
    href: "https://instagram.com/yifworldwide",
    label: "Instagram",
    icon: IconInstagram,
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--yif-navy)] text-white">
      {/* Ankara textile seam — decorative top border */}
      <AnkaraBorder variant="top" heightClass="h-14 sm:h-18 md:h-22" />

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8">
        {/* Top: logo + mission + socials */}
        <div className="mb-12 grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            <p className="font-display text-2xl font-semibold text-white">
              Yoruba Indigenes&apos; Foundation
            </p>
            <p className="mt-1 font-sans text-sm italic text-[var(--yif-gold)]/80">
              &ldquo;Fun Isokan, Idagbasoke ati Ilosiwaju Omo Yoruba
              Lapapo&rdquo;
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
              A United Nations ECOSOC accredited NGO uniting Yoruba people
              worldwide through culture, education, economic empowerment, and
              community development.
            </p>
            <div className="mt-5">
              <TrustBadge variant="pill" />
            </div>
            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/60 transition-all hover:border-[var(--yif-gold)] hover:text-[var(--yif-gold)]"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-[var(--yif-gold)]">
              Contact
            </h3>
            <address className="mt-4 not-italic space-y-2 text-sm text-white/60">
              <p>33A Bode Thomas Street</p>
              <p>Surulere, Lagos State, Nigeria</p>
              <div className="mt-3 space-y-1">
                <p>
                  <a
                    href="tel:+2348169199745"
                    className="hover:text-[var(--yif-gold)] transition-colors"
                  >
                    +234 816 919 9745
                  </a>
                </p>
                <p>
                  <a
                    href="tel:+19177030107"
                    className="hover:text-[var(--yif-gold)] transition-colors"
                  >
                    +1 (917) 703-0107
                  </a>
                </p>
                <p>
                  <a
                    href="tel:+2348022889403"
                    className="hover:text-[var(--yif-gold)] transition-colors"
                  >
                    +234 802 288 9403
                  </a>
                </p>
              </div>
              <div className="mt-3 space-y-1">
                <p>
                  <a
                    href="mailto:info@yifworldwide.org"
                    className="hover:text-[var(--yif-gold)] transition-colors"
                  >
                    info@yifworldwide.org
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:yorubaindigenesngo@gmail.com"
                    className="hover:text-[var(--yif-gold)] transition-colors"
                  >
                    yorubaindigenesngo@gmail.com
                  </a>
                </p>
              </div>
            </address>
          </div>
        </div>

        {/* Nav columns */}
        <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-10 sm:grid-cols-4">
          <FooterColumn
            title="Organization"
            links={FOOTER_LINKS.organization}
          />
          <FooterColumn title="Programs" links={FOOTER_LINKS.programs} />
          <FooterColumn title="Get Involved" links={FOOTER_LINKS.getInvolved} />
          <FooterColumn title="Media" links={FOOTER_LINKS.media} />
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>
            &copy; {year} Yoruba Indigenes&apos; Foundation. All rights
            reserved. Reg. IT 28744.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-[var(--yif-gold)] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[var(--yif-gold)] transition-colors"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-[var(--yif-gold)]">
        {title}
      </h3>
      <ul className="mt-4 space-y-2">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-sm text-white/60 hover:text-[var(--yif-gold)] transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function IconFacebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconTwitter() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
