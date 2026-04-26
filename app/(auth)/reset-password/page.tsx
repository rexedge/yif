import type { Metadata } from "next";
import Link from "next/link";
import ResetPasswordForm from "./_ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | YIF Member Portal",
  description: "Choose a new password for your YIF member portal account.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  return (
    <div className="flex min-h-screen items-stretch">
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex lg:w-2/5 flex-col justify-between px-12 py-12"
        style={{
          background:
            "linear-gradient(160deg, var(--yif-navy) 0%, var(--yif-navy-dark) 100%)",
          borderRight: "1px solid rgba(201,145,61,0.15)",
        }}
      >
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div
              className="w-10 h-10 rounded-full border-2 border-[var(--yif-gold)] flex items-center justify-center"
              aria-hidden
            >
              <span className="font-display text-[var(--yif-gold)] font-bold text-sm">
                YIF
              </span>
            </div>
            <span className="font-display text-white font-semibold tracking-wide">
              Yoruba Indigenes&apos; Foundation
            </span>
          </div>
          <blockquote className="mt-8">
            <p className="font-display text-3xl font-semibold text-white leading-snug">
              &ldquo;Choose a strong password to keep your account safe.&rdquo;
            </p>
            <footer className="mt-4 text-[var(--yif-gold)]/70 text-sm">
              — YIF Security
            </footer>
          </blockquote>
        </div>
        <div className="space-y-3">
          <p className="text-xs text-white/30">
            Registered Foundation · CAC IT 28744
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-2">
            Member Portal
          </p>
          <h1 className="font-display text-4xl font-semibold text-white mb-2">
            Reset your password
          </h1>
          <p className="text-white/50 text-sm mb-8">
            Enter a new password below. You&apos;ll be redirected to sign in
            once it&apos;s saved.
          </p>

          {error || !token ? (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-4 text-sm text-red-400">
              {error === "INVALID_TOKEN"
                ? "This reset link is invalid or has expired."
                : "Missing reset token. Please request a new password reset link."}
              <div className="mt-3">
                <Link
                  href="/forgot-password"
                  className="text-[var(--yif-gold)] hover:underline font-medium"
                >
                  Request a new link →
                </Link>
              </div>
            </div>
          ) : (
            <ResetPasswordForm token={token} />
          )}

          <p className="mt-8 text-center text-sm text-white/40">
            <Link
              href="/login"
              className="text-[var(--yif-gold)] hover:underline font-medium"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
