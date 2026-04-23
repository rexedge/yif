"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: "⬡" },
  { href: "/dashboard/membership", label: "Membership", icon: "◈" },
  { href: "/dashboard/tickets", label: "My Tickets", icon: "◷" },
  { href: "/dashboard/donations", label: "Donations", icon: "♡" },
  { href: "/dashboard/scholarship", label: "Scholarship", icon: "◎" },
  { href: "/dashboard/directory", label: "Member Directory", icon: "◫" },
  { href: "/dashboard/settings", label: "Settings", icon: "⊙" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[var(--yif-navy-dark)]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-[var(--yif-navy)] px-4 py-8">
        {/* Logo */}
        <div className="mb-8 px-2">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl font-bold text-[var(--yif-gold)] group-hover:text-[var(--yif-gold-light)] transition-colors">
              YIF
            </span>
            <span className="text-xs text-white/40 leading-tight">
              Member
              <br />
              Portal
            </span>
          </Link>
        </div>

        {/* Member badge */}
        <div className="mb-6 rounded-lg bg-white/5 px-3 py-3 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[var(--yif-gold)]/20 flex items-center justify-center text-[var(--yif-gold)] font-display font-semibold text-base">
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Adewale Okafor
              </p>
              <p className="text-xs text-[var(--yif-gold)]">Gold Member</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5">
          {NAV.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                  active
                    ? "bg-[var(--yif-gold)]/15 text-[var(--yif-gold)] font-medium"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/50 hover:bg-white/5 hover:text-white transition-all"
          >
            <span className="text-base leading-none">←</span>
            Back to Website
          </Link>
          <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/50 hover:bg-white/5 hover:text-white transition-all">
            <span className="text-base leading-none">⏻</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex md:hidden items-center justify-between bg-[var(--yif-navy)] border-b border-white/10 px-4 py-3">
        <Link
          href="/"
          className="font-display text-xl font-bold text-[var(--yif-gold)]"
        >
          YIF
        </Link>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[var(--yif-gold)]/20 flex items-center justify-center text-[var(--yif-gold)] font-display font-semibold text-sm">
            A
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto pt-14 md:pt-0">{children}</main>
    </div>
  );
}
