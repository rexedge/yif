"use client";

import { useState } from "react";

const TIER_COLORS: Record<string, string> = {
  Diamond: "#9b59b6",
  Platinum: "#5dade2",
  Gold: "#c9913d",
  Silver: "#7f8c8d",
  Community: "#2d6a4f",
};

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-[var(--yif-green)]/15 text-[var(--yif-green)] border-[var(--yif-green)]/25",
  Pending: "bg-[var(--yif-gold)]/15 text-[var(--yif-gold)] border-[var(--yif-gold)]/25",
  Expired: "bg-[var(--yif-terracotta)]/12 text-[var(--yif-terracotta)] border-[var(--yif-terracotta)]/25",
};

const MEMBERS = [
  { id: 1, name: "Adewale Okafor", email: "adewale@example.com", tier: "Gold", status: "Active", joined: "Mar 2022", lastActive: "Today" },
  { id: 2, name: "Fatima Yusuf", email: "fatima@example.com", tier: "Gold", status: "Active", joined: "Dec 2025", lastActive: "Today" },
  { id: 3, name: "Tunde Adeyemi", email: "tunde@example.com", tier: "Platinum", status: "Active", joined: "Jan 2020", lastActive: "Yesterday" },
  { id: 4, name: "Adeola Bello", email: "adeola@example.com", tier: "Silver", status: "Active", joined: "Dec 2025", lastActive: "Today" },
  { id: 5, name: "Chidi Okonkwo", email: "chidi@example.com", tier: "Diamond", status: "Active", joined: "Jul 2018", lastActive: "3 days ago" },
  { id: 6, name: "Amina Kanu", email: "amina@example.com", tier: "Community", status: "Active", joined: "Sep 2024", lastActive: "1 week ago" },
  { id: 7, name: "Emeka Uche", email: "emeka@example.com", tier: "Silver", status: "Expired", joined: "Feb 2023", lastActive: "2 months ago" },
  { id: 8, name: "Bisi Oladele", email: "bisi@example.com", tier: "Gold", status: "Active", joined: "May 2021", lastActive: "Yesterday" },
  { id: 9, name: "Wale Adesanya", email: "wale@example.com", tier: "Community", status: "Pending", joined: "Dec 2025", lastActive: "Today" },
  { id: 10, name: "Ngozi Eze", email: "ngozi@example.com", tier: "Platinum", status: "Active", joined: "Oct 2019", lastActive: "4 days ago" },
  { id: 11, name: "Kunle Fashola", email: "kunle@example.com", tier: "Silver", status: "Active", joined: "Jun 2022", lastActive: "1 week ago" },
  { id: 12, name: "Yetunde Adisa", email: "yetunde@example.com", tier: "Gold", status: "Pending", joined: "Nov 2025", lastActive: "3 days ago" },
];

const ALL_TIERS = ["All", "Diamond", "Platinum", "Gold", "Silver", "Community"];
const ALL_STATUSES = ["All", "Active", "Pending", "Expired"];

export default function AdminMembersPage() {
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("All");
  const [status, setStatus] = useState("All");

  const filtered = MEMBERS.filter((m) => {
    const matchSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchTier = tier === "All" || m.tier === tier;
    const matchStatus = status === "All" || m.status === status;
    return matchSearch && matchTier && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-terracotta)] mb-1">Admin Panel</p>
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">Members</h1>
          <p className="mt-1 text-white/40 text-sm">{MEMBERS.length} total members</p>
        </div>
        <button className="rounded-xl bg-[var(--yif-gold)] text-[var(--yif-navy-dark)] px-5 py-2.5 text-sm font-semibold hover:bg-[var(--yif-gold-light)] transition-colors">
          + Invite Member
        </button>
      </div>

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
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
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
              {s}
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
                <th className="text-left px-5 py-3.5 text-xs text-white/40 font-medium uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3.5 text-xs text-white/40 font-medium uppercase tracking-wide">Tier</th>
                <th className="text-left px-4 py-3.5 text-xs text-white/40 font-medium uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3.5 text-xs text-white/40 font-medium uppercase tracking-wide hidden md:table-cell">Joined</th>
                <th className="text-left px-4 py-3.5 text-xs text-white/40 font-medium uppercase tracking-wide hidden lg:table-cell">Last Active</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-white/30 text-sm">
                    No members match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ backgroundColor: `${TIER_COLORS[m.tier]}25`, color: TIER_COLORS[m.tier] }}
                        >
                          {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-white/80 font-medium">{m.name}</p>
                          <p className="text-white/30 text-xs">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${TIER_COLORS[m.tier]}20`, color: TIER_COLORS[m.tier] }}
                      >
                        {m.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[m.status]}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-white/40 text-xs hidden md:table-cell">{m.joined}</td>
                    <td className="px-4 py-3.5 text-white/30 text-xs hidden lg:table-cell">{m.lastActive}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button className="text-xs text-[var(--yif-gold)]/70 hover:text-[var(--yif-gold)] transition-colors px-2 py-1 rounded hover:bg-[var(--yif-gold)]/8">
                          View
                        </button>
                        <button className="text-xs text-white/30 hover:text-white/60 transition-colors px-2 py-1 rounded hover:bg-white/5">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-white/8 text-xs text-white/30">
            Showing {filtered.length} of {MEMBERS.length} members
          </div>
        )}
      </div>
    </div>
  );
}
