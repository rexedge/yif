import type { Metadata } from "next";
import Link from "next/link";
import ForgotPasswordForm from "./_ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | YIF Member Portal",
  description: "Request a password reset link for your YIF member portal.",
};

export default function ForgotPasswordPage() {
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
              &ldquo;Your access to community, restored in moments.&rdquo;
            </p>
            <footer className="mt-4 text-[var(--yif-gold)]/70 text-sm">
              — YIF Member Support
            </footer>
          </blockquote>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-[var(--yif-gold)]/10 border border-[var(--yif-gold)]/20 text-[var(--yif-gold)] px-2 py-0.5 rounded">
              UN/ECOSOC
            </span>
            <span className="text-xs text-white/40">Consultative Status</span>
          </div>
          <p className="text-xs text-white/30">
            Registered Foundation · CAC IT 28744
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-full border-2 border-[var(--yif-gold)] flex items-center justify-center">
              <span className="font-display text-[var(--yif-gold)] font-bold text-xs">
                YIF
              </span>
            </div>
            <span className="font-display text-white font-semibold">
              Yoruba Indigenes&apos; Foundation
            </span>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-2">
            Member Portal
          </p>
          <h1 className="font-display text-4xl font-semibold text-white mb-2">
            Forgot your password?
          </h1>
          <p className="text-white/50 text-sm mb-8">
            Enter the email associated with your account and we&apos;ll send you
            a secure link to reset your password.
          </p>

          <ForgotPasswordForm />

          <p className="mt-8 text-center text-sm text-white/40">
            Remembered it?{" "}
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
