"use client";

import { useState, type FormEvent } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // TODO: Replace with real API call in Phase 8 (email integration)
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <section className="relative bg-[var(--yif-terracotta)] py-20 sm:py-24 overflow-hidden">
      {/* Decorative circles */}
      <div
        aria-hidden
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-80 h-80 rounded-full border border-white/10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-56 h-56 rounded-full border border-white/15 pointer-events-none"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 sm:px-10 text-center">
        <p className="text-white/60 text-xs font-semibold uppercase tracking-[0.25em] mb-4">
          Stay Connected
        </p>
        <h2 className="font-display text-4xl sm:text-5xl font-semibold text-white leading-tight mb-5">
          Join the Yoruba Diaspora Network
        </h2>
        <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-10">
          Receive updates on YIF Programs, scholarship openings, events, and
          news from the global Yoruba community.
        </p>

        {submitted ? (
          <div className="inline-flex items-center gap-3 bg-white/15 border border-white/25 rounded-full px-8 py-4 text-white font-semibold">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M2 8l4 4 8-8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            You&rsquo;re on the list. Thank you!
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 rounded-full bg-white/15 border border-white/20 px-6 py-3.5 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-white/50 focus:bg-white/20 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex-shrink-0 rounded-full bg-white text-[var(--yif-terracotta)] font-semibold text-sm uppercase tracking-widest px-8 py-3.5 hover:bg-[var(--yif-gold-pale)] transition-colors disabled:opacity-60"
            >
              {loading ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        )}

        <p className="mt-5 text-white/40 text-xs">
          We respect your privacy. No spam — just meaningful updates.
        </p>
      </div>
    </section>
  );
}
