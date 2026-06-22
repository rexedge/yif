import { Suspense } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getActiveTiers } from "@/lib/membership";
import { MembershipApplyForm } from "./_form";

export default async function MembershipApplyPage() {
  const [session, tiers] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getActiveTiers(),
  ]);
  const isLoggedIn = Boolean(session);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--yif-cream)] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--yif-navy)] border-t-transparent animate-spin" />
        </div>
      }
    >
      <MembershipApplyForm isLoggedIn={isLoggedIn} tiers={tiers} />
    </Suspense>
  );
}
