import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "My Donations | YIF Member Portal",
};

function getCause(metadata: Prisma.JsonValue): string {
  if (metadata && typeof metadata === "object" && !Array.isArray(metadata)) {
    const m = metadata as Record<string, unknown>;
    if (typeof m.cause === "string" && m.cause) return m.cause;
  }
  return "General Fund";
}

export default async function DonationsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const donations = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      purpose: "DONATION",
      status: "SUCCESS",
    },
    orderBy: { createdAt: "desc" },
  });

  const currentYear = new Date().getFullYear();
  const thisYearTotal = donations
    .filter((d) => new Date(d.createdAt).getFullYear() === currentYear)
    .reduce((acc, d) => acc + Number(d.amount), 0);

  const totalDonated = donations.reduce((acc, d) => acc + Number(d.amount), 0);
  const totalCount = donations.length;

  const summary = [
    {
      label: "Total Donated (All Time)",
      value: `₦${totalDonated.toLocaleString("en-NG")}`,
    },
    {
      label: `This Year (${currentYear})`,
      value: `₦${thisYearTotal.toLocaleString("en-NG")}`,
    },
    { label: "Transactions", value: String(totalCount) },
  ];

  // Group by year
  const byYear = new Map<number, typeof donations>();
  for (const d of donations) {
    const y = new Date(d.createdAt).getFullYear();
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)!.push(d);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-1">
          Member Portal
        </p>
        <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          My Donations
        </h1>
        <p className="mt-1 text-white/50 text-sm">
          Your full contribution history to the Yoruba Indigenes&apos;
          Foundation.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {summary.map((s) => (
          <div
            key={s.label}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-4"
          >
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
              {s.label}
            </p>
            <p className="font-display text-xl font-semibold text-[var(--yif-gold)]">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tax receipt notice */}
      <div className="mb-6 rounded-xl bg-[var(--yif-gold)]/8 border border-[var(--yif-gold)]/20 px-5 py-4 flex items-start gap-3">
        <span className="text-[var(--yif-gold)] text-lg shrink-0 mt-0.5">
          ℹ
        </span>
        <div>
          <p className="text-sm text-white font-medium">
            Tax Receipts Available
          </p>
          <p className="text-xs text-white/50 mt-0.5">
            As a registered NGO (RC IT 28744), YIF can issue tax-deductible
            donation receipts. Contact{" "}
            <a
              href="mailto:treasurer@yif.ng"
              className="text-[var(--yif-gold)] hover:underline"
            >
              treasurer@yif.ng
            </a>{" "}
            with your transaction reference to request a receipt.
          </p>
        </div>
      </div>

      {/* Grouped by year */}
      {donations.length === 0 ? (
        <div className="rounded-xl bg-white/5 border border-white/10 px-5 py-12 text-center text-white/40 text-sm">
          No donations yet.{" "}
          <Link
            href="/donate"
            className="text-[var(--yif-gold)] hover:underline"
          >
            Make your first donation →
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {years.map((year) => {
            const yearDonations = byYear.get(year)!;
            const yearTotal = yearDonations
              .filter((d) => d.status === "SUCCESS")
              .reduce((acc, d) => acc + Number(d.amount), 0);

            return (
              <section key={year}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-display text-lg font-semibold text-white">
                    {year}
                  </h2>
                  <span className="text-sm text-[var(--yif-gold)] font-semibold">
                    ₦{yearTotal.toLocaleString("en-NG")} total
                  </span>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-5 py-3 text-xs text-white/40 uppercase tracking-wider font-medium">
                          Cause
                        </th>
                        <th className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider font-medium hidden sm:table-cell">
                          Date
                        </th>
                        <th className="text-right px-5 py-3 text-xs text-white/40 uppercase tracking-wider font-medium">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {yearDonations.map((d) => (
                        <tr
                          key={d.id}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <p className="font-medium text-white/70">
                              {getCause(d.metadata)}
                            </p>
                            <p className="text-xs text-white/30 font-mono mt-0.5">
                              {d.reference}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-white/40 hidden sm:table-cell">
                            {new Date(
                              d.paidAt ?? d.createdAt,
                            ).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <p className="font-semibold text-white">
                              ₦{Number(d.amount).toLocaleString("en-NG")}
                            </p>
                            <p className="text-xs text-[var(--yif-green)] mt-0.5">
                              Completed
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* CTA */}
      <div className="mt-10 text-center">
        <p className="text-white/40 text-sm mb-3">
          Make a new contribution to our mission
        </p>
        <Link
          href="/donate"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--yif-gold)] px-6 py-2.5 text-sm font-semibold text-[var(--yif-navy-dark)] hover:bg-[var(--yif-gold-light)] transition-colors"
        >
          Donate Now →
        </Link>
      </div>
    </div>
  );
}
