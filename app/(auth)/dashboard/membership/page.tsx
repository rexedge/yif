import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  UpgradeButton,
  DowngradeButton,
  CancelDowngradeButton,
} from "./_tier-change-forms";

export const metadata: Metadata = {
  title: "Membership | YIF Member Portal",
};

const TIERS = [
  {
    name: "Silver",
    dbKey: "SILVER",
    price: "₦5,000",
    period: "year",
    color: "#7f8c8d",
    benefits: [
      "Access to member newsletter",
      "Cultural events invitations",
      "Member directory listing",
      "Online community forum access",
    ],
  },
  {
    name: "Gold",
    dbKey: "GOLD",
    price: "₦10,000",
    period: "year",
    color: "var(--yif-gold)",
    benefits: [
      "All Silver benefits",
      "Discounted event tickets (10%)",
      "Voting rights at general meetings",
      "Mentorship Program access",
    ],
  },
  {
    name: "Diamond",
    dbKey: "DIAMOND",
    price: "₦15,000",
    period: "year",
    color: "#9b59b6",
    benefits: [
      "All Gold benefits",
      "Priority event registration",
      "Discounted event tickets (20%)",
      "Scholarship nomination rights",
      "Quarterly board briefings",
    ],
  },
  {
    name: "Platinum",
    dbKey: "PLATINUM",
    price: "₦20,000",
    period: "year",
    color: "#5dade2",
    benefits: [
      "All Diamond benefits",
      "Complimentary gala table seat",
      "Name on annual report",
      "Program committee invite",
      "Dedicated member liaison",
    ],
  },
];

const TIER_ORDER: Record<string, number> = {
  BRONZE: 0,
  SILVER: 1,
  GOLD: 2,
  DIAMOND: 3,
  PLATINUM: 4,
};

const STATUS_BADGE: Record<string, string> = {
  ACTIVE:
    "bg-[var(--yif-green)]/20 text-[var(--yif-green)] border-[var(--yif-green)]/30",
  PENDING: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  SUSPENDED:
    "bg-[var(--yif-terracotta)]/20 text-[var(--yif-terracotta)] border-[var(--yif-terracotta)]/30",
  EXPIRED: "bg-white/10 text-white/50 border-white/20",
};

export default async function MembershipPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
  });

  if (!member) {
    return (
      <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-1">
            Member Portal
          </p>
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Membership
          </h1>
          <p className="mt-1 text-white/50 text-sm">
            Manage your YIF membership, view benefits, and upgrade your tier.
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--yif-gold)]/20 bg-[var(--yif-gold)]/5 p-8 text-center max-w-lg mx-auto mt-12">
          <div className="w-16 h-16 rounded-full bg-[var(--yif-gold)]/15 border border-[var(--yif-gold)]/30 flex items-center justify-center mx-auto mb-4 text-3xl">
            🤝
          </div>
          <h2 className="font-display text-xl font-semibold text-white mb-2">
            You are not yet a member
          </h2>
          <p className="text-white/50 text-sm mb-6">
            Join the Yoruba Indigenes&apos; Foundation and connect with a global
            community of Yoruba heritage advocates.
          </p>
          <Link
            href="/membership"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--yif-gold)] text-[var(--yif-navy-dark)] px-6 py-2.5 text-sm font-semibold hover:bg-[var(--yif-gold-light)] transition-colors"
          >
            Become a Member →
          </Link>
        </div>
      </div>
    );
  }

  const currentTier = TIERS.find((t) => t.dbKey === member.tier) ?? TIERS[0];
  const expiryDate = member.expiresAt
    ? new Date(member.expiresAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";
  const statusLabel = member.status as string;
  const currentOrder = TIER_ORDER[member.tier] ?? 0;
  const pendingTierData = member.pendingTier
    ? TIERS.find((t) => t.dbKey === member.pendingTier)
    : null;

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-1">
          Member Portal
        </p>
        <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          Membership
        </h1>
        <p className="mt-1 text-white/50 text-sm">
          Manage your YIF membership, view benefits, and upgrade your tier.
        </p>
      </div>

      {/* Current status card */}
      <div
        className="rounded-2xl border p-6 mb-8"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, ${currentTier.color} 8%, transparent), color-mix(in srgb, ${currentTier.color} 4%, transparent))`,
          borderColor: `color-mix(in srgb, ${currentTier.color} 30%, transparent)`,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">
              Current Membership
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="font-display text-2xl font-bold"
                style={{ color: currentTier.color }}
              >
                {currentTier.name} Member
              </span>
              <span
                className={`rounded-full text-xs px-2 py-0.5 border font-medium ${STATUS_BADGE[statusLabel] ?? STATUS_BADGE.ACTIVE}`}
              >
                {statusLabel.charAt(0) + statusLabel.slice(1).toLowerCase()}
              </span>
            </div>
            <p className="text-sm text-white/50 mt-1">
              {member.status === "ACTIVE" ? "Renews" : "Expired"}{" "}
              <strong className="text-white/70">{expiryDate}</strong>
              {" · "}
              {currentTier.price}/{currentTier.period}
            </p>
          </div>
          {member.status === "ACTIVE" && (
            <div className="shrink-0">
              <UpgradeButton
                tierSlug={currentTier.dbKey.toLowerCase()}
                tierName={currentTier.name}
                price={currentTier.price}
                color={currentTier.color}
                label="Renew Membership"
              />
            </div>
          )}
        </div>

        {/* Benefits of current tier */}
        <div className="mt-5 pt-5 border-t border-white/10">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3">
            Your {currentTier.name} Benefits
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentTier.benefits.map((b) => (
              <div
                key={b}
                className="flex items-center gap-2 text-sm text-white/70"
              >
                <span style={{ color: currentTier.color }}>✓</span>
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending downgrade banner */}
      {pendingTierData && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-300">
              Tier change scheduled
            </p>
            <p className="text-xs text-white/50 mt-0.5">
              Your tier will change to{" "}
              <strong className="text-amber-300">{pendingTierData.name}</strong>{" "}
              when your membership expires on{" "}
              <strong className="text-white/70">{expiryDate}</strong>. No refund
              is issued — your current benefits remain until then.
            </p>
          </div>
          <CancelDowngradeButton pendingTierName={pendingTierData.name} />
        </div>
      )}

      {/* Tier comparison */}
      <section className="mb-8">
        <h2 className="font-display text-lg font-semibold text-white mb-4">
          All Membership Tiers
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier) => {
            const isCurrent = tier.dbKey === member.tier;
            return (
              <div
                key={tier.name}
                className={`rounded-xl border px-4 py-5 relative ${isCurrent ? "ring-1" : ""}`}
                style={{
                  borderColor: isCurrent
                    ? `color-mix(in srgb, ${tier.color} 50%, transparent)`
                    : "rgba(255,255,255,0.08)",
                  background: isCurrent
                    ? `color-mix(in srgb, ${tier.color} 8%, rgba(255,255,255,0.03))`
                    : "rgba(255,255,255,0.03)",
                  ...(isCurrent
                    ? ({
                        "--tw-ring-color": `color-mix(in srgb, ${tier.color} 50%, transparent)`,
                      } as React.CSSProperties)
                    : {}),
                }}
              >
                {isCurrent && (
                  <span
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: tier.color,
                      color: "var(--yif-navy-dark)",
                    }}
                  >
                    Current
                  </span>
                )}
                <p
                  className="font-display text-base font-semibold mb-0.5"
                  style={{ color: tier.color }}
                >
                  {tier.name}
                </p>
                <p className="font-display text-xl font-bold text-white">
                  {tier.price}
                  <span className="text-xs font-sans font-normal text-white/40">
                    /{tier.period}
                  </span>
                </p>
                <ul className="mt-3 space-y-1.5">
                  {tier.benefits.slice(0, 4).map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-1.5 text-xs text-white/55"
                    >
                      <span
                        style={{ color: tier.color }}
                        className="mt-0.5 shrink-0"
                      >
                        ✓
                      </span>
                      {b}
                    </li>
                  ))}
                  {tier.benefits.length > 4 && (
                    <li className="text-xs text-white/30 pl-4">
                      +{tier.benefits.length - 4} more
                    </li>
                  )}
                </ul>
                {member.status === "ACTIVE" && (
                  <div className="mt-4">
                    {isCurrent ? (
                      <UpgradeButton
                        tierSlug={tier.dbKey.toLowerCase()}
                        tierName={tier.name}
                        price={tier.price}
                        color={tier.color}
                        label="Renew Early"
                      />
                    ) : (TIER_ORDER[tier.dbKey] ?? 0) > currentOrder ? (
                      <UpgradeButton
                        tierSlug={tier.dbKey.toLowerCase()}
                        tierName={tier.name}
                        price={tier.price}
                        color={tier.color}
                      />
                    ) : (
                      <DowngradeButton
                        tierSlug={tier.dbKey.toLowerCase()}
                        tierName={tier.name}
                        currentTierName={currentTier.name}
                        expiresAt={member.expiresAt ? expiryDate : null}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Learn more */}
      <div className="mt-8 text-center">
        <p className="text-white/40 text-sm mb-3">
          Learn about membership benefits and how to join
        </p>
        <Link
          href="/membership"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--yif-gold)]/40 px-6 py-2.5 text-sm font-semibold text-[var(--yif-gold)] hover:bg-[var(--yif-gold)]/10 transition-colors"
        >
          View Membership Details →
        </Link>
      </div>
    </div>
  );
}
