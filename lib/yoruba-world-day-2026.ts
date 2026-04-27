// lib/yoruba-world-day-2026.ts — single source of truth for the YWD2026 microsite

import { USD_TO_NGN, usdToNgn } from "./currency";

export const YWD_SLUG = "yoruba-world-day-2026";
export const YWD_IMAGE_DIR = "/image/yorubaworldday2026";

export const YWD_EVENT = {
  slug: YWD_SLUG,
  title: "Yoruba World Day 2026",
  shortTitle: "Yoruba World Day 2026",
  subtitle: "Branding Nigeria & Investment Portfolios",
  theme: "Rebranding Nigeria Under the Renewed Hope Agenda",
  startDate: "2026-08-14",
  endDate: "2026-08-15",
  dateLabel: "August 14–15, 2026",
  city: "New York, USA",
  venue: "Rochdale Community Center",
  address: "169-65 137th Ave, New York, NY 11434, United States",
  status: "UN/ECOSOC consultative status",
  registration: "CAC IT 28744",
  preparedFor: "President Bola Ahmed Tinubu GCFR",
  ticketPriceUsd: 200,
  get ticketPriceNgn(): number {
    return usdToNgn(this.ticketPriceUsd);
  },
  fxRate: USD_TO_NGN,
};

// ── Executive summary bullets ────────────────────────────────────────────────
export const YWD_EXECUTIVE_SUMMARY = [
  "Global diaspora-driven initiative",
  "Strategic platform for investment attraction",
  "Showcases Nigeria's economic reforms",
  "Promotes Yoruba cultural diplomacy",
  "Supports the Renewed Hope Agenda",
];

// ── Strategic objectives ─────────────────────────────────────────────────────
export const YWD_OBJECTIVES = [
  "Rebrand Nigeria globally",
  "Attract foreign direct investment (FDI)",
  "Strengthen diaspora engagement",
  "Promote economic reforms",
  "Build a youth development legacy (OSANLES)",
];

// ── Two-day agenda ───────────────────────────────────────────────────────────
export type AgendaDay = {
  day: 1 | 2;
  date: string;
  title: string;
  focus: string;
  items: string[];
};

export const YWD_AGENDA: AgendaDay[] = [
  {
    day: 1,
    date: "August 14, 2026",
    title: "Investment & Governance",
    focus: "Reform, capital, and the Renewed Hope investment thesis.",
    items: [
      "Presidential Address — H.E. President Bola Ahmed Tinubu GCFR",
      "Keynote — H.E. Nana Akufo-Addo, former President of Ghana",
      "Diaspora Investment Summit",
      "High-level Policy Panel — Infrastructure, Security & Fiscal Reforms (Umahi · Musa · Oyedele)",
      "Investment Pitch Session led by NIPC + private sector leaders",
      "Exhibition Pavilion & B2B Deal Rooms",
    ],
  },
  {
    day: 2,
    date: "August 15, 2026",
    title: "Culture, Diaspora & Entertainment",
    focus: "Yoruba excellence, OSANLES youth program, and diaspora homecoming.",
    items: [
      "Cultural Showcase — Royal Father of the Day: HIM the Ooni of Ife",
      'OSANLES "Go Back to School" Initiative — youth rehabilitation & reintegration',
      "Diaspora Forum — pathways for diaspora investment",
      "Yoruba Excellence Awards & Recognition",
      "Gala Night, Dinner & Live Performances",
      "Closing Charge & Renewed Hope Communiqué",
    ],
  },
];

// ── Dignitaries ──────────────────────────────────────────────────────────────
export type Dignitary = {
  name: string;
  role: string;
  image: string;
  group: "vvip" | "keynote" | "royal" | "minister" | "host";
  status?: "Confirmed" | "Invited";
};

const img = (file: string) => `${YWD_IMAGE_DIR}/${file}`;

export const YWD_DIGNITARIES: Dignitary[] = [
  // VVIPs
  {
    name: "H.E. President Bola Ahmed Tinubu GCFR",
    role: "President & Commander-in-Chief, Federal Republic of Nigeria",
    image: img("tinubu.jpg"),
    group: "vvip",
    status: "Confirmed",
  },
  {
    name: "H.E. Sen. Oluremi Tinubu CFR",
    role: "First Lady, Federal Republic of Nigeria",
    image: img("oluremi-tinubu.jpg"),
    group: "vvip",
    status: "Confirmed",
  },
  {
    name: "H.E. Babajide Olusola Sanwo-Olu",
    role: "Governor of Lagos State",
    image: img("sanwo-olu.jpg"),
    group: "vvip",
    status: "Confirmed",
  },
  // Royal
  {
    name: "HIM Oba Adeyeye Enitan Ogunwusi",
    role: "The Ooni of Ife · Royal Father of the Day",
    image: img("ooni.jpg"),
    group: "royal",
    status: "Confirmed",
  },
  // Keynote
  {
    name: "H.E. Nana Akufo-Addo",
    role: "Keynote Speaker · Former President of Ghana",
    image: img("akufo-addo.webp"),
    group: "keynote",
    status: "Confirmed",
  },
  // Ministers — Reform Drivers
  {
    name: "Mr. Wale Edun",
    role: "Honourable Minister of Finance",
    image: img("wale-edun.jpg"),
    group: "minister",
    status: "Confirmed",
  },
  {
    name: "Mr. Yemi Cardoso",
    role: "Governor, Central Bank of Nigeria",
    image: img("yemi-cardoso.jpg"),
    group: "minister",
    status: "Confirmed",
  },
  {
    name: "Sen. David Umahi",
    role: "Honourable Minister of Works",
    image: img("david-umahi.webp"),
    group: "minister",
    status: "Confirmed",
  },
  {
    name: "Maj. Gen. (Rtd.) Christopher Musa",
    role: "Honourable Minister of Defence",
    image: img("christopher-musa.jpg"),
    group: "minister",
    status: "Confirmed",
  },
  {
    name: "Mr. Taiwo Oyedele",
    role: "Honourable Minister of State for Finance",
    image: img("taiwo-oyedele.webp"),
    group: "minister",
    status: "Confirmed",
  },
  {
    name: "Dr. Jumoke Oduwole",
    role: "Honourable Minister of Trade & Investment",
    image: img("jumoke-oduwole.webp"),
    group: "minister",
    status: "Confirmed",
  },
  {
    name: "Dr. Bosun Tijani",
    role: "Honourable Minister of Communications, Innovation & Digital Economy",
    image: img("bosun-tijani.jpg"),
    group: "minister",
    status: "Confirmed",
  },
  {
    name: "Prof. Adegboyega Oyetola",
    role: "Honourable Minister of Marine & Blue Economy",
    image: img("adegboyega-oyetola.jpg"),
    group: "minister",
    status: "Confirmed",
  },
];

// ── Hosts (YIF leadership shown in microsite) ────────────────────────────────
export const YWD_HOSTS: Dignitary[] = [
  {
    name: "Dr. Olumide Aderibole Philips",
    role: "President — Yoruba Indigenes' Foundation Worldwide",
    image: img("olumide-philips.jpg"),
    group: "host",
  },
  {
    name: "Hon. Oluwasanmi Olamide",
    role: "Project Coordinator — Yoruba World Day 2026",
    image: img("oluwasanmi-olamide.jpg"),
    group: "host",
  },
  {
    name: "Mr. Tayo Akinmade Ayinde",
    role: "Renewed Hope Agenda Ambassador / Patron",
    image: img("tayo-ayinde.jpg"),
    group: "host",
  },
  {
    name: "Chief Abiodun Fajobi",
    role: "Chairman — Yoruba Indigenes' Foundation Worldwide",
    image: img("abiodun-fajobi.jpg"),
    group: "host",
  },
];

export const YWD_NY_TEAM = [
  "Mr. Tunde Okoya",
  "Mrs. Shade Afolabi",
  "Mrs. Foluke Oladipo",
  "Mrs. Lola Raji",
];

// ── Sectors ──────────────────────────────────────────────────────────────────
export const YWD_SECTORS = [
  { name: "Oil & Gas", icon: "flame" },
  { name: "Real Estate & Infrastructure", icon: "building" },
  { name: "Agriculture & Food Security", icon: "wheat" },
  { name: "Renewable Energy", icon: "sun" },
  { name: "ICT & Fintech", icon: "cpu" },
  { name: "Marine & Blue Economy", icon: "anchor" },
  { name: "Aviation & Aerospace", icon: "plane" },
] as const;

// ── Sponsorship tiers ────────────────────────────────────────────────────────
export type SponsorshipTier = {
  name: string;
  amountUsd: number;
  amountNgn: number;
  highlight?: boolean;
  benefits: string[];
};

const tier = (
  name: string,
  usd: number,
  benefits: string[],
  highlight = false,
): SponsorshipTier => ({
  name,
  amountUsd: usd,
  amountNgn: usdToNgn(usd),
  highlight,
  benefits,
});

export const YWD_SPONSORSHIP_TIERS: SponsorshipTier[] = [
  tier(
    "Headline Sponsor",
    500_000,
    [
      'Naming rights — "Event powered by"',
      "Direct access to Presidency & VIPs",
      "Speaking slot at main session",
      "Global media branding & co-branded press releases",
      "Exclusive premium hospitality suite",
    ],
    true,
  ),
  tier("Platinum Sponsor", 250_000, [
    "Stage branding",
    "VVIP gala table for 10",
    "Featured media coverage",
    "Co-branded panel session",
  ]),
  tier("Gold Sponsor", 100_000, [
    "Exhibition booth",
    "Logo placement across event collateral",
    "10 delegate passes",
    "Mention in opening ceremony",
  ]),
  tier("Silver Sponsor", 50_000, [
    "Branding on event materials",
    "Social media visibility",
    "5 delegate passes",
    "Logo on attendee badges",
  ]),
];

// ── Hotels ───────────────────────────────────────────────────────────────────
export const YWD_HOTELS = [
  {
    name: "The Langham, New York Fifth Avenue",
    note: "Premium luxury for Presidential / VVIP guests",
    image: img("hotel-langham.jpg"),
  },
  {
    name: "The Peninsula New York",
    note: "Diplomatic-grade security and executive suites",
    image: img("hotel-peninsula.jpg"),
  },
  {
    name: "New York Marriott Marquis",
    note: "Ideal for large delegations and media",
    image: img("hotel-marriott-marquis.jpg"),
  },
  {
    name: "Hilton Midtown Manhattan",
    note: "Conference-friendly and centrally located",
    image: img("hotel-hilton-midtown.webp"),
  },
  {
    name: "TWA Hotel JFK Airport",
    note: "Closest to venue — strategic for logistics",
    image: img("hotel-twa-jfk.jpg"),
  },
];

// ── KPIs & impact ────────────────────────────────────────────────────────────
export const YWD_KPIS = [
  { label: "Expected Attendance", value: "1,500–3,000" },
  { label: "Investment Pipeline", value: "$500M+" },
  { label: "Global Media Reach", value: "10M–50M" },
  { label: "Countries Represented", value: "25+" },
  { label: "Strategic Partnerships", value: "20+" },
];

// ── Contacts ─────────────────────────────────────────────────────────────────
export const YWD_CONTACTS = [
  {
    name: "Dr. Olumide Aderibole Philips",
    role: "President — YIF Worldwide",
    phone: "+234 816 919 9745",
    email: "olumideyif@yahoo.com",
  },
  {
    name: "Hon. Oluwasanmi Olamide",
    role: "Project Coordinator — Yoruba World Day 2026",
    phone: "+234 803 704 1520",
    email: "olamideoluwasanmi@gmail.com",
  },
];

// Where sponsorship and exhibitor inquiries are emailed
export const YWD_INQUIRY_RECIPIENTS = [
  "olumideyif@yahoo.com",
  "olamideoluwasanmi@gmail.com",
  "sponsorship@yifww.org",
] as const;
