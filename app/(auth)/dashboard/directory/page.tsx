import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Member Directory | YIF Member Portal",
};

const MEMBERS = [
  {
    id: "m001",
    name: "Adewale Okafor",
    role: "Board Member",
    tier: "Diamond",
    location: "Lagos, Nigeria",
    profession: "Civil Engineer",
    since: "2018",
    initials: "AO",
    color: "#9b59b6",
  },
  {
    id: "m002",
    name: "Folake Adesanya",
    role: "Member",
    tier: "Gold",
    location: "Abuja, Nigeria",
    profession: "Medical Doctor",
    since: "2019",
    initials: "FA",
    color: "var(--yif-gold)",
  },
  {
    id: "m003",
    name: "Babatunde Lawson",
    role: "Programme Officer",
    tier: "Platinum",
    location: "London, UK",
    profession: "Investment Banker",
    since: "2017",
    initials: "BL",
    color: "#5dade2",
  },
  {
    id: "m004",
    name: "Yetunde Fashola",
    role: "Member",
    tier: "Silver",
    location: "Houston, TX",
    profession: "Software Engineer",
    since: "2021",
    initials: "YF",
    color: "#7f8c8d",
  },
  {
    id: "m005",
    name: "Chukwuemeka Obi",
    role: "Trustee",
    tier: "Diamond",
    location: "Lagos, Nigeria",
    profession: "Entrepreneur",
    since: "2016",
    initials: "CO",
    color: "#9b59b6",
  },
  {
    id: "m006",
    name: "Sade Balogun",
    role: "Member",
    tier: "Gold",
    location: "Ibadan, Nigeria",
    profession: "Professor of History",
    since: "2020",
    initials: "SB",
    color: "var(--yif-gold)",
  },
  {
    id: "m007",
    name: "Omotayo Adeleke",
    role: "Member",
    tier: "Gold",
    location: "Toronto, Canada",
    profession: "Architect",
    since: "2022",
    initials: "OA",
    color: "var(--yif-gold)",
  },
  {
    id: "m008",
    name: "Gbemisola Ige",
    role: "Youth Representative",
    tier: "Yoruba Community",
    location: "Lagos, Nigeria",
    profession: "Journalist",
    since: "2023",
    initials: "GI",
    color: "var(--yif-green)",
  },
  {
    id: "m009",
    name: "Kayode Akinola",
    role: "Member",
    tier: "Platinum",
    location: "Dubai, UAE",
    profession: "Oil & Gas Executive",
    since: "2019",
    initials: "KA",
    color: "#5dade2",
  },
  {
    id: "m010",
    name: "Nneka Uzodimma",
    role: "Member",
    tier: "Silver",
    location: "Enugu, Nigeria",
    profession: "Barrister-at-Law",
    since: "2021",
    initials: "NU",
    color: "#7f8c8d",
  },
  {
    id: "m011",
    name: "Tunde Osiberu",
    role: "Board Member",
    tier: "Diamond",
    location: "Washington D.C., USA",
    profession: "UN Diplomat",
    since: "2015",
    initials: "TO",
    color: "#9b59b6",
  },
  {
    id: "m012",
    name: "Amina Suleiman",
    role: "Member",
    tier: "Gold",
    location: "Kano, Nigeria",
    profession: "Business Consultant",
    since: "2022",
    initials: "AS",
    color: "var(--yif-gold)",
  },
];

const TIER_FILTER = [
  "All",
  "Diamond",
  "Platinum",
  "Gold",
  "Silver",
  "Yoruba Community",
];

const TIER_BADGE: Record<string, string> = {
  Diamond: "bg-[#9b59b6]/20 text-[#c39bd3] border-[#9b59b6]/30",
  Platinum: "bg-[#5dade2]/20 text-[#85c1e9] border-[#5dade2]/30",
  Gold: "bg-[var(--yif-gold)]/15 text-[var(--yif-gold)] border-[var(--yif-gold)]/30",
  Silver: "bg-white/10 text-white/60 border-white/20",
  "Yoruba Community":
    "bg-[var(--yif-green)]/20 text-[var(--yif-green)] border-[var(--yif-green)]/30",
};

export default function DirectoryPage() {
  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-1">
          Member Portal
        </p>
        <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          Member Directory
        </h1>
        <p className="mt-1 text-white/50 text-sm">
          Connect with fellow members of the Yoruba Indigenes&apos; Foundation
          community.
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          placeholder="Search members by name, profession, or location…"
          className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-[var(--yif-gold)]/50 transition-colors"
          readOnly
        />
        <div className="flex gap-2 flex-wrap">
          {TIER_FILTER.map((tier) => (
            <button
              key={tier}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                tier === "All"
                  ? "bg-[var(--yif-gold)] text-[var(--yif-navy-dark)] border-[var(--yif-gold)]"
                  : "bg-white/5 text-white/50 border-white/10 hover:border-white/30"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-white/30 mb-4">
        Showing {MEMBERS.length} members
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MEMBERS.map((m) => (
          <div
            key={m.id}
            className="group rounded-xl bg-white/5 border border-white/10 px-5 py-5 hover:bg-white/8 hover:border-white/20 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3 mb-3">
              {/* Avatar */}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                style={{
                  backgroundColor: `color-mix(in srgb, ${m.color} 25%, transparent)`,
                  border: `1.5px solid color-mix(in srgb, ${m.color} 40%, transparent)`,
                }}
              >
                <span style={{ color: m.color }}>{m.initials}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white leading-snug truncate">
                  {m.name}
                </p>
                <p className="text-xs text-white/40 mt-0.5">{m.role}</p>
              </div>
            </div>

            <div className="space-y-1 mb-3">
              <p className="text-xs text-white/50">{m.profession}</p>
              <p className="text-xs text-white/30">{m.location}</p>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`rounded-full border text-xs px-2.5 py-0.5 font-medium ${TIER_BADGE[m.tier] ?? ""}`}
              >
                {m.tier}
              </span>
              <span className="text-xs text-white/25">Since {m.since}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-white/20">
        Member directory is visible to verified YIF members only. Contact{" "}
        <a
          href="mailto:membership@yif.ng"
          className="text-[var(--yif-gold)]/60 hover:text-[var(--yif-gold)]"
        >
          membership@yif.ng
        </a>{" "}
        to update your listing.
      </p>
    </div>
  );
}
