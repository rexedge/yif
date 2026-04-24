"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { randomBytes } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { MembershipTier } from "@/generated/prisma/enums";
import { resend, FROM_EMAIL } from "@/lib/resend";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function banMember(userId: string, reason: string, days?: number) {
  await requireAdmin();
  await auth.api.banUser({
    body: {
      userId,
      banReason: reason,
      banExpiresIn: days ? days * 86400 : undefined,
    },
  });
  revalidatePath(`/admin/members/${userId}`);
  revalidatePath("/admin/members");
}

export async function unbanMember(userId: string) {
  await requireAdmin();
  await auth.api.unbanUser({ body: { userId } });
  revalidatePath(`/admin/members/${userId}`);
  revalidatePath("/admin/members");
}

export async function changeMemberTier(memberId: string, tier: string) {
  await requireAdmin();
  await prisma.member.update({
    where: { id: memberId },
    data: { tier: tier as MembershipTier },
  });
  revalidatePath("/admin/members");
}

export async function revokeMembership(memberId: string) {
  await requireAdmin();
  await prisma.member.update({
    where: { id: memberId },
    data: { status: "SUSPENDED" },
  });
  revalidatePath("/admin/members");
}

export async function inviteMember(formData: FormData) {
  const session = await requireAdmin();
  const email = (formData.get("email") as string).trim().toLowerCase();
  if (!email || !email.includes("@")) throw new Error("Invalid email");

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.invitation.create({
    data: {
      email,
      token,
      invitedById: session.user.id,
      expiresAt,
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://yifworldwide.org";
  const joinUrl = `${appUrl}/join/${token}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "You've been invited to join YIF",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h1 style="color:#1a2744;font-size:24px;margin-bottom:8px">
          You're Invited to Join the Yoruba Indigenes' Foundation
        </h1>
        <p style="color:#555;font-size:16px;line-height:1.6">
          You have been personally invited to become a member of YIF — an organisation
          promoting Yoruba cultural heritage and youth empowerment worldwide.
        </p>
        <a href="${joinUrl}" style="display:inline-block;margin-top:24px;background:#c9913d;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px">
          Accept Invitation
        </a>
        <p style="color:#999;font-size:13px;margin-top:32px">
          This invitation expires in 7 days. If you did not expect this, you may ignore it.
        </p>
      </div>
    `,
  });

  revalidatePath("/admin/members");
  redirect("/admin/members?invited=1");
}
