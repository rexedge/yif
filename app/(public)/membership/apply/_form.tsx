"use client";

import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { startMembershipApplication, type ApplyState } from "./actions";
import type { TierWithPrices } from "@/lib/membership";

type CountryOption = { name: string; continent: string };

const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

const STEPS = [
  { num: "01", label: "Choose Tier" },
  { num: "02", label: "Your Details" },
  { num: "03", label: "Payment" },
  { num: "04", label: "Activated" },
];

const initialState: ApplyState = {};

function formatPrice(amount: number, currency: string): string {
  const sym = CURRENCY_SYMBOLS[currency] ?? currency;
  return `${sym}${amount.toLocaleString()}`;
}

export function MembershipApplyForm({
  isLoggedIn,
  tiers,
}: {
  isLoggedIn: boolean;
  tiers: TierWithPrices[];
}) {
  const searchParams = useSearchParams();
  const tierParam = searchParams.get("tier") ?? tiers[0]?.slug ?? "";
  const currencyParam = searchParams.get("currency") ?? "NGN";

  const validTierSlug = tiers.find((t) => t.slug === tierParam)
    ? tierParam
    : (tiers[0]?.slug ?? "");
  const validCurrency = ["NGN", "USD", "GBP", "EUR"].includes(currencyParam)
    ? currencyParam
    : "NGN";

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTierSlug, setSelectedTierSlug] = useState(validTierSlug);
  const [selectedCurrency] = useState(validCurrency);

  // Cascading location state
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [country, setCountry] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [stateProvince, setStateProvince] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [cityDistrict, setCityDistrict] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/locations/countries")
      .then((r) => r.json())
      .then((list: CountryOption[]) => { if (!cancelled) setCountries(list); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!country) { setStates([]); return; }
    let cancelled = false;
    fetch(`/api/locations/states?country=${encodeURIComponent(country)}`)
      .then((r) => r.json())
      .then((list: string[]) => { if (!cancelled) setStates(list); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [country]);

  useEffect(() => {
    if (!country || !stateProvince) { setCities([]); return; }
    let cancelled = false;
    fetch(
      `/api/locations/cities?country=${encodeURIComponent(country)}&state=${encodeURIComponent(stateProvince)}`,
    )
      .then((r) => r.json())
      .then((list: string[]) => { if (!cancelled) setCities(list); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [country, stateProvince]);

  const [state, formAction, isPending] = useActionState(
    startMembershipApplication,
    initialState,
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const tier = tiers.find((t) => t.slug === selectedTierSlug) ?? tiers[0];
  const priceEntry = tier?.prices.find((p) => p.currency === selectedCurrency);
  const priceDisplay = priceEntry
    ? formatPrice(priceEntry.amount, selectedCurrency)
    : "—";

  const isInternational = selectedCurrency !== "NGN";

  if (!tier) {
    return (
      <div className="min-h-screen bg-[var(--yif-cream)] flex items-center justify-center">
        <p className="text-[var(--muted)]">No membership tiers are available right now.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--yif-cream)] py-16 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <Link
            href="/membership"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] hover:text-[var(--yif-gold-light)] mb-4"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Membership
          </Link>
          <h1 className="font-display text-4xl font-semibold text-[var(--yif-navy)]">
            Join YIF
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Complete the steps below to become a member.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {STEPS.map((s, i) => {
            const isCompleted = step === 2 && i === 0;
            const isActive = (step === 1 && i === 0) || (step === 2 && i === 1);
            return (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isCompleted ? "bg-[var(--yif-green)] text-white" : isActive ? "bg-[var(--yif-navy)] text-white" : "bg-[var(--yif-cream-dark)] text-[var(--muted)]"}`}>
                    {isCompleted ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : s.num}
                  </div>
                  <span className={`mt-1 text-[10px] font-semibold uppercase tracking-wide hidden sm:block ${isActive ? "text-[var(--yif-navy)]" : "text-[var(--muted)]"}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-12 sm:w-20 h-px mx-1 ${isCompleted ? "bg-[var(--yif-green)]" : "bg-[var(--yif-cream-dark)]"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step 1: Choose Tier */}
        {step === 1 && (
          <div className="animate-fade-up">
            <h2 className="font-display text-2xl font-semibold text-[var(--yif-navy)] mb-2 text-center">
              Choose Your Membership Tier
            </h2>
            {isInternational && (
              <p className="text-center text-xs text-[var(--muted)] mb-6">
                Prices shown in {selectedCurrency} · Payment via Stripe
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {tiers.map((t) => {
                const p = t.prices.find((pr) => pr.currency === selectedCurrency);
                const displayPrice = p ? formatPrice(p.amount, selectedCurrency) : "—";
                const color = t.color ?? "#888888";
                return (
                  <button
                    key={t.slug}
                    type="button"
                    onClick={() => setSelectedTierSlug(t.slug)}
                    className={`rounded-2xl border-2 p-5 text-left transition-all ${selectedTierSlug === t.slug ? "border-[var(--yif-navy)] bg-white shadow-md" : "border-[var(--yif-cream-dark)] bg-white/60 hover:border-[var(--yif-navy)]/40"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold uppercase tracking-wide" style={{ color }}>
                        {t.name}
                      </span>
                      <div className={`w-4 h-4 rounded-full border-2 transition-colors ${selectedTierSlug === t.slug ? "border-[var(--yif-navy)] bg-[var(--yif-navy)]" : "border-[var(--yif-cream-dark)]"}`} />
                    </div>
                    <p className="font-display text-2xl font-bold text-[var(--yif-navy)]">
                      {displayPrice}
                      <span className="text-sm font-sans font-normal text-[var(--muted)]"> /year</span>
                    </p>
                    {t.description && (
                      <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed">
                        {t.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full rounded-xl bg-[var(--yif-navy)] py-3.5 text-sm font-semibold text-white hover:bg-[var(--yif-navy-light)] transition-colors"
            >
              Continue with {tier.name} — {priceDisplay}/year
            </button>
          </div>
        )}

        {/* Step 2: Details + Payment */}
        {step === 2 && (
          <div className="animate-fade-up">
            {/* Selected Tier Summary */}
            <div
              className="rounded-xl border p-4 mb-6 flex items-center justify-between"
              style={{ borderColor: `${tier.color ?? "#888"}40`, backgroundColor: `${tier.color ?? "#888"}08` }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: tier.color ?? "#888" }}>
                  Selected Tier
                </p>
                <p className="font-display text-xl font-bold text-[var(--yif-navy)]">
                  {tier.name} — {priceDisplay}/year
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--yif-navy)] underline"
              >
                Change
              </button>
            </div>

            <form action={formAction}>
              <input type="hidden" name="tierSlug" value={selectedTierSlug} />
              <input type="hidden" name="currency" value={selectedCurrency} />

              <h2 className="font-display text-2xl font-semibold text-[var(--yif-navy)] mb-5">
                Complete Your Application
              </h2>

              {state.error && (
                <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {state.error}
                </div>
              )}

              {!isLoggedIn && (
                <div className="mb-6 rounded-xl border border-[var(--yif-cream-dark)] bg-white p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-semibold text-[var(--yif-navy)]">
                      Create your account
                    </h3>
                    <Link href="/login?from=/membership/apply" className="text-xs font-semibold text-[var(--yif-gold)] hover:text-[var(--yif-gold-light)] underline">
                      Already a member? Log in
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {[
                      { id: "fullName", label: "Full Name", type: "text", placeholder: "Adebayo Ogundimu", autoComplete: "name" },
                      { id: "email", label: "Email", type: "email", placeholder: "you@example.com", autoComplete: "email" },
                      { id: "password", label: "Password", type: "password", placeholder: "At least 8 characters", autoComplete: "new-password" },
                    ].map((field) => (
                      <div key={field.id}>
                        <label htmlFor={field.id} className="block text-sm font-semibold text-[var(--yif-navy)] mb-1.5">
                          {field.label} <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={field.id}
                          name={field.id}
                          type={field.type}
                          autoComplete={field.autoComplete}
                          placeholder={field.placeholder}
                          {...(field.type === "password" ? { minLength: 8 } : {})}
                          className="w-full rounded-lg border border-[var(--yif-cream-dark)] bg-white px-4 py-2.5 text-sm text-[var(--yif-charcoal)] placeholder-[var(--muted)] focus:border-[var(--yif-navy)] focus:outline-none focus:ring-1 focus:ring-[var(--yif-navy)]"
                        />
                        {state.fieldErrors?.[field.id] && (
                          <p className="mt-1 text-xs text-red-600">{state.fieldErrors[field.id]![0]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-6">
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-[var(--yif-navy)] mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 234 567 8901"
                    className="w-full rounded-lg border border-[var(--yif-cream-dark)] bg-white px-4 py-2.5 text-sm text-[var(--yif-charcoal)] placeholder-[var(--muted)] focus:border-[var(--yif-navy)] focus:outline-none focus:ring-1 focus:ring-[var(--yif-navy)]"
                  />
                  {state.fieldErrors?.phone && (
                    <p className="mt-1 text-xs text-red-600">{state.fieldErrors.phone[0]}</p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="country" className="block text-sm font-semibold text-[var(--yif-navy)] mb-1.5">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={country}
                    onChange={(e) => { setCountry(e.target.value); setStateProvince(""); setCityDistrict(""); }}
                    className="w-full rounded-lg border border-[var(--yif-cream-dark)] bg-white px-4 py-2.5 text-sm text-[var(--yif-charcoal)] focus:border-[var(--yif-navy)] focus:outline-none focus:ring-1 focus:ring-[var(--yif-navy)]"
                  >
                    <option value="">{countries.length === 0 ? "Loading…" : "Select country"}</option>
                    {countries.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  {state.fieldErrors?.country && (
                    <p className="mt-1 text-xs text-red-600">{state.fieldErrors.country[0]}</p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label htmlFor="stateProvince" className="block text-sm font-semibold text-[var(--yif-navy)] mb-1.5">
                    State / Province
                  </label>
                  <select
                    id="stateProvince"
                    name="stateProvince"
                    value={stateProvince}
                    disabled={!country || states.length === 0}
                    onChange={(e) => { setStateProvince(e.target.value); setCityDistrict(""); }}
                    className="w-full rounded-lg border border-[var(--yif-cream-dark)] bg-white px-4 py-2.5 text-sm text-[var(--yif-charcoal)] focus:border-[var(--yif-navy)] focus:outline-none focus:ring-1 focus:ring-[var(--yif-navy)] disabled:opacity-60"
                  >
                    <option value="">{!country ? "Select country first" : states.length === 0 ? "No states available" : "Select state / province"}</option>
                    {states.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label htmlFor="cityDistrict" className="block text-sm font-semibold text-[var(--yif-navy)] mb-1.5">
                    City / District <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="cityDistrict"
                    name="cityDistrict"
                    value={cityDistrict}
                    disabled={!stateProvince || cities.length === 0}
                    onChange={(e) => setCityDistrict(e.target.value)}
                    className="w-full rounded-lg border border-[var(--yif-cream-dark)] bg-white px-4 py-2.5 text-sm text-[var(--yif-charcoal)] focus:border-[var(--yif-navy)] focus:outline-none focus:ring-1 focus:ring-[var(--yif-navy)] disabled:opacity-60"
                  >
                    <option value="">{!stateProvince ? "Select state first" : cities.length === 0 ? "No cities available" : "Select city / district"}</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {state.fieldErrors?.cityDistrict && (
                    <p className="mt-1 text-xs text-red-600">{state.fieldErrors.cityDistrict[0]}</p>
                  )}
                </div>
              </div>

              {/* Payment summary */}
              <div className="rounded-xl bg-[var(--yif-navy)] text-white p-5 mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-3">
                  Order Summary
                </p>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-white/80">{tier.name} Membership (1 year)</span>
                  <span className="font-semibold">{priceDisplay}</span>
                </div>
                <div className="border-t border-white/20 mt-3 pt-3 flex items-center justify-between">
                  <span className="font-semibold">Total Due</span>
                  <span className="font-display text-xl font-bold text-[var(--yif-gold)]">
                    {priceDisplay}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[var(--muted)] text-center mb-5">
                {isInternational
                  ? `You will be redirected to Stripe to complete payment in ${selectedCurrency}.`
                  : "You will be redirected to Paystack to complete payment securely."}{" "}
                Your membership activates immediately after successful payment.
              </p>

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-xl bg-[var(--yif-gold)] py-3.5 text-sm font-bold text-[var(--yif-navy-dark)] hover:bg-[var(--yif-gold-light)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? "Redirecting to payment…" : `Pay ${priceDisplay} Securely`}
              </button>

              <p className="mt-3 text-center text-xs text-[var(--muted)]">
                Secured by{" "}
                <span className="font-semibold text-[var(--yif-charcoal)]">
                  {isInternational ? "Stripe" : "Paystack"}
                </span>{" "}
                · Cancel anytime
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
