import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BlogPostForm } from "../../_BlogPostForm";
import { updateBlogPost, deleteBlogPost } from "../../actions";

export const metadata: Metadata = { title: "Edit Post | Admin — YIF" };

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPostPage({ params }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const { id } = await params;
  const [post, topics] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id } }),
    prisma.blogTopic.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, color: true },
    }),
  ]);
  if (!post) notFound();

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateBlogPost(id, formData);
  }

  async function handleDelete() {
    "use server";
    await deleteBlogPost(id);
    redirect("/admin/blog");
  }

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
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
              Edit Post
            </h1>
            <p className="mt-1 text-white/40 text-sm line-clamp-1">
              {post.title}
            </p>
          </div>
          <form action={handleDelete}>
            <button
              type="submit"
              className="rounded-xl border border-[var(--yif-terracotta)]/30 text-[var(--yif-terracotta)]/70 hover:border-[var(--yif-terracotta)]/60 hover:text-[var(--yif-terracotta)] px-4 py-2 text-sm transition-colors"
            >
              Delete Post
            </button>
          </form>
        </div>

        <BlogPostForm
          post={post}
          topics={topics}
          action={handleUpdate}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
