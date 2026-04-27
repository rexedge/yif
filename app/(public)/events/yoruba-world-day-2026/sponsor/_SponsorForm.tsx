"use client";

import { useActionState } from "react";
import { submitSponsorshipInquiry, type SponsorState } from "./actions";
import { YWD_SPONSORSHIP_TIERS } from "@/lib/yoruba-world-day-2026";

const initial: SponsorState = {};

export default function SponsorForm() {
  const [state, action, pending] = useActionState(
    submitSponsorshipInquiry,
    initial,
  );

  if (state.ok) {
    return (
      <div className="rounded-2xl bg-[var(--yif-navy-dark)] p-8 text-center text-white">
        <div className="font-serif text-3xl text-[var(--yif-gold)]">
          Thank you.
        </div>
        <p className="mt-3 text-white/80">
          Your sponsorship inquiry has been received. The YIF team will be in
          touch within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Organisation *" name="organisation" required />
        <Field label="Contact Name *" name="contactName" required />
        <Field label="Email *" name="contactEmail" type="email" required />
        <Field label="Phone" name="contactPhone" type="tel" />
        <Field label="Country" name="country" />
        <label className="block">
          <span className="text-xs font-semibold tracking-wider text-[var(--yif-charcoal)]/70 uppercase">
            Sponsorship Tier
          </span>
          <select
            name="tier"
            defaultValue=""
            className="mt-2 block w-full rounded-lg border border-black/15 bg-white px-4 py-2.5 text-sm focus:border-[var(--yif-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--yif-gold)]/30"
          >
            <option value="">Open to discussion</option>
            {YWD_SPONSORSHIP_TIERS.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name} — ${t.amountUsd.toLocaleString("en-US")}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-semibold tracking-wider text-[var(--yif-charcoal)]/70 uppercase">
          Message *
        </span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell us about your brand, goals, and any specific activations you have in mind."
          className="mt-2 block w-full rounded-lg border border-black/15 bg-white px-4 py-2.5 text-sm focus:border-[var(--yif-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--yif-gold)]/30"
        />
      </label>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[var(--yif-gold)] px-6 py-4 text-sm font-bold tracking-wider text-[var(--yif-navy-dark)] uppercase shadow-lg shadow-[var(--yif-gold)]/30 transition hover:bg-[var(--yif-gold-light)] disabled:opacity-60"
      >
        {pending ? "Sending…" : "Submit Sponsorship Inquiry"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold tracking-wider text-[var(--yif-charcoal)]/70 uppercase">
        {label}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="mt-2 block w-full rounded-lg border border-black/15 bg-white px-4 py-2.5 text-sm focus:border-[var(--yif-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--yif-gold)]/30"
      />
    </label>
  );
}
