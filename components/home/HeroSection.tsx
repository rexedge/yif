import Link from "next/link";
import { TrustBadge } from "@/components/layout/TrustBadge";
import { AnkaraBorder } from "@/components/shared/AnkaraBorder";

const SPOKES = [0, 45, 90, 135, 180, 225, 270, 315];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[var(--yif-navy)]">
      {/* Adinkra pattern overlay */}
      <div aria-hidden className="absolute inset-0 pattern-adinkra" />

      {/* Decorative concentric circles — right side, hidden on mobile */}
      <div
        aria-hidden
        className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-[38%] w-[min(700px,60vw)] pointer-events-none select-none"
      >
        <svg viewBox="0 0 700 700" fill="none" className="w-full h-full">
          <circle
            cx="350"
            cy="350"
            r="340"
            stroke="#c9913d"
            strokeOpacity="0.06"
            strokeWidth="1"
          />
          <circle
            cx="350"
            cy="350"
            r="280"
            stroke="#c9913d"
            strokeOpacity="0.09"
            strokeWidth="1"
          />
          <circle
            cx="350"
            cy="350"
            r="220"
            stroke="#c9913d"
            strokeOpacity="0.08"
            strokeWidth="1"
          />
          <circle
            cx="350"
            cy="350"
            r="160"
            stroke="#c9913d"
            strokeOpacity="0.12"
            strokeWidth="1"
          />
          <circle
            cx="350"
            cy="350"
            r="100"
            stroke="#c9913d"
            strokeOpacity="0.18"
            strokeWidth="1.5"
          />
          <circle cx="350" cy="350" r="8" fill="#c9913d" fillOpacity="0.25" />
          {SPOKES.map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={350 + 42 * Math.cos(rad)}
                y1={350 + 42 * Math.sin(rad)}
                x2={350 + 340 * Math.cos(rad)}
                y2={350 + 340 * Math.sin(rad)}
                stroke="#c9913d"
                strokeOpacity="0.05"
                strokeWidth="0.5"
              />
            );
          })}
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-14 py-20 pt-40">
        <div className="max-w-3xl">
          {/* UN/ECOSOC badge */}
          <div
            className="mb-8 animate-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            <TrustBadge variant="pill" />
          </div>

          {/* Reg. eyebrow */}
          <p
            className="text-[var(--yif-gold)]/60 text-xs font-semibold uppercase tracking-[0.3em] mb-7 animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            Reg. IT 28744 &nbsp;·&nbsp; Established 2005
          </p>

          {/* Hero headline */}
          <h1
            className="font-display font-semibold text-white leading-[0.92] mb-6 animate-fade-up"
            style={{
              fontSize: "clamp(2.75rem, 8vw, 5.75rem)",
              animationDelay: "180ms",
            }}
          >
            Uniting the{" "}
            <em className="not-italic text-[var(--yif-gold)]">Global</em>
            <br />
            Yoruba In{" "}
            <span className="relative inline-block">
              Diaspora
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-[var(--yif-gold)]/60 to-transparent"
              />
            </span>
          </h1>

          {/* Yoruba tagline */}
          <p
            className="font-display italic text-lg sm:text-xl text-white/40 mb-5 animate-fade-up"
            style={{ animationDelay: "260ms" }}
          >
            Fun Isokan, Idagbasoke ati Ilosiwaju Omo Yoruba Lapapo
          </p>

          {/* Mission blurb */}
          <p
            className="text-white/60 text-base sm:text-lg leading-relaxed max-w-xl mb-12 animate-fade-up"
            style={{ animationDelay: "340ms" }}
          >
            A UN/ECOSOC Special Consultative Status NGO championing unity,
            economic empowerment, and cultural preservation for Yoruba people
            across every continent.
          </p>

          {/* CTA buttons */}
          <div
            className="flex flex-wrap items-center gap-3 sm:gap-4 animate-fade-up"
            style={{ animationDelay: "420ms" }}
          >
            <Link
              href="/membership"
              className="inline-flex items-center rounded-full bg-[var(--yif-gold)] px-7 sm:px-9 py-3.5 sm:py-4 text-[var(--yif-navy)] text-sm font-semibold uppercase tracking-widest hover:bg-[var(--yif-gold-light)] transition-colors duration-200"
            >
              Become a Member
            </Link>
            <Link
              href="/donate"
              className="inline-flex items-center rounded-full border border-white/20 px-7 sm:px-9 py-3.5 sm:py-4 text-white/80 text-sm font-semibold uppercase tracking-widest hover:border-white/50 hover:text-white transition-colors duration-200"
            >
              Donate
            </Link>
            <Link
              href="/programs"
              className="group inline-flex items-center gap-2 px-4 py-4 text-[var(--yif-gold)]/65 text-sm font-semibold uppercase tracking-widest hover:text-[var(--yif-gold)] transition-colors duration-200"
            >
              Explore Programs
              <svg
                width="14"
                height="10"
                viewBox="0 0 14 10"
                fill="none"
                aria-hidden
                className="group-hover:translate-x-1 transition-transform duration-200"
              >
                <path
                  d="M1 5h12M8 1l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25 animate-fade-up"
        style={{ animationDelay: "600ms" }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-7 bg-gradient-to-b from-white/25 to-transparent" />
      </div>

      {/* Ankara textile seam — decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <AnkaraBorder variant="bottom" heightClass="h-14 sm:h-18 md:h-22" />
      </div>
    </section>
  );
}
