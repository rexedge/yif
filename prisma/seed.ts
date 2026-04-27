import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

// Convert an array of paragraph strings to TipTap JSON doc format
function bodyToTipTap(paragraphs: string[]): object {
  return {
    type: "doc",
    content: paragraphs.map((text) => ({
      type: "paragraph",
      content: [{ type: "text", text }],
    })),
  };
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME;

  if (!email || !password || !name) {
    throw new Error(
      "Missing SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, or SEED_ADMIN_NAME in .env.local",
    );
  }

  const hashedPassword = await hashPassword(password);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.account.updateMany({
      where: { userId: existing.id, providerId: "credential" },
      data: { password: hashedPassword },
    });
    console.log(`✓ Admin password re-hashed for: ${email}`);
    return;
  }

  const now = new Date();
  const userId = crypto.randomUUID();

  await prisma.user.create({
    data: {
      id: userId,
      name,
      email,
      emailVerified: true,
      role: "admin",
      createdAt: now,
      updatedAt: now,
    },
  });

  await prisma.account.create({
    data: {
      id: crypto.randomUUID(),
      accountId: userId,
      providerId: "credential",
      userId,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    },
  });

  console.log(`✓ Admin user created: ${email}`);
}

async function seedBlogTopics() {
  const topics = [
    { name: "Culture", slug: "culture", color: "#c9913d" },
    { name: "Politics", slug: "politics", color: "#1a2744" },
    { name: "Events", slug: "events", color: "#c0553a" },
    { name: "Youth Development", slug: "youth-development", color: "#2d6a4f" },
    { name: "Diaspora", slug: "diaspora", color: "#e8a93e" },
  ];

  for (const topic of topics) {
    await prisma.blogTopic.upsert({
      where: { slug: topic.slug },
      update: {},
      create: topic,
    });
  }
  console.log(`✓ Seeded ${topics.length} blog topics`);
}

async function seedBlogPosts() {
  const posts = [
    {
      slug: "the-strength-of-yoruba-heritage",
      title: "The Strength of Yoruba Heritage",
      topicSlug: "culture",
      excerpt:
        "For centuries, Yoruba civilization has stood as one of Africa's most vibrant and enduring cultural traditions — from the sacred city of Ile-Ife to diaspora communities on four continents.",
      authorName: "Dr. Aderibole Olumide",
      authorRole: "National President/CEO, YIF",
      readTime: 5,
      publishedAt: new Date("2026-03-15"),
      body: [
        "The Yoruba civilization is one of the world's most ancient and richly documented cultures, tracing its spiritual and historical origins to Ile-Ife — the city regarded as the cradle of Yoruba identity. From the intricate bronze castings of Benin to the vibrant indigo adire textiles of Abeokuta, Yoruba art has long been a language of its own, speaking of cosmology, hierarchy, and a people's unbroken relationship with the divine.",
        "Central to this heritage is the Yoruba language — a tonal tongue spoken by over 50 million people worldwide and recognized by UNESCO for its literary and oral traditions. Yoruba proverbs (àsàyán ọ̀rọ̀) carry generations of wisdom in a single phrase. Institutions like the Yoruba Indigenes' Foundation exist precisely to formalize this transmission: ensuring that the values embedded in language, festivals, masquerades, and lineage rites are not lost to the acceleration of modernity.",
        "YIF's cultural mandate, articulated through its founding motto — 'Fun Isokan, Idagbasoke ati Ilosiwaju Omo Yoruba Lapapo' (Yoruba Unity, Progress, and Advancement Together) — goes beyond preservation. It is about activation. When Yoruba sons and daughters in Mali, Brazil, China, and the United States connect through our diaspora network, they are not merely nostalgic; they are building the kind of transnational solidarity that allows culture to be a living, economic force.",
        "The annual awards ceremony, where distinguished Yoruba leaders receive the Staff of Distinction in the Order of Odua, is one tangible expression of how YIF honours this continuum between ancestral achievement and contemporary excellence. Heritage, for us, is never a museum piece — it is the foundation upon which future generations stand.",
      ],
    },
    {
      slug: "leadership-in-nigeria-today",
      title: "Leadership in Nigeria Today",
      topicSlug: "politics",
      excerpt:
        "As Yoruba-led state governments chart bold economic and social agendas, the question is no longer whether capable leadership exists — but whether institutions are strong enough to sustain it.",
      authorName: "Mr. Sanjo Olawuyi",
      authorRole: "Director of Publicity, YIF",
      readTime: 6,
      publishedAt: new Date("2026-02-28"),
      body: [
        "Nigeria's federal structure places enormous responsibility on sub-national governments, and the Yoruba states have increasingly demonstrated what purposeful, accountable leadership can accomplish in the face of structural constraints. Governors across Lagos, Ogun, Oyo, Osun, Ekiti, Ondo, and Kwara have each articulated distinct development blueprints — from infrastructure and industrial corridors to social protection schemes — that reflect a new seriousness in governance.",
        "The Yoruba Indigenes' Foundation maintains a non-partisan posture while actively engaging governance structures. Our charter calls for 'non-partisan cooperation at communal, local, and international levels.' This is not passivity — it is a strategic commitment to outlasting electoral cycles. YIF's role is to research, advise, and help bridge identifiable development gaps regardless of which administration is in power.",
        "What the current leadership landscape demands is a maturing of civil society alongside government. Too often, non-governmental organizations in Nigeria adopt a posture of permanent opposition rather than constructive partnership. YIF's approach — working with executive governors as patrons and allies, while preserving organizational independence — models a more productive relationship between civic institutions and the state.",
        "Leadership today must also grapple with a young and restless population. Over 60 percent of Nigeria's population is under 25. Any governance framework that does not place youth employment, education quality, and digital opportunity at its center is governing for the past, not the future. It is precisely this urgency that drives YIF's Youth Development program and our scholarship initiative, which provides pathways to university education for talented Yoruba young people who would otherwise lack access.",
      ],
    },
    {
      slug: "yoruba-world-day-2026",
      title: "Yoruba World Day 2026",
      topicSlug: "events",
      excerpt:
        "This year's Yoruba World Day carries a bold economic theme: Branding Nigeria & Investment Portfolios — a call for diaspora capital, indigenous innovation, and institutional partnership to converge.",
      authorName: "Chief Aderounmu Adesesan",
      authorRole: "National Coordinator, YIF",
      readTime: 4,
      publishedAt: new Date("2026-04-10"),
      body: [
        "Yoruba World Day is observed annually by Yoruba communities across the globe — a moment to reaffirm cultural identity, celebrate achievement, and strengthen the bonds between homeland and diaspora. The 2026 edition carries an explicitly economic charge: the theme 'Branding Nigeria & Investment Portfolios' recognizes that cultural pride and economic agency are not separate conversations.",
        "For YIF, this theme aligns directly with the Karo-Ojire Economic Empowerment Project — our cooperative investment vehicle designed to channel collective Yoruba capital into sustainable ventures. The cooperative model offers a powerful alternative to dependence on government patronage. As our founding philosophy holds: 'We don't have to win an election or pass a bill to do what we think is right for us. We can simply move our race forward.'",
        "Celebrations this year span Lagos, Ibadan, London, Atlanta, and São Paulo, with online participation from our representatives in Mali, Uganda, China, Australia, and beyond. Local committees have organized cultural exhibitions, investment forums, and youth talent showcases. The UK chapter, led by National Co-ordinator Princess M. Adewunmi King, has coordinated a fundraising gala in London to support the scholarship program.",
        "The investment portfolio discussions at Yoruba World Day 2026 events will focus on three sectors: agribusiness (particularly Yoruba-owned cooperatives in Ogun and Oyo states), technology and digital services (leveraging Yoruba talent in Lagos's growing tech ecosystem), and cultural tourism (monetizing heritage sites and festivals in a way that reinvests in local communities). YIF invites its members and patrons worldwide to attend, contribute, and lead.",
      ],
    },
    {
      slug: "youth-development-in-yoruba-land",
      title: "Youth Development in Yoruba Land",
      topicSlug: "youth-development",
      excerpt:
        "The next chapter of Yoruba advancement will be written by young people — and YIF's scholarship program, mentorship networks, and youth affairs directorate are building the conditions for that future right now.",
      authorName: "Ogundare Adenike",
      authorRole: "Youth Coordinator, YIF",
      readTime: 5,
      publishedAt: new Date("2026-01-20"),
      body: [
        "If there is one truth that unites every chapter of YIF's work — from cooperative economics to cultural preservation — it is that the future of the Yoruba people depends on the capacity we build in the next generation. Youth development is not a program category for us; it is the organizing logic of everything we do.",
        "The YIF Scholarship Program (2024–2025 Batch) represents one of the Foundation's most direct interventions: identifying talented Yoruba students, connecting them with top-slot scholarships at premium universities at home and abroad, and ensuring that financial circumstance does not determine intellectual destiny. With a registration process accessible to all and a selection process grounded in merit and need, the program has already created transformative pathways for young scholars.",
        "Beyond scholarships, youth development at YIF encompasses mentorship, digital literacy, and leadership formation. Our Youth Affairs directorate, led by Director Mr. Oluwatosin Famori, works to build networks between young Yorubas in the diaspora and their counterparts in Nigeria — facilitating internships, knowledge exchange, and joint projects that build skills while reinforcing cultural identity.",
        "The challenge is scale. Millions of young Yorubas deserve access to these opportunities, and the current programs serve only a fraction of that need. YIF's call to action is simple: if you are a successful Yoruba son or daughter — in business, medicine, law, technology, the arts — sponsor a scholar, mentor a youth, contribute to the cooperative. The most meaningful legacy any of us can leave is a young person fully equipped to carry the tradition forward.",
      ],
    },
  ];

  for (const post of posts) {
    const topic = await prisma.blogTopic.findUnique({
      where: { slug: post.topicSlug },
    });
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: bodyToTipTap(post.body),
        authorName: post.authorName,
        authorRole: post.authorRole,
        readTime: post.readTime,
        isPublished: true,
        publishedAt: post.publishedAt,
        topicId: topic?.id ?? null,
      },
    });
  }
  console.log(`✓ Seeded ${posts.length} blog posts`);
}

async function seedEvents() {
  const events = [
    {
      slug: "yif-annual-awards-2026",
      title: "YIF Annual Awards & Recognition Ceremony 2026",
      tagline:
        "Honouring the sons and daughters of Oodua who have made the race proud",
      category: "Awards",
      date: new Date("2026-07-12T17:00:00"),
      time: "5:00 PM WAT",
      location: "Federal Palace Hotel, Lagos",
      address: "1415 Ahmadu Bello Way, Victoria Island, Lagos",
      country: "Nigeria",
      description:
        "The YIF Annual Awards & Recognition Ceremony celebrates outstanding Yoruba individuals at home and in the diaspora who have distinguished themselves in their fields. Join us for an evening of culture, recognition, and unity as we honour heroes and heroines of the Yoruba race.",
      agenda: [
        "5:00 PM — Arrival & Reception",
        "6:00 PM — Opening prayers & national anthem",
        "6:20 PM — Welcome address by the National President",
        "6:45 PM — Keynote: The Yoruba Nation in a Changing World",
        "7:30 PM — Awards presentation (8 categories)",
        "9:00 PM — Cultural performances & dinner",
        "10:30 PM — Closing remarks",
      ],
      speakers: [
        { name: "Chief Aderounmu Adesesan", role: "National President, YIF" },
        { name: "Dr. Aderibole Olumide", role: "Keynote Speaker" },
        { name: "Mr. Sanjo Olawuyi", role: "Master of Ceremonies" },
      ],
      isPublished: true,
      tiers: [
        {
          name: "General Admission",
          price: 25000,
          description: "Standard seating, dinner included",
          capacity: 300,
        },
        {
          name: "VIP",
          price: 75000,
          description: "Priority seating, exclusive reception & gift pack",
          capacity: 50,
        },
        {
          name: "Table of 10",
          price: 200000,
          description: "Reserved table for 10 guests, branding opportunities",
          capacity: 20,
        },
      ],
    },
    {
      slug: "yoruba-world-day-summit-2026",
      title: "Yoruba World Day Summit 2026",
      tagline:
        "Connecting the global Yoruba diaspora — unity, culture, and progress",
      category: "Conference",
      date: new Date("2026-09-06T09:00:00"),
      endDate: new Date("2026-09-07T18:00:00"),
      time: "9:00 AM BST",
      location: "The Barbican Centre, London",
      address: "Silk Street, Barbican, London EC2Y 8DS",
      country: "United Kingdom",
      description:
        "The Yoruba World Day Summit brings together Yoruba leaders, entrepreneurs, scholars, and creatives from over 30 countries for two days of high-level dialogue, cultural celebration, and strategic networking. This is the flagship event of the YIF calendar.",
      agenda: [
        "Day 1 — Cultural Celebration & Opening Ceremony",
        "Day 1 — Panel: Economic Empowerment in the Diaspora",
        "Day 1 — Networking Dinner",
        "Day 2 — Youth Forum & Leadership Masterclass",
        "Day 2 — Closing Plenary: The Path Forward for Yoruba Unity",
      ],
      speakers: [
        { name: "Chief Aderounmu Adesesan", role: "National President, YIF" },
        {
          name: "Princess M. Adewunmi King (Labamba)",
          role: "National Co-ordinator, UK",
        },
        {
          name: "Ms. Olushola Olude",
          role: "YIF Representative, United States",
        },
        {
          name: "Dr. Gbenga Adeyeye",
          role: "YIF Representative, South Africa",
        },
      ],
      isPublished: true,
      tiers: [
        {
          name: "Delegate Pass (2 days)",
          price: 45000,
          description: "Full access both days, meals included",
          capacity: 400,
        },
        {
          name: "VIP Delegate",
          price: 120000,
          description: "VIP lounge access, both days, gala dinner ticket",
          capacity: 60,
        },
        {
          name: "Student / Youth (Under 30)",
          price: 10000,
          description:
            "Both days, meals included — valid student ID required at entry",
          capacity: 100,
        },
      ],
    },
    {
      slug: "karo-ojire-investment-workshop-2026",
      title: "Karo-Ojire Economic Empowerment Workshop",
      tagline: "Breaking free from poverty through cooperative economics",
      category: "Workshop",
      date: new Date("2026-06-14T10:00:00"),
      time: "10:00 AM WAT",
      location: "YIF Secretariat, Ibadan",
      address: "Secretariat Road, Ibadan, Oyo State",
      country: "Nigeria",
      description:
        "A practical, hands-on workshop on cooperative economics and investment strategies for Yoruba entrepreneurs. Learn how the Karo-Ojire initiative creates pathways to economic self-reliance, particularly for widows and young people.",
      agenda: [
        "10:00 AM — Registration & welcome",
        "10:30 AM — Introduction to Cooperative Economics",
        "11:30 AM — Karo-Ojire: Model & Opportunities",
        "1:00 PM — Lunch break",
        "2:00 PM — Group discussions & case studies",
        "4:00 PM — Q&A and next steps",
      ],
      speakers: [
        { name: "Mr. Edward Kayode Adeleye", role: "Treasurer, YIF" },
        { name: "Ogundare Adenike", role: "Youth Development Lead, YIF" },
      ],
      isPublished: true,
      tiers: [
        {
          name: "Participant",
          price: 5000,
          description: "Full day access, workshop materials, lunch",
          capacity: 150,
        },
      ],
    },
    {
      slug: "yif-fundraising-gala-london-2026",
      title: "YIF UK Fundraising Gala 2026",
      tagline:
        "An evening of culture and generosity — supporting Yoruba scholars",
      category: "Fundraiser",
      date: new Date("2026-10-17T19:00:00"),
      time: "7:00 PM BST",
      location: "Grosvenor House Hotel, London",
      address: "Park Lane, London W1K 7TN",
      country: "United Kingdom",
      description:
        "Join YIF UK for a glittering fundraising gala supporting the YIF Scholarship Program. Every ticket purchased directly funds a Yoruba student's university education. An evening of Afrobeats, Yoruba cuisine, live performances, and philanthropic spirit.",
      agenda: [
        "7:00 PM — Arrival & cocktail reception",
        "7:45 PM — Welcome by Princess M. Adewunmi King",
        "8:00 PM — Scholarship impact presentation",
        "8:30 PM — Dinner & live cultural performances",
        "10:00 PM — Fundraising auction",
        "11:00 PM — Dancing & networking",
      ],
      speakers: [
        {
          name: "Princess M. Adewunmi King (Labamba)",
          role: "National Co-ordinator, UK",
        },
        {
          name: "Princess Omolabake Margret King",
          role: "YIF Representative, London",
        },
      ],
      isPublished: true,
      tiers: [
        {
          name: "Individual Ticket",
          price: 60000,
          description:
            "Dinner, entertainment, and a contribution to the Scholarship Fund",
          capacity: 200,
        },
        {
          name: "Couple Ticket",
          price: 110000,
          description: "Two tickets — save ₦10,000",
          capacity: 60,
        },
        {
          name: "Gold Sponsor Table (10)",
          price: 500000,
          description:
            "Table of 10, naming rights on program, recognition speech slot",
          capacity: 10,
        },
      ],
    },
  ];

  for (const event of events) {
    const { tiers, ...eventData } = event;
    const existing = await prisma.event.findUnique({
      where: { slug: event.slug },
    });
    if (!existing) {
      await prisma.event.create({
        data: {
          ...eventData,
          tiers: { create: tiers },
        },
      });
      console.log(`  + Event: ${event.title}`);
    }
  }
  console.log(`✓ Events seeded`);
}

async function main() {
  await seedAdmin();
  await seedBlogTopics();
  await seedBlogPosts();
  await seedEvents();
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
