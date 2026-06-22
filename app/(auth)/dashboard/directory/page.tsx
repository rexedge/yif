import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Member Directory | YIF Member Portal",
};


function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function DirectoryPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const members = await prisma.user.findMany({
    where: { member: { status: "ACTIVE" } },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      country: true,
      cityDistrict: true,
      continent: true,
      member: { include: { tier: { select: { name: true, color: true } } } },
    },
  });

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-1">
          Member Portal
        </p>
        <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          Member Directory
        </h1>
        <p className="mt-1 text-white/50 text-sm">
          Connect with fellow members of the Yoruba Indigenes&apos; Foundation
          community.
        </p>
      </div>

      {/* Count */}
      <p className="text-xs text-white/30 mb-4">
        Showing {members.length} active member{members.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      {members.length === 0 ? (
        <div className="rounded-xl bg-white/5 border border-white/10 px-5 py-12 text-center text-white/40 text-sm">
          No active members found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((m) => {
            const color = m.member?.tier?.color ?? "var(--yif-gold)";
            const initials = getInitials(m.name ?? "?");
            const joinYear = m.member?.joinedAt
              ? new Date(m.member.joinedAt).getFullYear()
              : null;

            return (
              <div
                key={m.id}
                className="group rounded-xl bg-white/5 border border-white/10 px-5 py-5 hover:bg-white/8 hover:border-white/20 transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${color} 25%, transparent)`,
                      border: `1.5px solid color-mix(in srgb, ${color} 40%, transparent)`,
                    }}
                  >
                    <span style={{ color }}>{initials}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white leading-snug truncate">
                      {m.name}
                    </p>
                    {m.country && (
                      <p className="text-xs text-white/40 mt-0.5">
                        {m.cityDistrict ? `${m.cityDistrict}, ` : ""}
                        {m.country}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="rounded-full border text-xs px-2.5 py-0.5 font-medium"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`,
                      color,
                      borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
                    }}
                  >
                    {m.member?.tier?.name ?? "Member"}
                  </span>
                  {joinYear && (
                    <span className="text-xs text-white/25">
                      Since {joinYear}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-8 text-center text-xs text-white/20">
        Member directory is visible to verified YIF members only. Contact{" "}
        <a
          href="mailto:membership@yif.ng"
          className="text-[var(--yif-gold)]/60 hover:text-[var(--yif-gold)]"
        >
          membership@yif.ng
        </a>{" "}
        to update your listing.
      </p>
    </div>
  );
}
