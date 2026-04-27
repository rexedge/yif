/**
 * One-shot reset for the events table.
 * Removes all existing events, ticket tiers, and tickets — then seeds the
 * single flagship Yoruba World Day 2026 entry.
 *
 * Run with:  pnpm tsx prisma/scripts/reset-events.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import {
  YWD_EVENT,
  YWD_AGENDA,
  YWD_DIGNITARIES,
} from "../../lib/yoruba-world-day-2026";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("⚠  Wiping all tickets, ticket tiers, and events…");
  const t = await prisma.ticket.deleteMany({});
  const tiers = await prisma.eventTicketTier.deleteMany({});
  const events = await prisma.event.deleteMany({});
  console.log(
    `   removed ${t.count} ticket(s), ${tiers.count} tier(s), ${events.count} event(s).`,
  );

  console.log("✔  Seeding Yoruba World Day 2026…");
  const agendaJson = YWD_AGENDA.map((d) => ({
    day: d.day,
    title: d.title,
    items: d.items,
  }));
  const speakersJson = YWD_DIGNITARIES.slice(0, 12).map((d) => ({
    name: d.name,
    role: d.role,
  }));

  await prisma.event.create({
    data: {
      slug: YWD_EVENT.slug,
      title: YWD_EVENT.title,
      tagline: YWD_EVENT.subtitle,
      category: "Conference",
      description:
        "The flagship YIF gathering convening Heads of State, Nigerian Federal Ministers, " +
        "the Ooni of Ife, captains of industry, and the global Yoruba diaspora to rebrand " +
        "Nigeria, unlock investment, and advance the Renewed Hope Agenda over two days in New York.",
      date: new Date(`${YWD_EVENT.startDate}T09:00:00-04:00`),
      endDate: new Date(`${YWD_EVENT.endDate}T22:00:00-04:00`),
      time: "9:00 AM – 10:00 PM EDT",
      location: `${YWD_EVENT.venue}, ${YWD_EVENT.city}`,
      address: YWD_EVENT.address,
      country: "United States",
      imageUrl: `${"/image/yorubaworldday2026"}/hero.jpg`,
      agenda: agendaJson,
      speakers: speakersJson,
      isPublished: true,
      tiers: {
        create: [
          {
            name: "General Admission — 2 Days",
            price: YWD_EVENT.ticketPriceNgn, // stored in NGN
            description:
              "Two-day delegate pass: opening, keynotes, panels, exhibition, gala dinner & cultural showcase. ($200 USD equivalent.)",
            capacity: 3000,
            sold: 0,
          },
        ],
      },
    },
  });

  console.log(
    "✅ Done. Yoruba World Day 2026 is now the only event in the DB.",
  );
}

main()
  .catch((e) => {
    console.error("❌ reset-events failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
