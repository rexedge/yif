import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In | YIF Member Portal",
  description: "Sign in to your YIF member portal.",
};

export default function LoginPage() {
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
              &ldquo;Together, we preserve our heritage and build our
              future.&rdquo;
            </p>
            <footer className="mt-4 text-[var(--yif-gold)]/70 text-sm">
              — YIF Mission Statement
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

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
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
            Welcome back
          </h1>
          <p className="text-white/50 text-sm mb-8">
            Sign in to access your dashboard, tickets, and membership benefits.
          </p>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
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
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-[var(--yif-gold)]/50 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="text-xs text-white/60 font-medium uppercase tracking-wide"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[var(--yif-gold)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-[var(--yif-gold)]/50 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border border-white/20 bg-white/5 accent-[var(--yif-gold)]"
              />
              <label htmlFor="remember" className="text-xs text-white/50">
                Keep me signed in
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[var(--yif-gold)] text-[var(--yif-navy-dark)] py-3 font-semibold text-sm hover:bg-[var(--yif-gold-light)] transition-colors"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-white/40">
            Not a member yet?{" "}
            <Link
              href="/membership"
              className="text-[var(--yif-gold)] hover:underline font-medium"
            >
              Apply for membership
            </Link>
          </p>

          {/* Trust signals */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-xs font-mono bg-[var(--yif-gold)]/10 border border-[var(--yif-gold)]/20 text-[var(--yif-gold)] px-2 py-0.5 rounded">
              UN/ECOSOC
            </span>
            <span className="text-xs text-white/30">CAC IT 28744</span>
            <span className="text-xs text-white/20">
              · Secure, encrypted login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
