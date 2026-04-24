"use client";

import { useActionState, useEffect, useRef } from "react";
import { checkoutTickets, type CheckoutState } from "./actions";
import type { EventTicketTier } from "@/generated/prisma/client";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

const initial: CheckoutState = {};

interface Props {
  eventSlug: string;
  tiers: EventTicketTier[];
}

export default function TicketCheckout({ eventSlug, tiers }: Props) {
  const [state, action, pending] = useActionState(checkoutTickets, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [state.error]);

  return (
    <div
      id="tickets"
      className="rounded-2xl border border-[var(--yif-cream-dark)] bg-white p-6 shadow-sm sm:p-8"
    >
      <h2 className="mb-6 font-display text-2xl font-semibold text-[var(--yif-navy)]">
        Get Your Tickets
      </h2>

      {state.error && (
        <div
          role="alert"
          className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200"
        >
          {state.error}
        </div>
      )}

      <form ref={formRef} action={action} className="space-y-5">
        <input type="hidden" name="slug" value={eventSlug} />

        {/* Tier selector */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium text-[var(--yif-charcoal)]">
            Ticket Type
          </legend>
          <div className="space-y-2">
            {tiers.map((tier) => (
              <label
                key={tier.id}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--yif-cream-dark)] p-4 transition-colors has-[:checked]:border-[var(--yif-gold)] has-[:checked]:bg-[var(--yif-gold)]/5"
              >
                <input
                  type="radio"
                  name="tierId"
                  value={tier.id}
                  defaultChecked={tier.id === tiers[0]?.id}
                  className="mt-0.5 accent-[var(--yif-gold)]"
                  required
                />
                <span className="flex flex-1 flex-col">
                  <span className="font-semibold text-[var(--yif-navy)]">
                    {tier.name}
                    <span className="ml-2 font-bold text-[var(--yif-gold)]">
                      {formatCurrency(Number(tier.price))}
                    </span>
                  </span>
                  <span className="mt-0.5 text-xs text-[var(--muted)]">
                    {tier.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Quantity */}
        <div>
          <label
            htmlFor="qty"
            className="mb-1.5 block text-sm font-medium text-[var(--yif-charcoal)]"
          >
            Quantity
          </label>
          <select
            id="qty"
            name="qty"
            defaultValue="1"
            className="w-full rounded-lg border border-[var(--yif-cream-dark)] bg-white px-3 py-2.5 text-sm text-[var(--yif-charcoal)] focus:border-[var(--yif-gold)] focus:outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-[var(--yif-charcoal)]"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your full name"
            className="w-full rounded-lg border border-[var(--yif-cream-dark)] bg-white px-3 py-2.5 text-sm text-[var(--yif-charcoal)] placeholder-[var(--muted)] focus:border-[var(--yif-gold)] focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-[var(--yif-charcoal)]"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border border-[var(--yif-cream-dark)] bg-white px-3 py-2.5 text-sm text-[var(--yif-charcoal)] placeholder-[var(--muted)] focus:border-[var(--yif-gold)] focus:outline-none"
          />
          <p className="mt-1 text-xs text-[var(--muted)]">
            Your e-ticket and order confirmation will be sent here.
          </p>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-[var(--yif-gold)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--yif-gold-light)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Redirecting to Paystack…" : "Proceed to Payment →"}
        </button>

        <p className="text-center text-xs text-[var(--muted)]">
          Secured by Paystack · 256-bit SSL encryption
        </p>
      </form>
    </div>
  );
}
