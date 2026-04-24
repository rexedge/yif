import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditEventForm } from "../EditEventForm";
import { deleteEvent } from "../../actions";

export const metadata: Metadata = { title: "Edit Event | Admin — YIF" };

type Props = { params: Promise<{ id: string }> };

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { tiers: { orderBy: { price: "asc" } } },
  });
  if (!event) notFound();

  async function handleDelete() {
    "use server";
    await deleteEvent(id);
  }

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <a
              href="/admin/events"
              className="text-xs text-white/40 hover:text-white/60 transition-colors mb-4 inline-flex items-center gap-1.5"
            >
              ← Back to Events
            </a>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-terracotta)] mb-1 mt-4">
              Admin Panel
            </p>
            <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
              Edit Event
            </h1>
            <p className="mt-1 text-white/40 text-sm truncate max-w-[40ch]">
              {event.title}
            </p>
          </div>

          <form action={handleDelete}>
            <button
              type="submit"
              className="rounded-xl border border-[var(--yif-terracotta)]/30 text-[var(--yif-terracotta)]/70 hover:border-[var(--yif-terracotta)]/60 hover:text-[var(--yif-terracotta)] px-4 py-2 text-sm transition-colors"
              onClick={(e) => {
                if (!confirm("Delete this event permanently?"))
                  e.preventDefault();
              }}
            >
              Delete Event
            </button>
          </form>
        </div>

        <EditEventForm event={event} tiers={event.tiers} />
      </div>
    </div>
  );
}
