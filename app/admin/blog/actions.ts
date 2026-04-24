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

export async function createBlogPost(formData: FormData) {
  await requireAdmin();

  const title = (formData.get("title") as string).trim();
  const slug = slugify(title) + "-" + Date.now().toString(36);
  const excerpt = (formData.get("excerpt") as string).trim();
  const contentRaw = (formData.get("content") as string) || "{}";
  const content = JSON.parse(contentRaw);
  const authorName = (formData.get("authorName") as string).trim();
  const authorRole = (formData.get("authorRole") as string).trim();
  const authorImage =
    (formData.get("authorImage") as string | null)?.trim() || null;
  const imageUrl = (formData.get("imageUrl") as string | null)?.trim() || null;
  const readTimeStr = formData.get("readTime") as string | null;
  const readTime = readTimeStr ? parseInt(readTimeStr) : null;
  const topicId = (formData.get("topicId") as string | null)?.trim() || null;
  const isPublished = formData.get("isPublished") === "true";
  const publishedAt = isPublished ? new Date() : null;

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      authorName,
      authorRole,
      authorImage,
      imageUrl,
      readTime,
      topicId: topicId || null,
      isPublished,
      publishedAt,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect(`/admin/blog/${post.id}/edit`);
}

export async function updateBlogPost(id: string, formData: FormData) {
  await requireAdmin();

  const title = (formData.get("title") as string).trim();
  const excerpt = (formData.get("excerpt") as string).trim();
  const contentRaw = (formData.get("content") as string) || "{}";
  const content = JSON.parse(contentRaw);
  const authorName = (formData.get("authorName") as string).trim();
  const authorRole = (formData.get("authorRole") as string).trim();
  const authorImage =
    (formData.get("authorImage") as string | null)?.trim() || null;
  const imageUrl = (formData.get("imageUrl") as string | null)?.trim() || null;
  const readTimeStr = formData.get("readTime") as string | null;
  const readTime = readTimeStr ? parseInt(readTimeStr) : null;
  const topicId = (formData.get("topicId") as string | null)?.trim() || null;
  const isPublished = formData.get("isPublished") === "true";

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  const publishedAt =
    isPublished && !existing?.publishedAt
      ? new Date()
      : (existing?.publishedAt ?? null);

  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      excerpt,
      content,
      authorName,
      authorRole,
      authorImage,
      imageUrl,
      readTime,
      topicId: topicId || null,
      isPublished,
      publishedAt,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function togglePublishPost(id: string, isPublished: boolean) {
  await requireAdmin();
  const publishedAt = isPublished ? new Date() : null;
  await prisma.blogPost.update({
    where: { id },
    data: { isPublished, publishedAt },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
