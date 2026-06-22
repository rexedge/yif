"use client";

import Link from "next/link";
import { useState } from "react";

type Tier = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  color: string | null;
  badge: string | null;
  prices: { currency: string; amount: number }[];
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

const CURRENCY_LABELS: Record<string, string> = {
  NGN: "₦ NGN",
  USD: "$ USD",
  GBP: "£ GBP",
  EUR: "€ EUR",
};

function formatPrice(amount: number, currency: string): string {
  return `${CURRENCY_SYMBOLS[currency] ?? currency}${amount.toLocaleString()}`;
}

export function TierCards({ tiers }: { tiers: Tier[] }) {
  const availableCurrencies = Array.from(
    new Set(tiers.flatMap((t) => t.prices.map((p) => p.currency))),
  ).sort((a, b) => ["NGN", "USD", "GBP", "EUR"].indexOf(a) - ["NGN", "USD", "GBP", "EUR"].indexOf(b));

  const [selectedCurrency, setSelectedCurrency] = useState(
    availableCurrencies[0] ?? "NGN",
  );

  return (
    <div>
      {/* Currency toggle */}
      {availableCurrencies.length > 1 && (
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl bg-white shadow-sm border border-[var(--yif-cream-dark)] p-1 gap-1">
            {availableCurrencies.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCurrency(c)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  selectedCurrency === c
                    ? "bg-[var(--yif-navy)] text-white shadow-sm"
                    : "text-[var(--yif-charcoal)] hover:bg-[var(--yif-cream)]"
                }`}
              >
                {CURRENCY_LABELS[c] ?? c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tier cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier) => {
          const color = tier.color ?? "#888888";
          const priceEntry = tier.prices.find((p) => p.currency === selectedCurrency);
          const price = priceEntry
            ? formatPrice(priceEntry.amount, selectedCurrency)
            : "—";

          return (
            <div
              key={tier.slug}
              className="relative rounded-2xl bg-white border flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              style={{ borderColor: `color-mix(in srgb, ${color} 25%, #e5e7eb)` }}
            >
              {tier.badge && (
                <div
                  className="absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-xl"
                  style={{ backgroundColor: color }}
                >
                  {tier.badge}
                </div>
              )}
              <div className="px-5 pt-6 pb-4">
                <p className="font-display text-lg font-semibold" style={{ color }}>
                  {tier.name}
                </p>
                <p className="font-display text-3xl font-bold text-[var(--yif-navy)] mt-1">
                  {price}
                  <span className="text-sm font-sans font-normal text-[var(--muted)]">
                    /year
                  </span>
                </p>
                <p className="text-xs text-[var(--muted)] mt-2">{tier.description}</p>
              </div>
              <div className="px-5 pb-5 mt-auto">
                <Link
                  href={`/membership/apply?tier=${tier.slug}&currency=${selectedCurrency}`}
                  className="block w-full text-center rounded-xl py-2.5 text-sm font-semibold transition-colors text-white"
                  style={{ backgroundColor: color }}
                >
                  Join as {tier.name}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCurrency !== "NGN" && (
        <p className="mt-4 text-center text-xs text-[var(--muted)]">
          International payments processed securely via Stripe. NGN payments via Paystack.
        </p>
      )}
    </div>
  );
}
