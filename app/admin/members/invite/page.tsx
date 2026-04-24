import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { inviteMember } from "../actions";

export const metadata: Metadata = { title: "Invite Member | Admin — YIF" };

export default async function InviteMemberPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const sp = await searchParams;
  const sent = sp.sent === "1";

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <a
            href="/admin/members"
            className="text-xs text-white/40 hover:text-white/60 transition-colors mb-4 inline-flex items-center gap-1.5"
          >
            ← Back to Members
          </a>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-terracotta)] mb-1 mt-4">
            Admin Panel
          </p>
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Invite Member
          </h1>
          <p className="mt-2 text-white/40 text-sm">
            Send a personalised membership invitation via email. The link
            expires in 7 days.
          </p>
        </div>

        {sent && (
          <div className="rounded-xl bg-[var(--yif-green)]/15 border border-[var(--yif-green)]/25 px-5 py-4 mb-6">
            <p className="text-sm text-[var(--yif-green)] font-medium">
              Invitation sent successfully!
            </p>
          </div>
        )}

        <form
          action={inviteMember}
          className="rounded-2xl bg-white/5 border border-white/8 p-6 space-y-5"
        >
          <div>
            <label className="block text-xs text-white/50 mb-1.5">
              Email Address *
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="member@example.com"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-gold)]/40 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[var(--yif-gold)] text-[var(--yif-navy-dark)] py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Send Invitation
          </button>
        </form>
      </div>
    </div>
  );
}
