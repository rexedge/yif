"use client";

import { generateHTML } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { useMemo } from "react";

interface RichTextRendererProps {
  content: unknown;
  className?: string;
}

export default function RichTextRenderer({
  content,
  className = "",
}: RichTextRendererProps) {
  const html = useMemo(() => {
    if (!content) return "";
    try {
      return generateHTML(content as Parameters<typeof generateHTML>[0], [
        StarterKit,
        Image,
        Link.configure({ openOnClick: false }),
      ]);
    } catch {
      return "";
    }
  }, [content]);

  return (
    <div
      className={[
        "prose prose-lg max-w-none",
        "prose-headings:font-display prose-headings:text-[var(--yif-navy)]",
        "prose-p:text-[var(--yif-navy)]/80 prose-p:leading-relaxed",
        "prose-a:text-[var(--yif-gold)] prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-[var(--yif-navy)]",
        "prose-img:rounded-xl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
