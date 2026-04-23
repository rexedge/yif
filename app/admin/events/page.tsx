import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Events | YIF",
};

const EVENTS = [
  {
    name: "YIF Cultural Gala 2026",
    date: "Jun 14, 2026",
    location: "Eko Hotel, Lagos",
    sold: 182,
    total: 250,
    revenue: "₦2,730,000",
    status: "Upcoming",
  },
  {
    name: "Annual Leadership Summit",
    date: "Aug 22, 2026",
    location: "Transcorp Hilton, Abuja",
    sold: 45,
    total: 300,
    revenue: "₦1,350,000",
    status: "Upcoming",
  },
  {
    name: "YIF Diaspora Homecoming 2025",
    date: "Dec 6, 2025",
    location: "Oriental Hotel, Lagos",
    sold: 310,
    total: 310,
    revenue: "₦4,650,000",
    status: "Past",
  },
  {
    name: "Scholarship Award Ceremony 2025",
    date: "Sep 18, 2025",
    location: "University of Lagos",
    sold: 200,
    total: 200,
    revenue: "₦0",
    status: "Past",
  },
  {
    name: "Karo-Ojire Youth Camp 2025",
    date: "Jul 4, 2025",
    location: "Ibadan Convention Centre",
    sold: 88,
    total: 100,
    revenue: "₦528,000",
    status: "Past",
  },
];

const STATUS = {
  Upcoming: "bg-[#5dade2]/12 text-[#5dade2] border-[#5dade2]/25",
  Past: "bg-white/6 text-white/40 border-white/12",
};

const STATS = [
  { label: "Total Tickets Sold", value: "825" },
  { label: "Total Event Revenue", value: "₦9.26M" },
  { label: "Upcoming Events", value: "2" },
  { label: "Events This Year", value: "5" },
];

export default function AdminEventsPage() {
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
            {EVENTS.length} events on record
          </p>
        </div>
        <button className="rounded-xl bg-[var(--yif-gold)] text-[var(--yif-navy-dark)] px-5 py-2.5 text-sm font-semibold hover:bg-[var(--yif-gold-light)] transition-colors">
          + Create Event
        </button>
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
              {EVENTS.map((e) => {
                const pct = Math.round((e.sold / e.total) * 100);
                return (
                  <tr
                    key={e.name}
                    className="hover:bg-white/3 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="text-white/80 font-medium text-sm">
                        {e.name}
                      </p>
                      <p className="text-white/30 text-xs mt-0.5">
                        {e.location}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-white/40 text-xs hidden sm:table-cell whitespace-nowrap">
                      {e.date}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-white/8 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[var(--yif-gold)]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/50 whitespace-nowrap">
                          {e.sold}/{e.total}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-white/60 text-sm font-medium hidden md:table-cell">
                      {e.revenue}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS[e.status as keyof typeof STATUS]}`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
