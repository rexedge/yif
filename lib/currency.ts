// lib/currency.ts — shared currency utilities (safe to import in both client and server code)

export type SupportedCurrency = "NGN" | "USD" | "EUR" | "GBP";

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  label: string;
  locale: string;
  /** Preset donation amounts in this currency */
  presets: number[];
  /** Minimum payment amount */
  min: number;
  /** Maximum payment amount (contact us above this) */
  max: number;
}

export const CURRENCIES: Record<SupportedCurrency, CurrencyConfig> = {
  NGN: {
    code: "NGN",
    symbol: "₦",
    label: "Naira",
    locale: "en-NG",
    presets: [5_000, 10_000, 25_000, 50_000],
    min: 100,
    max: 10_000_000,
  },
  USD: {
    code: "USD",
    symbol: "$",
    label: "Dollar",
    locale: "en-US",
    presets: [5, 10, 25, 50],
    min: 1,
    max: 10_000,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    label: "Euro",
    locale: "de-DE",
    presets: [5, 10, 25, 50],
    min: 1,
    max: 10_000,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    label: "Pound",
    locale: "en-GB",
    presets: [5, 10, 20, 50],
    min: 1,
    max: 10_000,
  },
};

export const SUPPORTED_CURRENCIES = Object.keys(
  CURRENCIES,
) as SupportedCurrency[];

export function isSupportedCurrency(c: string): c is SupportedCurrency {
  return SUPPORTED_CURRENCIES.includes(c as SupportedCurrency);
}

export function formatCurrency(
  amount: number,
  currency: SupportedCurrency,
): string {
  const { locale, code } = CURRENCIES[currency];
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    maximumFractionDigits: currency === "NGN" ? 0 : 2,
  }).format(amount);
}

/** All supported currencies use ×100 subunits (kobo / cents / pence) */
export const toSmallestUnit = (amount: number) => Math.round(amount * 100);

// ── FX ──────────────────────────────────────────────────────────────────────
// Manual rate used for displaying NGN equivalents of USD-priced products
// (sponsorships, international tickets). Update here when the rate moves
// materially. Last updated: 2026-04.
export const USD_TO_NGN = 1395;

/** Convert a USD amount to NGN using the manual rate above. */
export function usdToNgn(amountUsd: number): number {
  return Math.round(amountUsd * USD_TO_NGN);
}

/** Convert an NGN amount to USD using the manual rate above. */
export function ngnToUsd(amountNgn: number): number {
  return Math.round((amountNgn / USD_TO_NGN) * 100) / 100;
}
