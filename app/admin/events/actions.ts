"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function createEvent(formData: FormData) {
  await requireAdmin();

  const title = (formData.get("title") as string).trim();
  const slug = slugify(title) + "-" + Date.now().toString(36);
  const tagline = (formData.get("tagline") as string | null)?.trim() || null;
  const category = (formData.get("category") as string | null)?.trim() || null;
  const description =
    (formData.get("description") as string | null)?.trim() || null;
  const date = new Date(formData.get("date") as string);
  const endDateStr = formData.get("endDate") as string | null;
  const endDate = endDateStr ? new Date(endDateStr) : null;
  const time = (formData.get("time") as string | null)?.trim() || null;
  const location = (formData.get("location") as string | null)?.trim() || null;
  const address = (formData.get("address") as string | null)?.trim() || null;
  const country = (formData.get("country") as string | null)?.trim() || null;
  const imageUrl = (formData.get("imageUrl") as string | null)?.trim() || null;
  const isPublished = formData.get("isPublished") === "true";

  // Parse ticket tiers JSON
  const tiersRaw = (formData.get("tiers") as string | null) ?? "[]";
  const tiers: Array<{
    name: string;
    price: number;
    description?: string;
    capacity: number;
  }> = JSON.parse(tiersRaw);

  const event = await prisma.event.create({
    data: {
      title,
      slug,
      tagline,
      category,
      description,
      date,
      endDate,
      time,
      location,
      address,
      country,
      imageUrl,
      isPublished,
      tiers: {
        create: tiers.map((t) => ({
          name: t.name,
          price: t.price,
          description: t.description ?? null,
          capacity: t.capacity,
        })),
      },
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect(`/admin/events/${event.id}/edit`);
}

export async function updateEvent(id: string, formData: FormData) {
  await requireAdmin();

  const title = (formData.get("title") as string).trim();
  const tagline = (formData.get("tagline") as string | null)?.trim() || null;
  const category = (formData.get("category") as string | null)?.trim() || null;
  const description =
    (formData.get("description") as string | null)?.trim() || null;
  const date = new Date(formData.get("date") as string);
  const endDateStr = formData.get("endDate") as string | null;
  const endDate = endDateStr ? new Date(endDateStr) : null;
  const time = (formData.get("time") as string | null)?.trim() || null;
  const location = (formData.get("location") as string | null)?.trim() || null;
  const address = (formData.get("address") as string | null)?.trim() || null;
  const country = (formData.get("country") as string | null)?.trim() || null;
  const imageUrl = (formData.get("imageUrl") as string | null)?.trim() || null;
  const isPublished = formData.get("isPublished") === "true";

  const tiersRaw = (formData.get("tiers") as string | null) ?? "[]";
  const tiers: Array<{
    name: string;
    price: number;
    description?: string;
    capacity: number;
  }> = JSON.parse(tiersRaw);

  // Delete existing tiers and recreate
  await prisma.eventTicketTier.deleteMany({ where: { eventId: id } });

  await prisma.event.update({
    where: { id },
    data: {
      title,
      tagline,
      category,
      description,
      date,
      endDate,
      time,
      location,
      address,
      country,
      imageUrl,
      isPublished,
      tiers: {
        create: tiers.map((t) => ({
          name: t.name,
          price: t.price,
          description: t.description ?? null,
          capacity: t.capacity,
        })),
      },
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect("/admin/events");
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function togglePublishEvent(id: string, isPublished: boolean) {
  await requireAdmin();
  await prisma.event.update({ where: { id }, data: { isPublished } });
  revalidatePath("/admin/events");
  revalidatePath("/events");
}
