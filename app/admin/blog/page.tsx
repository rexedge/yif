import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteBlogPost, togglePublishPost } from "./actions";

export const metadata: Metadata = { title: "Admin — Blog | YIF" };

export default async function AdminBlogPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { topic: { select: { name: true, color: true } } },
  });

  const publishedCount = posts.filter((p) => p.isPublished).length;

  return (
    <div className="min-h-screen bg-[var(--yif-navy-dark)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--yif-terracotta)] mb-1">
            Admin Panel
          </p>
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Blog Posts
          </h1>
          <p className="mt-1 text-white/40 text-sm">
            {publishedCount} published · {posts.length - publishedCount} drafts
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-xl bg-[var(--yif-gold)] text-[var(--yif-navy-dark)] px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          + New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        {[
          { label: "Total Posts", value: String(posts.length) },
          { label: "Published", value: String(publishedCount) },
          { label: "Drafts", value: String(posts.length - publishedCount) },
          {
            label: "Topics",
            value: String(
              new Set(posts.map((p) => p.topicId).filter(Boolean)).size,
            ),
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-white/5 border border-white/8 px-5 py-4"
          >
            <p className="text-xs text-white/40 font-medium uppercase tracking-wide mb-1.5">
              {s.label}
            </p>
            <p className="font-display text-2xl font-bold text-white">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/5 border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-5 py-3.5 text-xs text-white/40 font-medium uppercase tracking-wide">
                  Title
                </th>
                <th className="text-left px-4 py-3.5 text-xs text-white/40 font-medium uppercase tracking-wide hidden sm:table-cell">
                  Topic
                </th>
                <th className="text-left px-4 py-3.5 text-xs text-white/40 font-medium uppercase tracking-wide hidden md:table-cell">
                  Author
                </th>
                <th className="text-left px-4 py-3.5 text-xs text-white/40 font-medium uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-white/30 text-sm"
                  >
                    No posts yet.{" "}
                    <Link
                      href="/admin/blog/new"
                      className="text-[var(--yif-gold)] underline"
                    >
                      Create one.
                    </Link>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-white/3 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="text-white/80 font-medium text-sm line-clamp-1">
                        {post.title}
                      </p>
                      <p className="text-white/30 text-xs mt-0.5 line-clamp-1">
                        {post.excerpt}
                      </p>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      {post.topic ? (
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${post.topic.color ?? "#c9913d"}20`,
                            color: post.topic.color ?? "#c9913d",
                          }}
                        >
                          {post.topic.name}
                        </span>
                      ) : (
                        <span className="text-white/25 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-white/40 text-xs hidden md:table-cell">
                      {post.authorName}
                    </td>
                    <td className="px-4 py-4">
                      <form
                        action={async () => {
                          "use server";
                          await togglePublishPost(post.id, !post.isPublished);
                        }}
                      >
                        <button
                          type="submit"
                          className={`text-xs font-medium px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                            post.isPublished
                              ? "bg-[var(--yif-green)]/15 text-[var(--yif-green)] border-[var(--yif-green)]/25 hover:bg-[var(--yif-green)]/25"
                              : "bg-white/6 text-white/40 border-white/12 hover:bg-white/10"
                          }`}
                          title={
                            post.isPublished
                              ? "Click to unpublish"
                              : "Click to publish"
                          }
                        >
                          {post.isPublished ? "Published" : "Draft"}
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        {post.isPublished && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="text-xs text-[var(--yif-gold)]/70 hover:text-[var(--yif-gold)] transition-colors px-2 py-1 rounded hover:bg-[var(--yif-gold)]/8"
                          >
                            View
                          </Link>
                        )}
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="text-xs text-white/50 hover:text-white/80 transition-colors px-2 py-1 rounded hover:bg-white/5"
                        >
                          Edit
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteBlogPost(post.id);
                          }}
                          className="inline"
                        >
                          <button
                            type="submit"
                            className="text-xs text-[var(--yif-terracotta)]/40 hover:text-[var(--yif-terracotta)]/80 transition-colors px-2 py-1 rounded hover:bg-[var(--yif-terracotta)]/8"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
