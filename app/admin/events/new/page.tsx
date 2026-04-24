"use client";

import { useRef, useState } from "react";
import { createEvent } from "../actions";

const CATEGORIES = [
  "Awards & Recognition",
  "Summit",
  "Workshop",
  "Gala",
  "Cultural",
  "Conference",
  "Other",
];

type Tier = {
  name: string;
  price: string;
  description: string;
  capacity: string;
};

export default function NewEventPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [tiers, setTiers] = useState<Tier[]>([
    { name: "General Admission", price: "", description: "", capacity: "100" },
  ]);

  function addTier() {
    setTiers((prev) => [
      ...prev,
      { name: "", price: "", description: "", capacity: "50" },
    ]);
  }

  function removeTier(index: number) {
    setTiers((prev) => prev.filter((_, i) => i !== index));
  }

  function updateTier(index: number, field: keyof Tier, value: string) {
    setTiers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const tiersData = tiers.map((t) => ({
      name: t.name,
      price: parseFloat(t.price) || 0,
      description: t.description || undefined,
      capacity: parseInt(t.capacity) || 50,
    }));
    fd.set("tiers", JSON.stringify(tiersData));
    await createEvent(fd);
    setPending(false);
  }

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
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
            Create Event
          </h1>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="rounded-2xl bg-white/5 border border-white/8 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide">
              Basic Information
            </h2>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Event Title *
              </label>
              <input
                name="title"
                required
                placeholder="e.g. YIF Annual Awards 2026"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-gold)]/40 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--yif-gold)]/40 transition-colors appearance-none"
                >
                  <option value="">Select category…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">
                  Tagline
                </label>
                <input
                  name="tagline"
                  placeholder="Short subtitle"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-gold)]/40 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Full event description…"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-gold)]/40 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Cover Image URL
              </label>
              <input
                name="imageUrl"
                type="url"
                placeholder="https://…"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-gold)]/40 transition-colors"
              />
            </div>
          </div>

          {/* Date & Location */}
          <div className="rounded-2xl bg-white/5 border border-white/8 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide">
              Date & Location
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">
                  Start Date *
                </label>
                <input
                  name="date"
                  type="datetime-local"
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--yif-gold)]/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">
                  End Date
                </label>
                <input
                  name="endDate"
                  type="datetime-local"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--yif-gold)]/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">
                  Display Time
                </label>
                <input
                  name="time"
                  placeholder="e.g. 10:00 AM WAT"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-gold)]/40 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">
                  Venue Name
                </label>
                <input
                  name="location"
                  placeholder="e.g. Eko Hotels & Suites"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-gold)]/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">
                  Country
                </label>
                <input
                  name="country"
                  placeholder="e.g. Nigeria"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-gold)]/40 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Full Address
              </label>
              <input
                name="address"
                placeholder="Street, city…"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-gold)]/40 transition-colors"
              />
            </div>
          </div>

          {/* Ticket Tiers */}
          <div className="rounded-2xl bg-white/5 border border-white/8 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide">
                Ticket Tiers
              </h2>
              <button
                type="button"
                onClick={addTier}
                className="text-xs text-[var(--yif-gold)] hover:text-[var(--yif-gold)]/80 transition-colors px-3 py-1.5 rounded-lg border border-[var(--yif-gold)]/20 hover:bg-[var(--yif-gold)]/8"
              >
                + Add Tier
              </button>
            </div>

            {tiers.map((tier, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/3 border border-white/6 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40 font-medium">
                    Tier {i + 1}
                  </span>
                  {tiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTier(i)}
                      className="text-xs text-[var(--yif-terracotta)]/60 hover:text-[var(--yif-terracotta)] transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs text-white/40 mb-1">
                      Name *
                    </label>
                    <input
                      value={tier.name}
                      onChange={(e) => updateTier(i, "name", e.target.value)}
                      placeholder="e.g. VIP"
                      className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-gold)]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1">
                      Price (₦)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={tier.price}
                      onChange={(e) => updateTier(i, "price", e.target.value)}
                      placeholder="0 for free"
                      className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-gold)]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={tier.capacity}
                      onChange={(e) =>
                        updateTier(i, "capacity", e.target.value)
                      }
                      className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-gold)]/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">
                    Description
                  </label>
                  <input
                    value={tier.description}
                    onChange={(e) =>
                      updateTier(i, "description", e.target.value)
                    }
                    placeholder="What's included…"
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-gold)]/30"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Publish */}
          <div className="rounded-2xl bg-white/5 border border-white/8 p-6">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-4">
              Visibility
            </h2>
            <div className="flex items-center gap-4">
              {[
                {
                  value: "false",
                  label: "Draft",
                  desc: "Not visible publicly",
                },
                {
                  value: "true",
                  label: "Published",
                  desc: "Visible on /events",
                },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="flex-1 cursor-pointer rounded-xl border border-white/10 px-4 py-3 hover:border-white/20 transition-colors has-[:checked]:border-[var(--yif-gold)]/40 has-[:checked]:bg-[var(--yif-gold)]/5"
                >
                  <input
                    type="radio"
                    name="isPublished"
                    value={opt.value}
                    defaultChecked={opt.value === "false"}
                    className="sr-only"
                  />
                  <p className="text-sm font-medium text-white">{opt.label}</p>
                  <p className="text-xs text-white/40 mt-0.5">{opt.desc}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-xl bg-[var(--yif-gold)] text-[var(--yif-navy-dark)] px-6 py-2.5 text-sm font-semibold hover:bg-[var(--yif-gold)]/90 transition-colors disabled:opacity-50"
            >
              {pending ? "Creating…" : "Create Event"}
            </button>
            <a
              href="/admin/events"
              className="text-sm text-white/40 hover:text-white/70 transition-colors px-4 py-2.5"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
