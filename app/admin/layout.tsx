"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin/dashboard", icon: "⬡" },
  { label: "Members", href: "/admin/members", icon: "◈" },
  { label: "Events", href: "/admin/events", icon: "◷" },
  { label: "Donations", href: "/admin/donations", icon: "◆" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[var(--yif-navy-dark)]">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 bg-[var(--yif-navy)] border-r border-white/8 px-4 py-6">
        {/* Branding */}
        <div className="mb-8 px-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-md bg-[var(--yif-terracotta)]/20 border border-[var(--yif-terracotta)]/30 flex items-center justify-center">
              <span className="font-display text-[var(--yif-terracotta)] font-bold text-xs">A</span>
            </div>
            <span className="font-display text-white font-semibold text-sm">Admin Panel</span>
          </div>
          <p className="text-xs text-white/30 ml-9">YIF Foundation</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--yif-terracotta)]/15 text-[var(--yif-terracotta)] border border-[var(--yif-terracotta)]/20"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Admin user */}
        <div className="mt-auto pt-4 border-t border-white/8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[var(--yif-terracotta)]/20 border border-[var(--yif-terracotta)]/30 flex items-center justify-center text-xs font-bold text-[var(--yif-terracotta)]">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-xs text-white/80 font-medium truncate">Admin User</p>
              <p className="text-xs text-[var(--yif-terracotta)]/70">Super Admin</p>
            </div>
          </div>
          <Link
            href="/"
            className="mt-3 flex items-center gap-2 px-3 py-2 text-xs text-white/30 hover:text-white/60 rounded-lg hover:bg-white/5 transition-colors"
          >
            ← Back to Website
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed top-0 inset-x-0 z-40 lg:hidden bg-[var(--yif-navy)] border-b border-white/8 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--yif-terracotta)]/20 flex items-center justify-center">
              <span className="font-display text-[var(--yif-terracotta)] font-bold text-xs">A</span>
            </div>
            <span className="font-display text-white font-semibold text-sm">Admin Panel</span>
          </div>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                    active
                      ? "bg-[var(--yif-terracotta)]/15 text-[var(--yif-terracotta)]"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 pt-16 lg:pt-0">{children}</main>
    </div>
  );
}
