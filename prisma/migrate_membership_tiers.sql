-- Manual migration: replace MembershipTier enum with dynamic table
-- Run once with: pnpm prisma db execute --file prisma/migrate_membership_tiers.sql

BEGIN;

-- ── 1. Create membership_tier table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "membership_tier" (
  "id"          TEXT        NOT NULL,
  "slug"        TEXT        NOT NULL,
  "name"        TEXT        NOT NULL,
  "description" TEXT,
  "color"       TEXT,
  "badge"       TEXT,
  "sortOrder"   INTEGER     NOT NULL DEFAULT 0,
  "isActive"    BOOLEAN     NOT NULL DEFAULT true,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "membership_tier_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "membership_tier_slug_key" ON "membership_tier"("slug");

-- ── 2. Seed default tiers ─────────────────────────────────────────────────────
INSERT INTO "membership_tier" ("id","slug","name","description","color","badge","sortOrder","isActive","createdAt","updatedAt") VALUES
  ('tier_bronze',   'bronze',   'Bronze',   'Entry-level membership.',                                               '#cd7f32', NULL,          0, false, NOW(), NOW()),
  ('tier_silver',   'silver',   'Silver',   'Start your journey as a YIF community member.',                        '#7f8c8d', NULL,          1, true,  NOW(), NOW()),
  ('tier_gold',     'gold',     'Gold',     'Full member privileges with voting rights.',                           '#c9913d', NULL,          2, true,  NOW(), NOW()),
  ('tier_diamond',  'diamond',  'Diamond',  'Enhanced access and scholarship nomination rights.',                   '#9b59b6', 'Most Popular',3, true,  NOW(), NOW()),
  ('tier_platinum', 'platinum', 'Platinum', 'Leadership-level recognition and board access.',                      '#5dade2', 'Elite',       4, true,  NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;

-- ── 3. Create membership_plan_price table ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS "membership_plan_price" (
  "id"        TEXT          NOT NULL,
  "tierId"    TEXT          NOT NULL,
  "currency"  TEXT          NOT NULL,
  "amount"    DECIMAL(10,2) NOT NULL,
  "isActive"  BOOLEAN       NOT NULL DEFAULT true,
  "updatedAt" TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "membership_plan_price_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "membership_plan_price_tierId_currency_key"
  ON "membership_plan_price"("tierId", "currency");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'membership_plan_price_tierId_fkey') THEN
    ALTER TABLE "membership_plan_price"
      ADD CONSTRAINT "membership_plan_price_tierId_fkey"
      FOREIGN KEY ("tierId") REFERENCES "membership_tier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- ── 4. Seed default prices ────────────────────────────────────────────────────
INSERT INTO "membership_plan_price" ("id","tierId","currency","amount","isActive","updatedAt","createdAt") VALUES
  ('price_silver_ngn',   'tier_silver',   'NGN',  5000, true, NOW(), NOW()),
  ('price_silver_usd',   'tier_silver',   'USD',     5, true, NOW(), NOW()),
  ('price_silver_gbp',   'tier_silver',   'GBP',     4, true, NOW(), NOW()),
  ('price_silver_eur',   'tier_silver',   'EUR',     5, true, NOW(), NOW()),
  ('price_gold_ngn',     'tier_gold',     'NGN', 10000, true, NOW(), NOW()),
  ('price_gold_usd',     'tier_gold',     'USD',    10, true, NOW(), NOW()),
  ('price_gold_gbp',     'tier_gold',     'GBP',     8, true, NOW(), NOW()),
  ('price_gold_eur',     'tier_gold',     'EUR',     9, true, NOW(), NOW()),
  ('price_diamond_ngn',  'tier_diamond',  'NGN', 15000, true, NOW(), NOW()),
  ('price_diamond_usd',  'tier_diamond',  'USD',    15, true, NOW(), NOW()),
  ('price_diamond_gbp',  'tier_diamond',  'GBP',    12, true, NOW(), NOW()),
  ('price_diamond_eur',  'tier_diamond',  'EUR',    14, true, NOW(), NOW()),
  ('price_platinum_ngn', 'tier_platinum', 'NGN', 20000, true, NOW(), NOW()),
  ('price_platinum_usd', 'tier_platinum', 'USD',    20, true, NOW(), NOW()),
  ('price_platinum_gbp', 'tier_platinum', 'GBP',    16, true, NOW(), NOW()),
  ('price_platinum_eur', 'tier_platinum', 'EUR',    18, true, NOW(), NOW())
ON CONFLICT ("tierId", "currency") DO NOTHING;

-- ── 5. Add new nullable FK columns to member ──────────────────────────────────
ALTER TABLE "member" ADD COLUMN IF NOT EXISTS "tierId"        TEXT;
ALTER TABLE "member" ADD COLUMN IF NOT EXISTS "pendingTierId" TEXT;

-- ── 6. Populate tierId from existing tier enum values ─────────────────────────
UPDATE "member" SET "tierId" = 'tier_silver'   WHERE "tier"::text = 'SILVER';
UPDATE "member" SET "tierId" = 'tier_gold'     WHERE "tier"::text = 'GOLD';
UPDATE "member" SET "tierId" = 'tier_diamond'  WHERE "tier"::text = 'DIAMOND';
UPDATE "member" SET "tierId" = 'tier_platinum' WHERE "tier"::text = 'PLATINUM';
UPDATE "member" SET "tierId" = 'tier_bronze'   WHERE "tier"::text = 'BRONZE';
-- Safety net: any unmapped row defaults to silver
UPDATE "member" SET "tierId" = 'tier_silver'   WHERE "tierId" IS NULL;

-- ── 7. Populate pendingTierId from existing pendingTier enum values ───────────
UPDATE "member" SET "pendingTierId" = 'tier_silver'   WHERE "pendingTier"::text = 'SILVER';
UPDATE "member" SET "pendingTierId" = 'tier_gold'     WHERE "pendingTier"::text = 'GOLD';
UPDATE "member" SET "pendingTierId" = 'tier_diamond'  WHERE "pendingTier"::text = 'DIAMOND';
UPDATE "member" SET "pendingTierId" = 'tier_platinum' WHERE "pendingTier"::text = 'PLATINUM';
UPDATE "member" SET "pendingTierId" = 'tier_bronze'   WHERE "pendingTier"::text = 'BRONZE';

-- ── 8. Make tierId required ───────────────────────────────────────────────────
ALTER TABLE "member" ALTER COLUMN "tierId" SET NOT NULL;

-- ── 9. Add FK constraints ─────────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'member_tierId_fkey') THEN
    ALTER TABLE "member"
      ADD CONSTRAINT "member_tierId_fkey"
      FOREIGN KEY ("tierId") REFERENCES "membership_tier"("id") ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'member_pendingTierId_fkey') THEN
    ALTER TABLE "member"
      ADD CONSTRAINT "member_pendingTierId_fkey"
      FOREIGN KEY ("pendingTierId") REFERENCES "membership_tier"("id") ON UPDATE CASCADE;
  END IF;
END $$;

-- ── 10. Drop old enum columns ─────────────────────────────────────────────────
ALTER TABLE "member" DROP COLUMN IF EXISTS "tier";
ALTER TABLE "member" DROP COLUMN IF EXISTS "pendingTier";

-- ── 11. Add notes column + new indexes to transaction ────────────────────────
ALTER TABLE "transaction" ADD COLUMN IF NOT EXISTS "notes" TEXT;
CREATE INDEX IF NOT EXISTS "transaction_currency_idx"  ON "transaction"("currency");
CREATE INDEX IF NOT EXISTS "transaction_provider_idx"  ON "transaction"("provider");

-- ── 12. Drop old MembershipTier enum ─────────────────────────────────────────
DROP TYPE IF EXISTS "MembershipTier";

COMMIT;
