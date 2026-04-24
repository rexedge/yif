import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Join YIF | Yoruba Indigenes' Foundation",
};

type Props = { params: Promise<{ token: string }> };

export default async function JoinPage({ params }: Props) {
  const { token } = await params;

  const invitation = await prisma.invitation.findUnique({ where: { token } });

  const now = new Date();
  const isExpired = !invitation || invitation.expiresAt < now;
  const isUsed = invitation?.usedAt != null;

  if (!invitation || isExpired || isUsed) {
    return (
      <div className="min-h-screen bg-[var(--yif-navy-dark)] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-4">⏳</div>
          <h1 className="font-display text-2xl font-semibold text-white mb-3">
            {isUsed ? "Invitation Already Used" : "Invitation Expired"}
          </h1>
          <p className="text-white/50 text-sm mb-6">
            {isUsed
              ? "This invitation link has already been used. Please contact us if you need assistance."
              : "This invitation link is no longer valid. Invitations expire after 7 days. Please ask to be re-invited."}
          </p>
          <Link
            href="/"
            className="inline-block rounded-xl bg-[var(--yif-gold)] text-[var(--yif-navy-dark)] px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-gold)] mb-2">
            You&apos;ve Been Invited
          </p>
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Join the Yoruba Indigenes&apos; Foundation
          </h1>
          <p className="mt-3 text-white/50 text-sm leading-relaxed">
            You have been personally invited to become a member of YIF — a
            global organisation promoting Yoruba cultural heritage, youth
            empowerment, and unity worldwide.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4 mb-6">
          {[
            {
              icon: "🌍",
              label: "Global Network",
              desc: "Connect with Yoruba communities across 20+ countries",
            },
            {
              icon: "🎓",
              label: "Scholarship Access",
              desc: "Apply for the YIF Scholarship Programme (2024–2025 Batch)",
            },
            {
              icon: "🏆",
              label: "Awards & Recognition",
              desc: "Be part of our annual awards and cultural events",
            },
            {
              icon: "💼",
              label: "Economic Empowerment",
              desc: "Join our cooperative economy project — Karo-Ojire Investments",
            },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <span className="text-xl shrink-0">{item.icon}</span>
              <div>
                <p className="text-sm font-medium text-white/80">
                  {item.label}
                </p>
                <p className="text-xs text-white/40">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href={`/membership/apply?token=${token}`}
          className="block w-full rounded-xl bg-[var(--yif-gold)] text-[var(--yif-navy-dark)] py-3 text-center font-semibold hover:opacity-90 transition-opacity"
        >
          Accept Invitation &amp; Apply
        </Link>

        <p className="text-center text-xs text-white/25 mt-4">
          Registration No. IT 28744 · UN/ECOSOC Special Consultative Status
        </p>
      </div>
    </div>
  );
}
