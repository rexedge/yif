import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BlogPostForm } from "../_BlogPostForm";
import { createBlogPost } from "../actions";

export const metadata: Metadata = { title: "New Blog Post | Admin — YIF" };

export default async function NewBlogPostPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const topics = await prisma.blogTopic.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, color: true },
  });

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <a
            href="/admin/blog"
            className="text-xs text-white/40 hover:text-white/60 transition-colors mb-4 inline-flex items-center gap-1.5"
          >
            ← Back to Blog
          </a>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-terracotta)] mb-1 mt-4">
            Admin Panel
          </p>
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            New Blog Post
          </h1>
        </div>
        <BlogPostForm
          topics={topics}
          action={createBlogPost}
          submitLabel="Create Post"
        />
      </div>
    </div>
  );
}
