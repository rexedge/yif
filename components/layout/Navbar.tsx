"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import { TrustBadge } from "./TrustBadge";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user ?? null;

  return (
    <header className="relative z-50">
      {/* Trust bar */}
      <div className="bg-[var(--yif-navy-dark)] px-4 py-1.5 text-center">
        <TrustBadge variant="inline" />
      </div>

      {/* Main nav */}
      <nav className="border-b border-[var(--yif-gold)]/20 bg-[var(--yif-navy)] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo / wordmark */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/apple-touch-icon.png"
              alt="YIF Logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full"
            />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-xl font-semibold tracking-wide text-white group-hover:text-[var(--yif-gold)] transition-colors">
                YIF
              </span>
              <span className="hidden text-[10px] font-sans text-[var(--yif-gold)]/80 tracking-widest uppercase sm:block">
                Yoruba Indigenes&apos; Foundation
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative text-sm font-medium transition-colors hover:text-[var(--yif-gold)] ${
                    pathname.startsWith(href)
                      ? "text-[var(--yif-gold)]"
                      : "text-white/80"
                  } after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[var(--yif-gold)] after:transition-transform hover:after:scale-x-100 ${
                    pathname.startsWith(href) ? "after:scale-x-100" : ""
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-white/80 hover:text-[var(--yif-gold)] transition-colors"
                >
                  {user.name ?? user.email}
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    signOut({
                      fetchOptions: { onSuccess: () => router.refresh() },
                    })
                  }
                  className="text-sm font-medium text-white/60 hover:text-white/90 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-white/80 hover:text-[var(--yif-gold)] transition-colors"
              >
                Member Login
              </Link>
            )}
            <Link
              href="/donate"
              className="rounded-full bg-[var(--yif-gold)] px-5 py-2 text-sm font-semibold text-[var(--yif-navy)] transition-all hover:bg-[var(--yif-gold-light)] hover:shadow-[0_0_20px_rgba(201,145,61,0.4)]"
            >
              Donate
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="flex items-center justify-center rounded-md p-2 text-white/80 hover:text-white lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            {menuOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="border-t border-[var(--yif-gold)]/20 bg-[var(--yif-navy-dark)] px-4 pb-6 pt-4 lg:hidden">
            <ul className="flex flex-col gap-4">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block text-base font-medium transition-colors hover:text-[var(--yif-gold)] ${
                      pathname.startsWith(href)
                        ? "text-[var(--yif-gold)]"
                        : "text-white/80"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block text-center text-sm font-medium text-white/80 hover:text-[var(--yif-gold)] transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {user.name ?? user.email}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      signOut({
                        fetchOptions: { onSuccess: () => router.refresh() },
                      });
                    }}
                    className="block w-full text-center text-sm font-medium text-white/60 hover:text-white/90 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block text-center text-sm font-medium text-white/80 hover:text-[var(--yif-gold)] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Member Login
                </Link>
              )}
              <Link
                href="/donate"
                className="block rounded-full bg-[var(--yif-gold)] px-5 py-2.5 text-center text-sm font-semibold text-[var(--yif-navy)] hover:bg-[var(--yif-gold-light)]"
                onClick={() => setMenuOpen(false)}
              >
                Donate Now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

function IconMenu() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconX() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
