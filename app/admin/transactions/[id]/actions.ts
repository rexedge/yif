"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function saveTransactionNote(
  txId: string,
  note: string,
): Promise<{ error?: string; success?: boolean }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") return { error: "Unauthorized" };

  await prisma.transaction.update({
    where: { id: txId },
    data: { notes: note.trim() || null },
  });

  revalidatePath(`/admin/transactions/${txId}`);
  return { success: true };
}
