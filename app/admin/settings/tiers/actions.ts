"use server";

import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MEMBERSHIP_CACHE_TAG } from "@/lib/membership";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

const tierSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, or hyphens"),
  description: z.string().optional(),
  color: z.string().optional(),
  badge: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export type TierActionState = { error?: string; success?: boolean };

export async function createTier(
  _prev: TierActionState,
  formData: FormData,
): Promise<TierActionState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  const parsed = tierSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    color: formData.get("color") || undefined,
    badge: formData.get("badge") || undefined,
    sortOrder: formData.get("sortOrder") ?? 0,
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const existing = await prisma.membershipTier.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) return { error: `Slug "${parsed.data.slug}" is already in use.` };

  await prisma.membershipTier.create({ data: parsed.data });
  revalidateTag(MEMBERSHIP_CACHE_TAG, {});
  return { success: true };
}

export async function updateTier(
  id: string,
  _prev: TierActionState,
  formData: FormData,
): Promise<TierActionState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  const parsed = tierSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    color: formData.get("color") || undefined,
    badge: formData.get("badge") || undefined,
    sortOrder: formData.get("sortOrder") ?? 0,
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const conflict = await prisma.membershipTier.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (conflict) return { error: `Slug "${parsed.data.slug}" is already in use.` };

  await prisma.membershipTier.update({ where: { id }, data: parsed.data });
  revalidateTag(MEMBERSHIP_CACHE_TAG, {});
  return { success: true };
}

export async function archiveTier(id: string): Promise<TierActionState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  const memberCount = await prisma.member.count({ where: { tierId: id } });
  await prisma.membershipTier.update({
    where: { id },
    data: { isActive: false },
  });
  revalidateTag(MEMBERSHIP_CACHE_TAG, {});
  return {
    success: true,
    ...(memberCount > 0
      ? { error: `Archived. Note: ${memberCount} existing member(s) still reference this tier.` }
      : {}),
  };
}

export async function restoreTier(id: string): Promise<TierActionState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  await prisma.membershipTier.update({ where: { id }, data: { isActive: true } });
  revalidateTag(MEMBERSHIP_CACHE_TAG, {});
  return { success: true };
}

const CURRENCIES = ["NGN", "USD", "GBP", "EUR"] as const;

export async function updatePrices(
  prices: { tierId: string; currency: string; amount: number }[],
): Promise<TierActionState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  const validCurrencies = new Set(CURRENCIES as readonly string[]);
  const valid = prices.filter(
    (p) => validCurrencies.has(p.currency) && p.amount >= 0 && p.tierId,
  );

  await prisma.$transaction(
    valid.map((p) =>
      prisma.membershipPlanPrice.upsert({
        where: { tierId_currency: { tierId: p.tierId, currency: p.currency } },
        update: { amount: p.amount },
        create: {
          tierId: p.tierId,
          currency: p.currency,
          amount: p.amount,
        },
      }),
    ),
  );

  revalidateTag(MEMBERSHIP_CACHE_TAG, {});
  return { success: true };
}
