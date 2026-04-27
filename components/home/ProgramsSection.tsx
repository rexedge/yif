import Link from "next/link";

const PROGRAMS = [
  {
    tag: "Economic",
    tagClass: "bg-[var(--yif-gold)]/12 text-[var(--yif-gold)]",
    borderClass: "border-t-[var(--yif-gold)]",
    title: "Karo-Ojire Investments",
    description:
      "A cooperative economy initiative enabling Yoruba families to build wealth through collective ownership, self-employment, and enterprise creation.",
    href: "/programs",
    ctaClass: "text-[var(--yif-gold)]",
  },
  {
    tag: "Education",
    tagClass: "bg-[var(--yif-terracotta)]/10 text-[var(--yif-terracotta)]",
    borderClass: "border-t-[var(--yif-terracotta)]",
    title: "Scholarship Program",
    description:
      "Top-slot scholarships for exceptional Yoruba students at premium universities worldwide. Your heritage. Your future. Rewarded.",
    href: "/programs/scholarship",
    ctaClass: "text-[var(--yif-terracotta)]",
  },
  {
    tag: "Recognition",
    tagClass: "bg-[var(--yif-navy)]/8 text-[var(--yif-navy)]",
    borderClass: "border-t-[var(--yif-navy)]",
    title: "Order of Odua Awards",
    description:
      "Annual recognition of illustrious Yoruba leaders — awarded the staff of distinction for their service, sacrifice, and advancement of the Yoruba people.",
    href: "/events",
    ctaClass: "text-[var(--yif-navy)]",
  },
  {
    tag: "Youth",
    tagClass: "bg-[var(--yif-green)]/10 text-[var(--yif-green)]",
    borderClass: "border-t-[var(--yif-green)]",
    title: "Youth Development",
    description:
      "Empowering the next generation of Yoruba leaders through mentorship, skills training, and cultural engagement — at home and in the diaspora.",
    href: "/programs/youth",
    ctaClass: "text-[var(--yif-green)]",
  },
] as const;

const ArrowIcon = () => (
  <svg width="12" height="9" viewBox="0 0 12 9" fill="none" aria-hidden>
    <path
      d="M1 4.5h10M7 1l3.5 3.5L7 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function ProgramsSection() {
  return (
    <section className="bg-[var(--yif-cream)] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <p className="text-[var(--yif-gold)] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
              What We Do
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-[var(--yif-navy)] leading-tight">
              Programs &amp; Initiatives
            </h2>
          </div>
          <Link
            href="/programs"
            className="group self-start sm:self-auto inline-flex items-center gap-2 text-[var(--yif-gold)]/70 text-xs font-semibold uppercase tracking-[0.2em] hover:text-[var(--yif-gold)] transition-colors"
          >
            View All Programs
            <span className="group-hover:translate-x-1 transition-transform duration-200 inline-flex">
              <ArrowIcon />
            </span>
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROGRAMS.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className={`group flex flex-col bg-white rounded-2xl overflow-hidden border-t-4 ${p.borderClass} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="p-7 flex flex-col h-full">
                {/* Tag */}
                <span
                  className={`self-start text-[10px] font-semibold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full mb-6 ${p.tagClass}`}
                >
                  {p.tag}
                </span>

                {/* Title */}
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-[var(--yif-navy)] leading-snug mb-3">
                  {p.title}
                </h3>

                {/* Description */}
                <p className="text-[var(--yif-charcoal)]/60 text-sm leading-relaxed flex-1 mb-6">
                  {p.description}
                </p>

                {/* CTA */}
                <div
                  className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${p.ctaClass} group-hover:gap-4 transition-all duration-200`}
                >
                  Learn More
                  <ArrowIcon />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
