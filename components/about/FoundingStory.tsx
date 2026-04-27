const TIMELINE = [
  {
    year: "2005/06",
    title: "Foundation Established",
    description:
      "The Yoruba Indigenes' Foundation was founded by Late Chief Ambassador Segun Olusola and co-founders including Dr. Aderibole Olumide, Chief Mrs. Winifred Awosika, Chief Rasheed Abiodun Gbadamosi, and other distinguished Yoruba leaders united by a shared vision of global Yoruba unity.",
    highlight: true,
  },
  {
    year: "2010s",
    title: "Global Expansion",
    description:
      "YIF chapters established across the United Kingdom, United States, Brazil, China, France, Austria, Ireland, Portugal, Uganda, and more — building a truly global network of Yoruba communities.",
    highlight: false,
  },
  {
    year: "2019",
    title: "UN/ECOSOC Recognition",
    description:
      "The United Nations Economic and Social Council granted YIF Special Consultative Status, recognising the Foundation's significant contributions to culture, community development, and international Yoruba representation. Registration No. IT 28744.",
    highlight: true,
  },
  {
    year: "2024–25",
    title: "Scholarship Program",
    description:
      "Launch of the YIF Scholarship Program 2024–2025 batch — providing top-slot scholarships in premium universities at home and abroad to Yoruba indigenes based on academic merit and financial need.",
    highlight: false,
  },
];

const COFOUNDERS = [
  "Late Chief Ambassador Segun Olusola (Founding Chairman)",
  "Dr. Aderibole Olumide (Founding President/CEO)",
  "Chief Mrs. Winifred Awosika",
  "Chief Rasheed Abiodun Gbadamosi",
  "Late Dr. Lateef Adegbite",
  "Late Dr. Fredrick Fasheun",
  "Late General Adeyinka Adebayo",
  "Chief Mrs. Mobolaji Oshomo",
  "Late Ooni Okuade Sijuade Olubuse II",
];

export function FoundingStory() {
  return (
    <section className="bg-[var(--yif-cream)] py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        {/* Section header */}
        <div className="mb-16 sm:mb-20">
          <p className="text-[var(--yif-gold)] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            Our History
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-[var(--yif-navy)] leading-tight max-w-xl">
              How We Began
            </h2>
            <p className="text-[var(--yif-charcoal)]/70 text-sm sm:text-base max-w-sm leading-relaxed">
              Almost two decades of building bridges, preserving culture, and
              empowering the Yoruba people worldwide.
            </p>
          </div>
          <div className="h-0.5 w-16 bg-[var(--yif-gold)] mt-6" />
        </div>

        {/* Timeline */}
        <div className="relative mb-20 sm:mb-24">
          {/* Vertical spine */}
          <div
            aria-hidden
            className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-[var(--yif-navy)]/15"
          />

          <div className="space-y-0">
            {TIMELINE.map(({ year, title, description, highlight }, i) => (
              <div
                key={year}
                className="relative flex gap-8 sm:gap-12 pb-12 last:pb-0"
              >
                {/* Timeline node */}
                <div className="flex-none flex flex-col items-center">
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center z-10 border-2 transition-all ${
                      highlight
                        ? "bg-[var(--yif-navy)] border-[var(--yif-gold)]"
                        : "bg-white border-[var(--yif-navy)]/20"
                    }`}
                  >
                    <span
                      className={`font-display text-xs sm:text-sm font-semibold text-center leading-none ${
                        highlight
                          ? "text-[var(--yif-gold)]"
                          : "text-[var(--yif-navy)]/50"
                      }`}
                    >
                      {year.length > 6 ? (
                        <>
                          {year.slice(0, 4)}
                          <br />
                          <span className="text-[0.6rem]">{year.slice(4)}</span>
                        </>
                      ) : (
                        year
                      )}
                    </span>
                  </div>
                </div>

                {/* Content card */}
                <div
                  className={`flex-1 rounded-2xl p-6 sm:p-8 mb-2 ${
                    highlight
                      ? "bg-[var(--yif-navy)] text-white"
                      : "bg-white text-[var(--yif-charcoal)]"
                  }`}
                >
                  {highlight && (
                    <span className="inline-block bg-[var(--yif-gold)]/20 text-[var(--yif-gold)] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                      Milestone
                    </span>
                  )}
                  <h3
                    className={`font-display text-2xl sm:text-3xl font-semibold mb-3 ${
                      highlight ? "text-white" : "text-[var(--yif-navy)]"
                    }`}
                  >
                    {title}
                  </h3>
                  <p
                    className={`text-sm sm:text-base leading-relaxed ${
                      highlight
                        ? "text-white/75"
                        : "text-[var(--yif-charcoal)]/75"
                    }`}
                  >
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Co-founders section */}
        <div className="bg-[var(--yif-navy)] rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 pattern-adinkra opacity-30"
          />
          <div className="relative z-10">
            <p className="text-[var(--yif-gold)] text-xs font-semibold uppercase tracking-[0.25em] mb-3">
              Standing on the Shoulders of Giants
            </p>
            <h3 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-8">
              Our Founding Figures
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {COFOUNDERS.map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-3"
                >
                  <span
                    aria-hidden
                    className="flex-none w-1.5 h-1.5 rounded-full bg-[var(--yif-gold)]"
                  />
                  <span className="text-white/80 text-sm">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
