"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });
      if (result.error) {
        setError(result.error.message ?? "Could not send reset email.");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl bg-[var(--yif-gold)]/10 border border-[var(--yif-gold)]/30 px-5 py-5 text-sm text-white/80">
        <p className="font-semibold text-white mb-1">Check your inbox</p>
        <p className="text-white/60 leading-relaxed">
          If an account exists for <strong>{email}</strong>, we&apos;ve sent a
          password reset link. The link expires in 1 hour.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-xs text-white/60 mb-1.5 font-medium uppercase tracking-wide"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-[var(--yif-gold)]/50 transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[var(--yif-gold)] text-[var(--yif-navy-dark)] py-3 font-semibold text-sm hover:bg-[var(--yif-gold-light)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Sending…" : "Send Reset Link"}
      </button>
    </form>
  );
}
