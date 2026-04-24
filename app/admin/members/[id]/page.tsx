import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  banMember,
  unbanMember,
  changeMemberTier,
  revokeMembership,
} from "../actions";

export const metadata: Metadata = { title: "Member Detail | Admin — YIF" };

type Props = { params: Promise<{ id: string }> };

const TIERS = ["associate", "full", "student", "senior", "patron", "honorary"];

export default async function MemberDetailPage({ params }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      member: true,
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
  if (!user) notFound();

  const isBanned = user.banned;
  const member = user.member;

  async function handleBan(formData: FormData) {
    "use server";
    const reason = (formData.get("banReason") as string).trim();
    const daysStr = formData.get("banDays") as string;
    const days = daysStr ? parseInt(daysStr) : undefined;
    await banMember(id, reason || "Admin action", days);
  }

  async function handleUnban() {
    "use server";
    await unbanMember(id);
  }

  async function handleRevoke() {
    "use server";
    if (member) await revokeMembership(member.id);
  }

  async function handleTierChange(formData: FormData) {
    "use server";
    const tier = formData.get("tier") as string;
    if (member) await changeMemberTier(member.id, tier);
  }

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link
          href="/admin/members"
          className="text-xs text-white/40 hover:text-white/60 transition-colors mb-6 inline-flex items-center gap-1.5"
        >
          ← Back to Members
        </Link>

        {/* Profile header */}
        <div className="rounded-2xl bg-white/5 border border-white/8 p-6 mt-4 flex flex-wrap items-start gap-5">
          <div className="w-14 h-14 rounded-full bg-[var(--yif-gold)]/20 flex items-center justify-center shrink-0">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name ?? ""}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <span className="text-[var(--yif-gold)] font-semibold text-xl">
                {(user.name ?? "?")[0].toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl font-semibold text-white">
              {user.name ?? "—"}
            </h1>
            <p className="text-white/40 text-sm mt-0.5">{user.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {isBanned && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--yif-terracotta)]/20 text-[var(--yif-terracotta)] border border-[var(--yif-terracotta)]/30">
                  Banned
                </span>
              )}
              {member && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--yif-gold)]/15 text-[var(--yif-gold)] border border-[var(--yif-gold)]/25 capitalize">
                  {member.tier} Member
                </span>
              )}
              {member && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize ${
                    member.status === "ACTIVE"
                      ? "bg-[var(--yif-green)]/15 text-[var(--yif-green)] border-[var(--yif-green)]/25"
                      : "bg-white/6 text-white/40 border-white/12"
                  }`}
                >
                  {member.status}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Member details */}
        {member && (
          <div className="mt-4 rounded-2xl bg-white/5 border border-white/8 p-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              {
                label: "Joined",
                value: new Date(member.joinedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
              },
              { label: "Membership #", value: member.membershipNumber ?? "—" },
              { label: "Country", value: user.country ?? "—" },
              { label: "Phone", value: user.phone ?? "—" },
              { label: "State/Province", value: user.stateProvince ?? "—" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-white/30 uppercase tracking-wide mb-1">
                  {item.label}
                </p>
                <p className="text-sm text-white/80">{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 space-y-4">
          {/* Change Tier */}
          {member && (
            <div className="rounded-2xl bg-white/5 border border-white/8 p-5">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
                Change Membership Tier
              </h3>
              <form action={handleTierChange} className="flex gap-3">
                <select
                  name="tier"
                  defaultValue={member.tier}
                  className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[var(--yif-gold)]/40 appearance-none"
                >
                  {TIERS.map((t) => (
                    <option
                      key={t}
                      value={t}
                      className="bg-[#1a2744] capitalize"
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-xl bg-white/10 hover:bg-white/15 text-white px-4 py-2 text-sm transition-colors"
                >
                  Update Tier
                </button>
              </form>
            </div>
          )}

          {/* Ban / Unban */}
          <div className="rounded-2xl bg-white/5 border border-white/8 p-5">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
              {isBanned ? "User is Banned" : "Ban User"}
            </h3>
            {isBanned ? (
              <div className="space-y-2">
                {user.banReason && (
                  <p className="text-sm text-white/50">
                    Reason: {user.banReason}
                  </p>
                )}
                <form action={handleUnban}>
                  <button
                    type="submit"
                    className="rounded-xl bg-[var(--yif-green)]/20 text-[var(--yif-green)] hover:bg-[var(--yif-green)]/30 px-4 py-2 text-sm transition-colors"
                  >
                    Unban User
                  </button>
                </form>
              </div>
            ) : (
              <form action={handleBan} className="space-y-3">
                <input
                  name="banReason"
                  placeholder="Reason (optional)…"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-terracotta)]/40"
                />
                <div className="flex gap-3">
                  <input
                    name="banDays"
                    type="number"
                    min="1"
                    placeholder="Days (blank = permanent)"
                    className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-terracotta)]/40"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-[var(--yif-terracotta)]/20 text-[var(--yif-terracotta)] hover:bg-[var(--yif-terracotta)]/30 px-4 py-2 text-sm transition-colors"
                  >
                    Ban User
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Revoke */}
          {member && member.status === "ACTIVE" && (
            <div className="rounded-2xl bg-white/5 border border-white/8 p-5">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
                Revoke Membership
              </h3>
              <p className="text-sm text-white/40 mb-3">
                This will mark the membership as revoked. The user account
                remains active.
              </p>
              <form action={handleRevoke}>
                <button
                  type="submit"
                  className="rounded-xl border border-[var(--yif-terracotta)]/30 text-[var(--yif-terracotta)]/70 hover:border-[var(--yif-terracotta)]/60 hover:text-[var(--yif-terracotta)] px-4 py-2 text-sm transition-colors"
                >
                  Revoke Membership
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Transactions */}
        {user.transactions.length > 0 && (
          <div className="mt-6 rounded-2xl bg-white/5 border border-white/8 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/8">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide">
                Recent Transactions
              </h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-3 text-xs text-white/30 font-medium">
                    Description
                  </th>
                  <th className="text-right px-5 py-3 text-xs text-white/30 font-medium">
                    Amount
                  </th>
                  <th className="text-left px-5 py-3 text-xs text-white/30 font-medium hidden sm:table-cell">
                    Date
                  </th>
                  <th className="text-left px-5 py-3 text-xs text-white/30 font-medium hidden sm:table-cell">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {user.transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-5 py-3 text-white/70">{tx.purpose}</td>
                    <td className="px-5 py-3 text-right text-white/70">
                      ₦{Number(tx.amount).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-white/40 text-xs hidden sm:table-cell">
                      {new Date(tx.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-5 py-3 text-white/40 text-xs hidden sm:table-cell">
                      {tx.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
