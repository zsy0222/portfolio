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
      nodes.push(<h3 key={key++} className="text-[22px] font-semibold text-ink mt-8 mb-2">{line.startsWith("### ") ? line.slice(4) : line.trim()}</h3>);
      i++; continue;
    }

    let para = "";
    while (i < lines.length && lines[i].trim() && !lines[i].startsWith("## ") && !lines[i].startsWith("### ")) {
      para += (para ? " " : "") + lines[i].trim();
      i++;
    }
    if (!para) { i++; continue; }

    const parts = para.split(/(\*\*[^*]+\*\*)/g);
    const children = parts.map((part, pi) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={pi} className="font-semibold text-ink">{part.slice(2, -2)}</strong>
        : part
    );

    nodes.push(<p key={key++} className="text-[18px] font-medium text-lead leading-[1.8] mb-4">{children}</p>);
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
