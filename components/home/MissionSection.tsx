import Link from "next/link";

// Pre-computed spoke endpoints for the SVG emblem (server-side math)
const EMBLEM_SPOKES = [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
  const rad = (deg * Math.PI) / 180;
  return {
    x1: 100 + 46 * Math.cos(rad),
    y1: 100 + 46 * Math.sin(rad),
    x2: 100 + 86 * Math.cos(rad),
    y2: 100 + 86 * Math.sin(rad),
  };
});

export function MissionSection() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: YIF emblem block */}
          <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative w-72 sm:w-80 aspect-square rounded-3xl bg-[var(--yif-navy)] flex items-center justify-center overflow-hidden">
              {/* Subtle pattern texture */}
              <div
                aria-hidden
                className="absolute inset-0 pattern-adinkra opacity-40"
              />

              {/* Adinkra-inspired SVG mandala */}
              <svg
                viewBox="0 0 200 200"
                fill="none"
                className="absolute inset-0 w-full h-full p-8"
                aria-hidden
              >
                <circle
                  cx="100"
                  cy="100"
                  r="86"
                  stroke="#c9913d"
                  strokeOpacity="0.22"
                  strokeWidth="0.7"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  stroke="#c9913d"
                  strokeOpacity="0.28"
                  strokeWidth="0.7"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="54"
                  stroke="#c9913d"
                  strokeOpacity="0.22"
                  strokeWidth="0.7"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="36"
                  stroke="#c9913d"
                  strokeOpacity="0.18"
                  strokeWidth="0.7"
                />
                {EMBLEM_SPOKES.map((l, i) => (
                  <line
                    key={i}
                    x1={l.x1}
                    y1={l.y1}
                    x2={l.x2}
                    y2={l.y2}
                    stroke="#c9913d"
                    strokeOpacity="0.28"
                    strokeWidth="0.7"
                  />
                ))}
                <circle
                  cx="100"
                  cy="100"
                  r="5"
                  fill="#c9913d"
                  fillOpacity="0.35"
                />
              </svg>

              {/* Wordmark overlay */}
              <div className="relative z-10 text-center px-4">
                <div className="font-display text-5xl font-semibold text-[var(--yif-gold)] italic leading-none mb-2">
                  YIF
                </div>
                <div className="text-white/35 text-[10px] uppercase tracking-[0.3em]">
                  Est. 2005
                </div>
                <div className="mt-4 text-white/25 text-[10px] text-center leading-relaxed uppercase tracking-wider">
                  UN/ECOSOC
                  <br />
                  Consultative Status
                </div>
              </div>
            </div>

            {/* Floating "20+ Years" pill badge */}
            <div className="absolute -bottom-4 -right-2 sm:-right-5 bg-[var(--yif-gold)] rounded-2xl px-5 py-4 shadow-xl">
              <div className="font-display text-2xl font-semibold text-[var(--yif-navy)] leading-none">
                20+
              </div>
              <div className="text-[var(--yif-navy)]/65 text-[10px] uppercase tracking-widest mt-0.5">
                Years Active
              </div>
            </div>
          </div>

          {/* Right: mission text */}
          <div className="order-1 lg:order-2">
            <p className="text-[var(--yif-gold)] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
              Our Mission
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-[var(--yif-navy)] leading-tight mb-8">
              Advancing Unity,
              <br />
              <em className="not-italic text-[var(--yif-terracotta)]">
                Progress
              </em>{" "}
              &amp; Pride
            </h2>

            <blockquote className="border-l-4 border-[var(--yif-gold)]/60 pl-6 mb-8">
              <p className="font-display italic text-lg sm:text-xl text-[var(--yif-navy)]/80 leading-relaxed">
                &quot;Our mission is to genuinely and sincerely reach out to
                corporate entities, traditional rulers, leaders, sons and
                daughters of the Yoruba race for progress and unity.&quot;
              </p>
            </blockquote>

            <p className="text-[var(--yif-charcoal)]/65 text-base leading-relaxed mb-3">
              Since 2005, YIF has championed non-partisan cooperation among
              Yorubas at communal, local, and international levels — building
              bridges across a diaspora spanning five continents.
            </p>
            <p className="text-[var(--yif-charcoal)]/65 text-base leading-relaxed mb-10">
              Backed by UN/ECOSOC Special Consultative Status (granted 2019) and
              registered as Reg.&nbsp;IT&nbsp;28744, we are a recognised force
              for cultural preservation and collective advancement.
            </p>

            <Link
              href="/about"
              className="group inline-flex items-center gap-3 text-[var(--yif-gold)] text-sm font-semibold uppercase tracking-[0.2em] hover:gap-5 transition-all duration-200"
            >
              Learn Our Story
              <svg
                width="14"
                height="10"
                viewBox="0 0 14 10"
                fill="none"
                aria-hidden
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
    </section>
  );
}
