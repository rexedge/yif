"use client";

import { useState } from "react";

const TIER_COLORS: Record<string, string> = {
  PLATINUM: "#5dade2",
  DIAMOND: "#9b59b6",
  GOLD: "#c9913d",
  SILVER: "#7f8c8d",
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE:
    "bg-[var(--yif-green)]/15 text-[var(--yif-green)] border-[var(--yif-green)]/25",
  PENDING:
    "bg-[var(--yif-gold)]/15 text-[var(--yif-gold)] border-[var(--yif-gold)]/25",
  EXPIRED:
    "bg-[var(--yif-terracotta)]/12 text-[var(--yif-terracotta)] border-[var(--yif-terracotta)]/25",
  SUSPENDED: "bg-white/8 text-white/40 border-white/12",
};

const ALL_TIERS = ["All", "PLATINUM", "DIAMOND", "GOLD", "SILVER"];
const ALL_STATUSES = ["All", "ACTIVE", "PENDING", "EXPIRED", "SUSPENDED"];

export type MemberRow = {
  id: string;
  tier: string;
  status: string;
  joinedAt: Date;
  user: { id: string; name: string; email: string };
};

export function MembersTable({ members }: { members: MemberRow[] }) {
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("All");
  const [status, setStatus] = useState("All");

  const filtered = members.filter((m) => {
    const matchSearch =
      !search ||
      m.user.name.toLowerCase().includes(search.toLowerCase()) ||
      m.user.email.toLowerCase().includes(search.toLowerCase());
    const matchTier = tier === "All" || m.tier === tier;
    const matchStatus = status === "All" || m.status === status;
    return matchSearch && matchTier && matchStatus;
  });

  return (
    <>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-[var(--yif-gold)]/40 transition-colors"
        />
        <div className="flex gap-2 flex-wrap">
          {ALL_TIERS.map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`px-3 py-2 text-xs rounded-lg border font-medium transition-colors ${
                tier === t
                  ? "border-[var(--yif-gold)]/50 bg-[var(--yif-gold)]/15 text-[var(--yif-gold)]"
                  : "border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
              }`}
            >
              {t === "All" ? "All" : t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-2 text-xs rounded-lg border font-medium transition-colors ${
                status === s
                  ? "border-white/30 bg-white/8 text-white"
                  : "border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
              }`}
            >
              {s === "All" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/5 border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-5 py-3.5 text-xs text-white/40 font-medium uppercase tracking-wide">
                  Name
                </th>
                <th className="text-left px-4 py-3.5 text-xs text-white/40 font-medium uppercase tracking-wide">
                  Tier
                </th>
                <th className="text-left px-4 py-3.5 text-xs text-white/40 font-medium uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-4 py-3.5 text-xs text-white/40 font-medium uppercase tracking-wide hidden md:table-cell">
                  Joined
                </th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-white/30 text-sm"
                  >
                    No members match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => {
                  const tierColor = TIER_COLORS[m.tier] ?? "#7f8c8d";
                  const tierLabel =
                    m.tier.charAt(0) + m.tier.slice(1).toLowerCase();
                  const statusLabel =
                    m.status.charAt(0) + m.status.slice(1).toLowerCase();
                  const initials = m.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  return (
                    <tr
                      key={m.id}
                      className="hover:bg-white/3 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{
                              backgroundColor: `${tierColor}25`,
                              color: tierColor,
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="text-white/80 font-medium">
                              {m.user.name}
                            </p>
                            <p className="text-white/30 text-xs">
                              {m.user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${tierColor}20`,
                            color: tierColor,
                          }}
                        >
                          {tierLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                            STATUS_STYLES[m.status] ??
                            "bg-white/5 text-white/40 border-white/10"
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-white/40 text-xs hidden md:table-cell">
                        {m.joinedAt.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3.5">
                        <a
                          href={`/admin/members/${m.user.id}`}
                          className="text-xs text-[var(--yif-gold)]/70 hover:text-[var(--yif-gold)] transition-colors px-2 py-1 rounded hover:bg-[var(--yif-gold)]/8"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-white/8 text-xs text-white/30">
            Showing {filtered.length} of {members.length} members
          </div>
        )}
      </div>
    </>
  );
}
