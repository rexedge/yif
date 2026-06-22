import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TiersClient } from "./TiersClient";

export const metadata: Metadata = { title: "Admin — Tiers & Pricing | YIF" };

const CURRENCIES = ["NGN", "USD", "GBP", "EUR"] as const;

export default async function TiersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const tiers = await prisma.membershipTier.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      prices: { select: { currency: true, amount: true } },
      _count: { select: { members: true } },
    },
  });

  const tiersWithNumbers = tiers.map((t) => ({
    ...t,
    prices: t.prices.map((p) => ({ currency: p.currency, amount: Number(p.amount) })),
    memberCount: t._count.members,
  }));

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-terracotta)] mb-1">
          Settings
        </p>
        <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          Membership Tiers & Pricing
        </h1>
        <p className="mt-1 text-white/40 text-sm">
          Create, edit, reorder, or archive membership tiers and set per-currency prices.
        </p>
      </div>

      <TiersClient tiers={tiersWithNumbers} currencies={[...CURRENCIES]} />
    </div>
  );
}
