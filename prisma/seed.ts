import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import { YWD_EVENT, YWD_AGENDA, YWD_DIGNITARIES } from "../lib/yoruba-world-day-2026";

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
  const existing = await prisma.event.findUnique({
    where: { slug: YWD_EVENT.slug },
  });

  if (!existing) {
    await prisma.event.create({
      data: {
        slug: YWD_EVENT.slug,
        title: YWD_EVENT.title,
        tagline: YWD_EVENT.subtitle,
        category: "Conference",
        date: new Date(`${YWD_EVENT.startDate}T09:00:00`),
        endDate: new Date(`${YWD_EVENT.endDate}T21:00:00`),
        time: "9:00 AM EDT",
        location: YWD_EVENT.venue,
        address: YWD_EVENT.address,
        country: "United States",
        description: `Theme: ${YWD_EVENT.theme}. A landmark two-day summit bringing together Yoruba leaders, investors, and dignitaries from across the globe at ${YWD_EVENT.venue}, ${YWD_EVENT.city}.`,
        agenda: YWD_AGENDA,
        speakers: YWD_DIGNITARIES.map((d) => ({ name: d.name, role: d.role })),
        isPublished: true,
        tiers: {
          create: [
            {
              name: "Delegate Pass",
              price: YWD_EVENT.ticketPriceUsd,
              description:
                "Full two-day access to all sessions and networking events",
              capacity: 500,
            },
          ],
        },
      },
    });
    console.log(`  + Event: ${YWD_EVENT.title}`);
  } else {
    console.log(`  = Event already exists: ${YWD_EVENT.title}`);
  }
  console.log(`✓ Events seeded`);
}

async function main() {
  // await seedAdmin();
  // await seedBlogTopics();
  // await seedBlogPosts();
  await seedEvents();
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
