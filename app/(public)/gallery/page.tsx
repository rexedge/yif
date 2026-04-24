import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | YIF — Yoruba Indigenes' Foundation",
  description:
    "View photos and videos from YIF events, cultural activities, and community programmes worldwide.",
};

const PLACEHOLDER_ITEMS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  aspect:
    i % 3 === 0
      ? "aspect-[4/3]"
      : i % 5 === 0
        ? "aspect-square"
        : "aspect-[3/4]",
}));

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[var(--yif-cream)]">
      {/* Hero */}
      <section className="bg-[var(--yif-navy)] py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-3">
            Media
          </p>
          <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl mb-4">
            Gallery
          </h1>
          <p className="text-white/60">
            Moments from YIF events, cultural ceremonies, and community
            programmes across Nigeria and the diaspora.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Upload notice */}
        <div className="rounded-2xl bg-[var(--yif-gold)]/10 border border-[var(--yif-gold)]/20 px-6 py-4 mb-10 text-center">
          <p className="text-sm text-[var(--yif-navy)]/70">
            📸 Full photo gallery with upload functionality coming soon. Check
            back after our next annual awards ceremony.
          </p>
        </div>

        {/* Placeholder grid */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          {PLACEHOLDER_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`${item.aspect} w-full rounded-xl bg-gradient-to-br from-[var(--yif-navy)]/20 to-[var(--yif-gold)]/10 border border-[var(--yif-navy)]/10 overflow-hidden break-inside-avoid`}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[var(--yif-navy)]/20 text-xs">
                  YIF Photo
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[var(--yif-navy)]/30 mt-10">
          Registration No. IT 28744 · UN/ECOSOC Special Consultative Status
          (2019)
        </p>
      </div>
    </div>
  );
}
