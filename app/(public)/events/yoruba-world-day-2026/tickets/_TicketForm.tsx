"use client";

import { useActionState, useState } from "react";
import { buyDelegatePass, type TicketCheckoutState } from "./actions";
import { formatCurrency } from "@/lib/currency";
import { YWD_EVENT } from "@/lib/yoruba-world-day-2026";

const initialState: TicketCheckoutState = {};

export default function TicketForm() {
  const [state, action, pending] = useActionState(
    buyDelegatePass,
    initialState,
  );
  const [qty, setQty] = useState(1);
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");

  const totalNgn = YWD_EVENT.ticketPriceNgn * qty;
  const totalUsd = YWD_EVENT.ticketPriceUsd * qty;

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="currency" value={currency} />

      {/* Currency switcher */}
      <fieldset>
        <legend className="text-xs font-semibold tracking-wider text-[var(--yif-charcoal)]/70 uppercase">
          Pay in
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label
            className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition ${
              currency === "NGN"
                ? "border-[var(--yif-gold)] bg-[var(--yif-gold)]/10"
                : "border-black/10 bg-white"
            }`}
          >
            <input
              type="radio"
              name="ccy"
              value="NGN"
              checked={currency === "NGN"}
              onChange={() => setCurrency("NGN")}
              className="sr-only"
            />
            <span className="text-sm font-bold text-[var(--yif-navy-dark)]">
              Nigerian Naira
            </span>
            <span className="text-xs text-[var(--yif-charcoal)]/70">
              Paystack · Cards · Bank · USSD · Transfer
            </span>
          </label>

          <label
            className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition ${
              currency === "USD"
                ? "border-[var(--yif-gold)] bg-[var(--yif-gold)]/10"
                : "border-black/10 bg-white"
            }`}
          >
            <input
              type="radio"
              name="ccy"
              value="USD"
              checked={currency === "USD"}
              onChange={() => setCurrency("USD")}
              className="sr-only"
            />
            <span className="text-sm font-bold text-[var(--yif-navy-dark)]">
              US Dollar
            </span>
            <span className="text-xs text-[var(--yif-charcoal)]/70">
              Stripe · Cards · Apple Pay · Google Pay
            </span>
          </label>
        </div>
      </fieldset>

      {/* Personal */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold tracking-wider text-[var(--yif-charcoal)]/70 uppercase">
            Full Name
          </span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            className="mt-2 block w-full rounded-lg border border-black/15 bg-white px-4 py-2.5 text-sm focus:border-[var(--yif-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--yif-gold)]/30"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold tracking-wider text-[var(--yif-charcoal)]/70 uppercase">
            Email
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="mt-2 block w-full rounded-lg border border-black/15 bg-white px-4 py-2.5 text-sm focus:border-[var(--yif-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--yif-gold)]/30"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold tracking-wider text-[var(--yif-charcoal)]/70 uppercase">
            Phone
          </span>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            className="mt-2 block w-full rounded-lg border border-black/15 bg-white px-4 py-2.5 text-sm focus:border-[var(--yif-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--yif-gold)]/30"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold tracking-wider text-[var(--yif-charcoal)]/70 uppercase">
            Country
          </span>
          <input
            type="text"
            name="country"
            autoComplete="country-name"
            className="mt-2 block w-full rounded-lg border border-black/15 bg-white px-4 py-2.5 text-sm focus:border-[var(--yif-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--yif-gold)]/30"
          />
        </label>
      </div>

      {/* Quantity */}
      <label className="block">
        <span className="text-xs font-semibold tracking-wider text-[var(--yif-charcoal)]/70 uppercase">
          Number of Delegate Passes
        </span>
        <div className="mt-2 inline-flex items-center rounded-lg border border-black/15 bg-white">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-4 py-2.5 text-lg text-[var(--yif-navy-dark)] hover:bg-black/5"
            aria-label="Decrease"
          >
            −
          </button>
          <input
            type="number"
            name="qty"
            min={1}
            max={20}
            value={qty}
            onChange={(e) =>
              setQty(
                Math.max(1, Math.min(20, parseInt(e.target.value || "1", 10))),
              )
            }
            className="w-16 border-0 bg-transparent text-center text-sm font-semibold focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            className="px-4 py-2.5 text-lg text-[var(--yif-navy-dark)] hover:bg-black/5"
            aria-label="Increase"
          >
            +
          </button>
        </div>
      </label>

      {/* Total */}
      <div className="flex items-center justify-between rounded-2xl bg-[var(--yif-navy-dark)] p-5 text-white">
        <div>
          <div className="text-xs tracking-wider text-[var(--yif-gold)] uppercase">
            Order Total
          </div>
          <div className="mt-1 text-xs text-white/60">
            {qty} × ${YWD_EVENT.ticketPriceUsd} delegate pass
          </div>
        </div>
        <div className="text-right">
          <div className="font-serif text-2xl text-[var(--yif-gold)]">
            {currency === "NGN"
              ? formatCurrency(totalNgn, "NGN")
              : formatCurrency(totalUsd, "USD")}
          </div>
          <div className="text-xs text-white/60">
            {currency === "NGN"
              ? `≈ ${formatCurrency(totalUsd, "USD")}`
              : `≈ ${formatCurrency(totalNgn, "NGN")}`}
          </div>
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="block w-full rounded-full bg-[var(--yif-gold)] px-6 py-4 text-sm font-bold tracking-wider text-[var(--yif-navy-dark)] uppercase shadow-lg shadow-[var(--yif-gold)]/30 transition hover:bg-[var(--yif-gold-light)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending
          ? `Redirecting to ${currency === "NGN" ? "Paystack" : "Stripe"}…`
          : currency === "NGN"
            ? `Pay ${formatCurrency(totalNgn, "NGN")} with Paystack`
            : `Pay ${formatCurrency(totalUsd, "USD")} with Stripe`}
      </button>

      <p className="text-center text-xs text-[var(--yif-charcoal)]/60">
        Secure checkout via {currency === "NGN" ? "Paystack" : "Stripe"}.
        Confirmation email sent on success.
      </p>
    </form>
  );
}
