import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const MEMBERSHIP_CACHE_TAG = "membership-tiers";

export type TierWithPrices = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  color: string | null;
  badge: string | null;
  sortOrder: number;
  isActive: boolean;
  prices: { currency: string; amount: number }[];
};

export type PriceGrid = Record<string, Record<string, number>>;

export const getActiveTiers = unstable_cache(
  async (): Promise<TierWithPrices[]> => {
    const tiers = await prisma.membershipTier.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        prices: {
          where: { isActive: true },
          select: { currency: true, amount: true },
        },
      },
    });
    return tiers.map((t) => ({
      ...t,
      prices: t.prices.map((p) => ({ currency: p.currency, amount: Number(p.amount) })),
    }));
  },
  ["active-tiers"],
  { tags: [MEMBERSHIP_CACHE_TAG], revalidate: 3600 },
);

export const getAllTiers = unstable_cache(
  async (): Promise<TierWithPrices[]> => {
    const tiers = await prisma.membershipTier.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        prices: {
          select: { currency: true, amount: true },
        },
      },
    });
    return tiers.map((t) => ({
      ...t,
      prices: t.prices.map((p) => ({ currency: p.currency, amount: Number(p.amount) })),
    }));
  },
  ["all-tiers"],
  { tags: [MEMBERSHIP_CACHE_TAG], revalidate: 3600 },
);

export const getAllPrices = unstable_cache(
  async (): Promise<PriceGrid> => {
    const prices = await prisma.membershipPlanPrice.findMany({
      where: { isActive: true },
      select: { tierId: true, currency: true, amount: true },
    });
    const grid: PriceGrid = {};
    for (const p of prices) {
      if (!grid[p.tierId]) grid[p.tierId] = {};
      grid[p.tierId][p.currency] = Number(p.amount);
    }
    return grid;
  },
  ["all-prices"],
  { tags: [MEMBERSHIP_CACHE_TAG], revalidate: 3600 },
);

export async function getTierBySlug(slug: string): Promise<TierWithPrices | null> {
  const tier = await prisma.membershipTier.findUnique({
    where: { slug },
    include: {
      prices: { where: { isActive: true }, select: { currency: true, amount: true } },
    },
  });
  if (!tier) return null;
  return {
    ...tier,
    prices: tier.prices.map((p) => ({ currency: p.currency, amount: Number(p.amount) })),
  };
}

export async function getTierById(id: string): Promise<TierWithPrices | null> {
  const tier = await prisma.membershipTier.findUnique({
    where: { id },
    include: {
      prices: { where: { isActive: true }, select: { currency: true, amount: true } },
    },
  });
  if (!tier) return null;
  return {
    ...tier,
    prices: tier.prices.map((p) => ({ currency: p.currency, amount: Number(p.amount) })),
  };
}

export function getPriceForCurrency(
  tier: TierWithPrices,
  currency: string,
): number | null {
  return tier.prices.find((p) => p.currency === currency)?.amount ?? null;
}
