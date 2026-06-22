/**
 * One-shot backfill for Transaction.baseAmount / baseCurrency / fxRate.
 *
 * Populates the NGN-equivalent for every existing transaction that doesn't yet
 * have one. Uses current FX rates (the original payment-time rate is unknown for
 * historical rows, so this is the best available approximation). NGN rows get a
 * rate of 1. Run once after applying the migration:
 *
 *   pnpm tsx prisma/scripts/backfill-base-amount.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { convertToNgn } from "../../lib/fx";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const rows = await prisma.transaction.findMany({
    where: { baseAmount: null },
    select: { id: true, amount: true, currency: true, reference: true },
  });

  console.log(`Found ${rows.length} transaction(s) without baseAmount.`);

  let updated = 0;
  for (const row of rows) {
    const amount = Number(row.amount ?? 0);
    if (amount <= 0) continue;

    const { baseAmount, fxRate } = await convertToNgn(amount, row.currency ?? "NGN");

    await prisma.transaction.update({
      where: { id: row.id },
      data: { baseAmount, baseCurrency: "NGN", fxRate },
    });
    updated++;
    console.log(
      `  ${row.reference}: ${row.currency} ${amount} → ₦${baseAmount} (rate ${fxRate})`,
    );
  }

  console.log(`Done. Backfilled ${updated} transaction(s).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
