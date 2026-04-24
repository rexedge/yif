"use client";

import { useRef, useState } from "react";
import type { BlogPost, BlogTopic } from "@/generated/prisma/client";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 rounded-xl bg-white/3 border border-white/6 animate-pulse" />
    ),
  },
);

type Props = {
  post?: BlogPost;
  topics: Pick<BlogTopic, "id" | "name" | "color">[];
  action: (formData: FormData) => Promise<void>;
  submitLabel?: string;
};

export function BlogPostForm({
  post,
  topics,
  action,
  submitLabel = "Save",
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [content, setContent] = useState<unknown>(post?.content ?? null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    fd.set("content", JSON.stringify(content));
    await action(fd);
    setPending(false);
  }

  async function handleImageUpload(file: File): Promise<string> {
    const reader = new FileReader();
    const dataUri = await new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataUri, folder: "yif/blog" }),
    });
    const json = await res.json();
    return json.url as string;
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Meta */}
      <div className="rounded-2xl bg-white/5 border border-white/8 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide">
          Post Details
        </h2>

        <div>
          <label className="block text-xs text-white/50 mb-1.5">Title *</label>
          <input
            name="title"
            required
            defaultValue={post?.title ?? ""}
            placeholder="Post title…"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-gold)]/40 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-white/50 mb-1.5">
            Excerpt *
          </label>
          <textarea
            name="excerpt"
            required
            rows={2}
            defaultValue={post?.excerpt ?? ""}
            placeholder="Short summary shown on the blog listing…"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-gold)]/40 transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Topic</label>
            <select
              name="topicId"
              defaultValue={post?.topicId ?? ""}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--yif-gold)]/40 transition-colors appearance-none"
            >
              <option value="">No topic</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5">
              Read Time (min)
            </label>
            <input
              name="readTime"
              type="number"
              min="1"
              defaultValue={post?.readTime ?? ""}
              placeholder="e.g. 5"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-gold)]/40 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-white/50 mb-1.5">
            Cover Image URL
          </label>
          <input
            name="imageUrl"
            type="url"
            defaultValue={post?.imageUrl ?? ""}
            placeholder="https://…"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-gold)]/40 transition-colors"
          />
        </div>
      </div>

      {/* Author */}
      <div className="rounded-2xl bg-white/5 border border-white/8 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide">
          Author
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-white/50 mb-1.5">
              Author Name *
            </label>
            <input
              name="authorName"
              required
              defaultValue={post?.authorName ?? ""}
              placeholder="e.g. Dr. Aderibole Olumide"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-gold)]/40 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5">
              Author Role *
            </label>
            <input
              name="authorRole"
              required
              defaultValue={post?.authorRole ?? ""}
              placeholder="e.g. National President/CEO"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-gold)]/40 transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1.5">
            Author Image URL
          </label>
          <input
            name="authorImage"
            type="url"
            defaultValue={post?.authorImage ?? ""}
            placeholder="https://…"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--yif-gold)]/40 transition-colors"
          />
        </div>
      </div>

      {/* Content */}
      <div className="rounded-2xl bg-white/5 border border-white/8 p-6">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-4">
          Content
        </h2>
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Write your post here…"
          onImageUpload={handleImageUpload}
        />
      </div>

      {/* Publish */}
      <div className="rounded-2xl bg-white/5 border border-white/8 p-6">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-4">
          Visibility
        </h2>
        <div className="flex items-center gap-4">
          {[
            { value: "false", label: "Draft", desc: "Not visible publicly" },
            { value: "true", label: "Published", desc: "Visible on /blog" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex-1 cursor-pointer rounded-xl border border-white/10 px-4 py-3 hover:border-white/20 transition-colors has-[:checked]:border-[var(--yif-gold)]/40 has-[:checked]:bg-[var(--yif-gold)]/5"
            >
              <input
                type="radio"
                name="isPublished"
                value={opt.value}
                defaultChecked={
                  opt.value === (post?.isPublished ? "true" : "false")
                }
                className="sr-only"
              />
              <p className="text-sm font-medium text-white">{opt.label}</p>
              <p className="text-xs text-white/40 mt-0.5">{opt.desc}</p>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-[var(--yif-gold)] text-[var(--yif-navy-dark)] px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <a
          href="/admin/blog"
          className="text-sm text-white/40 hover:text-white/70 transition-colors px-4 py-2.5"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
