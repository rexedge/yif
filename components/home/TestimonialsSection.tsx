const TESTIMONIALS = [
  {
    quote:
      "YIF has transformed how we engage our Yoruba community here in South Africa. The annual awards ceremony is a highlight — it reconnects us to our roots and celebrates those who sacrifice for our people.",
    name: "Dr. Gbenga Adeyeye",
    title: "South Africa Representative",
    initials: "GA",
  },
  {
    quote:
      "The scholarship Program opened doors I never thought possible. As a young Yoruba student studying abroad, having YIF's support meant I could pursue excellence without the financial burden holding me back.",
    name: "Adaeze Okafor",
    title: "YIF Scholarship Recipient",
    initials: "AO",
  },
  {
    quote:
      "Karo-Ojire is more than an investment — it is a philosophy. We are proving that the Yoruba people can organise, build collectively, and create wealth on our own terms.",
    name: "Mr. Olumide Fashola",
    title: "Economic Empowerment Member",
    initials: "OF",
  },
] as const;

export function TestimonialsSection() {
  return (
    <section className="relative bg-[var(--yif-navy)] py-24 sm:py-32 overflow-hidden">
      {/* Pattern overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pattern-adinkra opacity-40"
      />

      {/* Large decorative quotation mark */}
      <div
        aria-hidden
        className="absolute top-0 left-0 font-display text-[18rem] leading-none text-[var(--yif-gold)]/[0.04] select-none pointer-events-none -translate-y-1/4 -translate-x-8"
      >
        &ldquo;
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[var(--yif-gold)] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            Voices From Our Community
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-white">
            What Our Members Say
          </h2>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col bg-[var(--yif-navy-light)]/40 border border-white/8 rounded-2xl p-8"
            >
              {/* Opening quote */}
              <div
                aria-hidden
                className="font-display text-5xl leading-none text-[var(--yif-gold)] mb-5 opacity-60"
              >
                &ldquo;
              </div>

              {/* Quote text */}
              <p className="font-display italic text-lg sm:text-xl text-white/80 leading-relaxed flex-1 mb-8">
                {t.quote}
              </p>

              {/* Attribution */}
              <div className="flex items-center gap-4">
                {/* Initials avatar */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--yif-gold)]/20 border border-[var(--yif-gold)]/30 flex items-center justify-center">
                  <span className="text-[var(--yif-gold)] text-xs font-semibold">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">
                    {t.name}
                  </div>
                  <div className="text-white/40 text-xs uppercase tracking-wide mt-0.5">
                    {t.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
