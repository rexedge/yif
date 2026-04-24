import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RichTextRenderer from "@/components/editor/RichTextRenderer";

type Props = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | YIF Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.authorName],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { topic: true },
  });

  if (!post || !post.isPublished) notFound();

  const topicColor = post.topic?.color ?? "#1a2744";
  const otherPosts = await prisma.blogPost.findMany({
    where: { isPublished: true, slug: { not: slug } },
    include: { topic: true },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  const encodedTitle = encodeURIComponent(post.title);
  const postPath = `/blog/${post.slug}`;

  return (
    <>
      {/* ── Hero banner ── */}
      <div
        className="relative overflow-hidden py-28 sm:py-36"
        style={{
          background: `linear-gradient(135deg, ${topicColor} 0%, #1a2744 100%)`,
        }}
      >
        {/* SVG texture overlay */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="post-pattern"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="30"
                cy="30"
                r="12"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="30"
                x2="60"
                y2="30"
                stroke="white"
                strokeWidth="0.5"
              />
              <line
                x1="30"
                y1="0"
                x2="30"
                y2="60"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#post-pattern)" />
        </svg>

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-sm text-white/60"
          >
            <Link href="/" className="hover:text-white/90 transition-colors">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/blog"
              className="hover:text-white/90 transition-colors"
            >
              Blog
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/90 line-clamp-1">{post.title}</span>
          </nav>

          {/* Category badge */}
          {post.topic && (
            <span className="mb-5 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
              {post.topic.name}
            </span>
          )}

          {/* Title */}
          <h1 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          {/* Metadata row */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
            <span>
              By{" "}
              <strong className="font-semibold text-white">
                {post.authorName}
              </strong>{" "}
              · {post.authorRole}
            </span>
            <span aria-hidden="true" className="hidden sm:inline">
              |
            </span>
            <time dateTime={post.publishedAt?.toISOString() ?? ""}>
              {formatDate(post.publishedAt)}
            </time>
            <span aria-hidden="true">·</span>
            <span>{post.readTime ?? 5} min read</span>
          </div>
        </div>
      </div>

      {/* ── Article body ── */}
      <article className="bg-[var(--yif-cream)] py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Excerpt lead */}
          <p
            className="mb-10 border-l-4 pl-5 font-display text-xl leading-relaxed text-[var(--yif-navy)] italic sm:text-2xl"
            style={{ borderColor: topicColor }}
          >
            {post.excerpt}
          </p>

          {/* Body — TipTap rich text */}
          <RichTextRenderer
            content={post.content}
            className="text-[var(--yif-charcoal)]"
          />

          {/* Divider */}
          <hr className="my-12 border-[var(--yif-cream-dark)]" />

          {/* Share row */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold uppercase tracking-widest text-[var(--muted)]">
              Share:
            </span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=https://yifworldwide.org${postPath}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X / Twitter"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--yif-cream-dark)] bg-white px-4 py-2 text-sm font-semibold text-[var(--yif-charcoal)] transition-colors hover:border-[var(--yif-navy)] hover:bg-[var(--yif-navy)] hover:text-white"
            >
              <svg
                aria-hidden="true"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X / Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=https://yifworldwide.org${postPath}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--yif-cream-dark)] bg-white px-4 py-2 text-sm font-semibold text-[var(--yif-charcoal)] transition-colors hover:border-blue-600 hover:bg-blue-600 hover:text-white"
            >
              <svg
                aria-hidden="true"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodedTitle}%20https://yifworldwide.org${postPath}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--yif-cream-dark)] bg-white px-4 py-2 text-sm font-semibold text-[var(--yif-charcoal)] transition-colors hover:border-green-600 hover:bg-green-600 hover:text-white"
            >
              <svg
                aria-hidden="true"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>

          {/* Back link */}
          <div className="mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--yif-gold)] transition-colors hover:text-[var(--yif-gold-light)]"
            >
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M13 7H1M6 3L1 7l5 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </article>

      {/* ── Related posts ── */}
      {otherPosts.length > 0 && (
        <section className="border-t border-[var(--yif-cream-dark)] bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--yif-gold)]">
              Continue Reading
            </p>
            <h2 className="mb-10 font-display text-3xl font-semibold text-[var(--yif-navy)] sm:text-4xl">
              More from the Blog
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group flex flex-col rounded-xl border border-[var(--yif-cream-dark)] bg-[var(--yif-cream)] p-6 transition-shadow hover:shadow-md"
                >
                  {related.topic && (
                    <span
                      className="mb-3 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest text-white"
                      style={{
                        backgroundColor: related.topic.color ?? "#1a2744",
                      }}
                    >
                      {related.topic.name}
                    </span>
                  )}
                  <h3 className="mb-2 font-display text-xl font-semibold leading-snug text-[var(--yif-navy)] group-hover:text-[var(--yif-gold)] transition-colors">
                    {related.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--muted)] line-clamp-2">
                    {related.excerpt}
                  </p>
                  <span className="mt-4 text-xs font-semibold text-[var(--yif-gold)]">
                    {formatDate(related.publishedAt)} · {related.readTime ?? 5}{" "}
                    min
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
