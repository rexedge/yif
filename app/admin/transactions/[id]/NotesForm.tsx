"use client";

import { useState, useTransition } from "react";
import { saveTransactionNote } from "./actions";

export function NotesForm({ txId, initialNote }: { txId: string; initialNote: string | null }) {
  const [note, setNote] = useState(initialNote ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await saveTransactionNote(txId, note);
      if (result.error) setError(result.error);
      else { setSaved(true); setError(null); }
    });
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/8 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-white">Admin Notes</h2>
        <div className="flex items-center gap-2">
          {saved && <span className="text-xs text-green-400">✓ Saved</span>}
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
      </div>
      <div className="px-6 py-4 space-y-3">
        <textarea
          value={note}
          onChange={(e) => { setNote(e.target.value); setSaved(false); }}
          rows={5}
          placeholder="Add internal notes about this transaction (refund reason, support ticket, investigation notes…)"
          className="w-full rounded-lg bg-white/8 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[var(--yif-terracotta)] resize-none"
        />
        <button
          onClick={handleSave}
          disabled={isPending}
          className="rounded-lg bg-[var(--yif-terracotta)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save Note"}
        </button>
      </div>
    </div>
  );
}
