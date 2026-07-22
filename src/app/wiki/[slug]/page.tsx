"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";

interface WikiPage {
  slug: string;
  title: string;
  content: string;
  section_name: string;
  section_slug: string;
}

// Markdown renderer (same as wiki page)
function renderMarkdown(md: string): React.ReactNode[] {
  const lines = md.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (line.startsWith("## ")) {
      nodes.push(<h2 key={key++} className="text-[28px] font-semibold text-ink mt-10 mb-3">{line.slice(3)}</h2>);
      i++; continue;
    }

    if (line.startsWith("### ") || /^（[一二三四五六七]）/.test(line.trim())) {
      nodes.push(<h4 key={key++} className="text-[20px] font-semibold text-ink mt-10 mb-4 border-b border-line pb-2">{line.startsWith("### ") ? line.slice(4) : line.trim()}</h4>);
      i++; continue;
    }

    let para = "";
    while (i < lines.length && lines[i].trim() && !lines[i].startsWith("## ") && !lines[i].startsWith("### ")) {
      para += (para ? " " : "") + lines[i].trim();
      i++;
    }
    if (!para) { i++; continue; }

    // Render inline: **bold**, [text](url), plain text
    const parts: Array<{ type: string; text: string; url?: string }> = [];
    const boldSplit = para.split(/(\*\*[^*]+\*\*)/g);
    for (const seg of boldSplit) {
      if (seg.startsWith("**") && seg.endsWith("**")) {
        parts.push({ type: "bold", text: seg.slice(2, -2) });
      } else {
        let m; let sIdx = 0;
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        while ((m = linkRegex.exec(seg)) !== null) {
          if (m.index > sIdx) parts.push({ type: "text", text: seg.slice(sIdx, m.index) });
          parts.push({ type: "link", text: m[1], url: m[2] });
          sIdx = m.index + m[0].length;
        }
        if (sIdx < seg.length) parts.push({ type: "text", text: seg.slice(sIdx) });
      }
    }
    const children = parts.map((part, pi) => {
      if (part.type === "bold") return <strong key={pi} className="font-semibold text-ink">{part.text}</strong>;
      if (part.type === "link") { const isDownload = /\.(pdf|docx|doc|xlsx|xls|pptx|ppt)$/i.test(part.url || ""); return <a key={pi} href={part.url} target="_blank" rel="noopener noreferrer" download={isDownload || undefined} className={isDownload ? "text-[17px] font-medium text-lead hover:text-accent hover:underline underline-offset-4 transition-colors" : "inline-flex items-center gap-1.5 px-4 py-2 bg-accent/10 border border-accent/30 rounded-lg text-[17px] font-medium text-accent hover:bg-accent hover:text-white transition-all"}>{part.text}{isDownload ? "" : " ↗"}</a>; }
      return part.text;
    });

    nodes.push(<p key={key++} className="text-[18px] font-medium text-lead leading-[1.8] mb-5">{children}</p>);
  }
  return nodes;
}

export default function WikiDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [page, setPage] = useState<WikiPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/wiki/pages/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setPage(data))
      .catch(() => setPage(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="px-15 pt-25 pb-16">
        <div className="text-[20px] text-muted">Loading...</div>
      </div>
    );
  }

  if (!page || (page as unknown as Record<string, unknown>).error) {
    return (
      <>
        <section className="px-15 pt-25 pb-16">
          <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">Wiki</div>
          <h1 className="text-[44px] font-light text-ink leading-[1.25] mb-5">Page not found.</h1>
          <Link href="/wiki" className="text-[20px] text-accent hover:underline">&larr; Back to Wiki</Link>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <section className="px-15 pt-25 pb-16">
        <div className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted mb-2">
          {page.section_name || "Wiki"}
        </div>
        <h1 className="text-[48px] font-light text-ink leading-[1.2] mb-5">
          {page.title}
        </h1>
        <Link href="/wiki" className="text-[20px] text-accent hover:underline">&larr; Back to Wiki</Link>
      </section>

      <section className="px-15 py-14 border-t border-line">
        <div className="max-w-[760px]">
          {page.content ? renderMarkdown(page.content) : (
            <p className="text-[20px] text-muted">No content yet.</p>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
