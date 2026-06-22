"use client";

import { useState, useTransition, useActionState } from "react";
import {
  createTier,
  updateTier,
  archiveTier,
  restoreTier,
  updatePrices,
  type TierActionState,
} from "./actions";

type Tier = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  color: string | null;
  badge: string | null;
  sortOrder: number;
  isActive: boolean;
  prices: { currency: string; amount: number }[];
  memberCount: number;
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

function TierForm({
  tier,
  onDone,
  isNew,
}: {
  tier?: Tier;
  onDone: () => void;
  isNew?: boolean;
}) {
  const action = isNew
    ? createTier
    : updateTier.bind(null, tier!.id);

  const [state, formAction, pending] = useActionState<TierActionState, FormData>(
    action,
    {},
  );

  const [nameVal, setNameVal] = useState(tier?.name ?? "");
  const [slugVal, setSlugVal] = useState(tier?.slug ?? "");

  function autoSlug(n: string) {
    return n.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  if (state.success) {
    onDone();
    return null;
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="text-red-400 text-sm rounded-lg bg-red-500/10 px-3 py-2">
          {state.error}
        </p>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-white/50 mb-1">Name *</label>
          <input
            name="name"
            required
            value={nameVal}
            onChange={(e) => {
              setNameVal(e.target.value);
              if (isNew) setSlugVal(autoSlug(e.target.value));
            }}
            className="w-full rounded-lg bg-white/8 border border-white/10 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1">Slug * (URL key)</label>
          <input
            name="slug"
            required
            value={slugVal}
            onChange={(e) => setSlugVal(e.target.value)}
            className="w-full rounded-lg bg-white/8 border border-white/10 px-3 py-2 text-sm text-white font-mono"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs text-white/50 mb-1">Description</label>
        <input
          name="description"
          defaultValue={tier?.description ?? ""}
          className="w-full rounded-lg bg-white/8 border border-white/10 px-3 py-2 text-sm text-white"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-white/50 mb-1">Color (hex)</label>
          <div className="flex items-center gap-2">
            <input
              name="color"
              type="color"
              defaultValue={tier?.color ?? "#888888"}
              className="h-9 w-12 rounded cursor-pointer bg-transparent border border-white/10"
            />
            <input
              name="color"
              defaultValue={tier?.color ?? "#888888"}
              className="flex-1 rounded-lg bg-white/8 border border-white/10 px-3 py-2 text-sm text-white font-mono"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1">Badge label</label>
          <input
            name="badge"
            defaultValue={tier?.badge ?? ""}
            placeholder="e.g. Most Popular"
            className="w-full rounded-lg bg-white/8 border border-white/10 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1">Sort order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={tier?.sortOrder ?? 0}
            className="w-full rounded-lg bg-white/8 border border-white/10 px-3 py-2 text-sm text-white"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          id={`isActive-${tier?.id ?? "new"}`}
          defaultChecked={tier?.isActive ?? true}
          className="accent-[var(--yif-terracotta)]"
        />
        <label htmlFor={`isActive-${tier?.id ?? "new"}`} className="text-sm text-white/70">
          Active (visible on membership page)
        </label>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[var(--yif-terracotta)] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Saving…" : isNew ? "Create Tier" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg bg-white/8 border border-white/10 px-4 py-2 text-sm text-white/70 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function PriceGrid({
  tiers,
  currencies,
}: {
  tiers: Tier[];
  currencies: string[];
}) {
  const initialPrices: Record<string, Record<string, number>> = {};
  for (const t of tiers) {
    initialPrices[t.id] = {};
    for (const p of t.prices) {
      initialPrices[t.id][p.currency] = p.amount;
    }
  }

  const [prices, setPrices] = useState(initialPrices);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(tierId: string, currency: string, value: string) {
    setPrices((prev) => ({
      ...prev,
      [tierId]: { ...prev[tierId], [currency]: parseFloat(value) || 0 },
    }));
    setSaved(false);
  }

  function handleSave() {
    const payload = Object.entries(prices).flatMap(([tierId, currencyMap]) =>
      Object.entries(currencyMap).map(([currency, amount]) => ({
        tierId,
        currency,
        amount,
      })),
    );
    startTransition(async () => {
      const result = await updatePrices(payload);
      if (result.error) setError(result.error);
      else { setSaved(true); setError(null); }
    });
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/8 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-white">Price Grid</h2>
          <p className="text-xs text-white/40 mt-0.5">Annual membership fee per tier per currency</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-xs text-green-400">✓ Saved</span>}
          {error && <span className="text-xs text-red-400">{error}</span>}
          <button
            onClick={handleSave}
            disabled={isPending}
            className="rounded-lg bg-[var(--yif-terracotta)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Save Prices"}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-white/40 border-b border-white/8">
              <th className="px-6 py-3 font-medium">Tier</th>
              {currencies.map((c) => (
                <th key={c} className="px-4 py-3 font-medium">
                  {c} {CURRENCY_SYMBOLS[c]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tiers.map((tier) => (
              <tr key={tier.id} className="hover:bg-white/3">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    {tier.color && (
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: tier.color }}
                      />
                    )}
                    <span className="font-medium text-white">{tier.name}</span>
                    {!tier.isActive && (
                      <span className="text-[10px] text-white/30 border border-white/15 rounded px-1">
                        archived
                      </span>
                    )}
                  </div>
                </td>
                {currencies.map((currency) => (
                  <td key={currency} className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-white/40 text-xs">
                        {CURRENCY_SYMBOLS[currency]}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={prices[tier.id]?.[currency] ?? ""}
                        onChange={(e) => handleChange(tier.id, currency, e.target.value)}
                        className="w-24 rounded-lg bg-white/8 border border-white/10 px-2 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--yif-terracotta)]"
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TiersClient({
  tiers: initialTiers,
  currencies,
}: {
  tiers: Tier[];
  currencies: string[];
}) {
  const [tiers, setTiers] = useState(initialTiers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleArchive(id: string) {
    startTransition(async () => {
      await archiveTier(id);
      setTiers((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isActive: false } : t)),
      );
    });
  }

  function handleRestore(id: string) {
    startTransition(async () => {
      await restoreTier(id);
      setTiers((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isActive: true } : t)),
      );
    });
  }

  return (
    <div className="space-y-8">
      {/* Tier list */}
      <div className="rounded-2xl bg-white/5 border border-white/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-white">Tiers</h2>
            <p className="text-xs text-white/40 mt-0.5">{tiers.length} tier(s) total</p>
          </div>
          <button
            onClick={() => { setShowNewForm(true); setEditingId(null); }}
            className="rounded-lg bg-[var(--yif-terracotta)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            + Add Tier
          </button>
        </div>

        {showNewForm && (
          <div className="px-6 py-5 border-b border-white/8 bg-white/3">
            <p className="text-xs font-semibold text-[var(--yif-terracotta)] uppercase tracking-widest mb-4">
              New Tier
            </p>
            <TierForm isNew onDone={() => { setShowNewForm(false); window.location.reload(); }} />
          </div>
        )}

        <div className="divide-y divide-white/5">
          {tiers.map((tier) => (
            <div key={tier.id}>
              {editingId === tier.id ? (
                <div className="px-6 py-5 bg-white/3">
                  <p className="text-xs font-semibold text-[var(--yif-terracotta)] uppercase tracking-widest mb-4">
                    Editing: {tier.name}
                  </p>
                  <TierForm
                    tier={tier}
                    onDone={() => { setEditingId(null); window.location.reload(); }}
                  />
                </div>
              ) : (
                <div className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Color swatch */}
                    <div
                      className="w-8 h-8 rounded-full border border-white/10 shrink-0"
                      style={{ backgroundColor: tier.color ?? "#888" }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-white">{tier.name}</span>
                        {tier.badge && (
                          <span className="text-[10px] font-semibold bg-[var(--yif-gold)]/15 text-[var(--yif-gold)] border border-[var(--yif-gold)]/20 rounded px-1.5 py-0.5">
                            {tier.badge}
                          </span>
                        )}
                        {!tier.isActive && (
                          <span className="text-[10px] text-white/30 border border-white/15 rounded px-1.5 py-0.5">
                            archived
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/40 mt-0.5 truncate">
                        /{tier.slug} · order {tier.sortOrder} · {tier.memberCount} member(s)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditingId(tier.id)}
                      className="text-xs text-[var(--yif-terracotta)] hover:underline px-2 py-1"
                    >
                      Edit
                    </button>
                    {tier.isActive ? (
                      <button
                        onClick={() => handleArchive(tier.id)}
                        disabled={isPending}
                        className="text-xs text-white/40 hover:text-white/60 px-2 py-1"
                      >
                        Archive
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestore(tier.id)}
                        disabled={isPending}
                        className="text-xs text-green-400 hover:text-green-300 px-2 py-1"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price grid */}
      <PriceGrid tiers={tiers} currencies={currencies} />
    </div>
  );
}
