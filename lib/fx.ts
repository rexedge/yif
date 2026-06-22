// lib/fx.ts — server-side foreign-exchange helper.
//
// Converts a payment amount in any supported currency into its USD equivalent,
// freezing the rate used at the moment of conversion. Live rates come from
// openexchangerates.org (free plan → base currency is always USD), cached
// in-memory with a TTL so we don't hammer the API. If the API is unavailable
// we fall back to a static table so a payment is never lost to an FX outage.

import type { SupportedCurrency } from "@/lib/currency";
import { USD_TO_NGN } from "@/lib/currency";

const ENDPOINT = "https://openexchangerates.org/api/latest.json";

// Cache live rates (relative to USD) for this long. Free plan updates hourly.
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Static fallback: units of currency per 1 USD. Used only when the live API
// fails. Derived from USD_TO_NGN and rough cross-rates; update if they drift.
const FALLBACK_RATES_PER_USD: Record<string, number> = {
  USD: 1,
  NGN: USD_TO_NGN,
  GBP: 0.79,
  EUR: 0.92,
};

type RatesPerUsd = Record<string, number>;

let cache: { rates: RatesPerUsd; fetchedAt: number } | null = null;

interface OxrResponse {
  base: string;
  rates: Record<string, number>;
}

/** Fetch (and cache) the latest rates relative to USD. Never throws. */
async function getRatesPerUsd(): Promise<{ rates: RatesPerUsd; live: boolean }> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return { rates: cache.rates, live: true };
  }

  const appId = process.env.OPENEXCHANGERATES_APP_ID;
  if (appId) {
    try {
      const url = `${ENDPOINT}?app_id=${appId}&symbols=NGN,USD,GBP,EUR`;
      const res = await fetch(url, {
        // cache at the fetch layer too; our in-memory cache is the primary one
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const data = (await res.json()) as OxrResponse;
        if (data.rates && typeof data.rates.NGN === "number") {
          cache = { rates: data.rates, fetchedAt: Date.now() };
          return { rates: data.rates, live: true };
        }
      } else {
        console.error("[fx] openexchangerates responded", res.status);
      }
    } catch (err) {
      console.error("[fx] live rate fetch failed:", err);
    }
  } else {
    console.warn("[fx] OPENEXCHANGERATES_APP_ID not set — using fallback rates");
  }

  return { rates: FALLBACK_RATES_PER_USD, live: false };
}

export interface UsdConversion {
  /** USD-equivalent of the input amount, floored to whole dollars. */
  baseAmount: number;
  /** USD per 1 unit of the source currency (1 for USD). */
  fxRate: number;
  /** Whether the rate came from the live API (false → static fallback). */
  live: boolean;
}

/**
 * Convert `amount` in `currency` to its USD equivalent.
 * The openexchangerates free plan is USD-based, so `rates[currency]` is already
 * "units of `currency` per 1 USD" — converting is a straight division:
 *   baseAmount = amount / rates[currency]
 * and the stored fxRate is "USD per 1 unit of currency" = 1 / rates[currency].
 * The base amount is floored to the nearest whole dollar (approximate by design).
 */
export async function convertToUsd(
  amount: number,
  currency: string,
): Promise<UsdConversion> {
  if (currency === "USD") {
    return { baseAmount: Math.floor(amount), fxRate: 1, live: true };
  }

  const { rates, live } = await getRatesPerUsd();
  const currencyPerUsd = rates[currency];

  if (!currencyPerUsd) {
    // Unknown currency or missing rate — fall back to USD_TO_NGN for NGN,
    // otherwise return amount unconverted with a flagged rate of 1.
    const fxRate = currency === "NGN" ? 1 / USD_TO_NGN : 1;
    return { baseAmount: Math.floor(amount * fxRate), fxRate, live: false };
  }

  const fxRate = 1 / currencyPerUsd;
  return { baseAmount: Math.floor(amount * fxRate), fxRate: round8(fxRate), live };
}

const round8 = (n: number) => Math.round(n * 1e8) / 1e8;

export type { SupportedCurrency };
