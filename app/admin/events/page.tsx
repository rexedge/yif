import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteEvent } from "./actions";

export const metadata: Metadata = { title: "Admin — Events | YIF" };

const STATUS_STYLE = {
  Upcoming: "bg-[#5dade2]/12 text-[#5dade2] border-[#5dade2]/25",
  Past: "bg-white/6 text-white/40 border-white/12",
};

function formatNaira(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}k`;
  return `₦${amount.toLocaleString()}`;
}

export default async function AdminEventsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const now = new Date();
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
    include: {
      tickets: { select: { amountPaid: true } },
    },
  });

  const upcomingCount = events.filter((e) => e.date > now).length;
  const totalTickets = events.reduce((sum, e) => sum + e.tickets.length, 0);
  const totalRevenue = events.reduce(
    (sum, e) =>
      sum + e.tickets.reduce((s, t) => s + Number(t.amountPaid ?? 0), 0),
    0,
  );

  const STATS = [
    { label: "Total Tickets Sold", value: String(totalTickets) },
    { label: "Total Event Revenue", value: formatNaira(totalRevenue) },
    { label: "Upcoming Events", value: String(upcomingCount) },
    { label: "Events Total", value: String(events.length) },
  ];

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-terracotta)] mb-1">
            Admin Panel
          </p>
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Events
          </h1>
          <p className="mt-1 text-white/40 text-sm">
            {events.length} events on record
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="rounded-xl bg-[var(--yif-gold)] text-[var(--yif-navy-dark)] px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          + Create Event
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-white/5 border border-white/8 px-5 py-4"
          >
            <p className="text-xs text-white/40 font-medium uppercase tracking-wide mb-1.5">
              {s.label}
            </p>
            <p className="font-display text-2xl font-bold text-white">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/5 border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-5 py-3.5 text-xs text-white/40 font-medium uppercase tracking-wide">
                  Event
                </th>
                <th className="text-left px-4 py-3.5 text-xs text-white/40 font-medium uppercase tracking-wide hidden sm:table-cell">
                  Date
                </th>
                <th className="text-left px-4 py-3.5 text-xs text-white/40 font-medium uppercase tracking-wide">
                  Tickets
                </th>
                <th className="text-left px-4 py-3.5 text-xs text-white/40 font-medium uppercase tracking-wide hidden md:table-cell">
                  Revenue
                </th>
                <th className="text-left px-4 py-3.5 text-xs text-white/40 font-medium uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-white/30 text-sm"
                  >
                    No events found.
                  </td>
                </tr>
              ) : (
                events.map((e) => {
                  const ticketCount = e.tickets.length;
                  const revenue = e.tickets.reduce(
                    (s, t) => s + Number(t.amountPaid ?? 0),
                    0,
                  );
                  const statusLabel = e.date > now ? "Upcoming" : "Past";
                  return (
                    <tr
                      key={e.id}
                      className="hover:bg-white/3 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="text-white/80 font-medium text-sm">
                          {e.title}
                        </p>
                        <p className="text-white/30 text-xs mt-0.5">
                          {e.location ?? "—"}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-white/40 text-xs hidden sm:table-cell whitespace-nowrap">
                        {e.date.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-white/50">
                          {ticketCount} sold
                        </span>
                      </td>
                      <td className="px-4 py-4 text-white/60 text-sm font-medium hidden md:table-cell">
                        {formatNaira(revenue)}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLE[statusLabel]}`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/events/${e.slug}`}
                            target="_blank"
                            className="text-xs text-[var(--yif-gold)]/70 hover:text-[var(--yif-gold)] transition-colors px-2 py-1 rounded hover:bg-[var(--yif-gold)]/8"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/events/${e.id}/edit`}
                            className="text-xs text-white/50 hover:text-white/80 transition-colors px-2 py-1 rounded hover:bg-white/5"
                          >
                            Edit
                          </Link>
                          <form
                            action={async () => {
                              "use server";
                              await deleteEvent(e.id);
                            }}
                            className="inline"
                          >
                            <button
                              type="submit"
                              className="text-xs text-[var(--yif-terracotta)]/40 hover:text-[var(--yif-terracotta)]/80 transition-colors px-2 py-1 rounded hover:bg-[var(--yif-terracotta)]/8"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
