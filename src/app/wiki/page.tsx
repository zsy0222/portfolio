"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

interface WikiPageItem {
  id: number;
  slug: string;
  title: string;
  sectionId: number;
  sectionName: string;
  sectionSlug: string;
}

interface WikiSection {
  id: number;
  slug: string;
  name: string;
  pageCount: number;
}

const FALLBACK_PASSWORD = "nju2026";

const FALLBACK_SECTIONS: WikiSection[] = [
  { id: 1, slug: "frontend", name: "Frontend", pageCount: 3 },
  { id: 2, slug: "ai-agent", name: "AI Agent", pageCount: 3 },
  { id: 3, slug: "paper", name: "Paper", pageCount: 2 },
  { id: 4, slug: "project-record", name: "Project Record", pageCount: 2 },
  { id: 5, slug: "career", name: "Career", pageCount: 2 },
  { id: 6, slug: "misc", name: "Misc", pageCount: 2 },
];

const FALLBACK_PAGES: WikiPageItem[] = [
  { id: 1, slug: "next-notes", title: "Next.js Notes", sectionId: 1, sectionName: "Frontend", sectionSlug: "frontend" },
  { id: 2, slug: "vercel-deploy", title: "Vercel Deploy", sectionId: 1, sectionName: "Frontend", sectionSlug: "frontend" },
  { id: 3, slug: "css-template", title: "CSS Template", sectionId: 1, sectionName: "Frontend", sectionSlug: "frontend" },
  { id: 4, slug: "agents-md-spec", title: "AGENTS.md Spec", sectionId: 2, sectionName: "AI Agent", sectionSlug: "ai-agent" },
  { id: 5, slug: "rag-practice", title: "RAG Practice", sectionId: 2, sectionName: "AI Agent", sectionSlug: "ai-agent" },
  { id: 6, slug: "multi-agent-design", title: "Multi-Agent Design", sectionId: 2, sectionName: "AI Agent", sectionSlug: "ai-agent" },
  { id: 7, slug: "ai-product-papers", title: "AI Product Papers", sectionId: 3, sectionName: "Paper", sectionSlug: "paper" },
  { id: 8, slug: "quantitative-analysis-notes", title: "Quantitative Analysis Notes", sectionId: 3, sectionName: "Paper", sectionSlug: "paper" },
  { id: 9, slug: "portfolio-build-log", title: "Portfolio Build Log", sectionId: 4, sectionName: "Project Record", sectionSlug: "project-record" },
  { id: 10, slug: "git-operation-standard", title: "Git Operation Standard", sectionId: 4, sectionName: "Project Record", sectionSlug: "project-record" },
  { id: 11, slug: "resume-template", title: "Resume Template", sectionId: 5, sectionName: "Career", sectionSlug: "career" },
  { id: 12, slug: "job-match-logic", title: "Job Match Logic", sectionId: 5, sectionName: "Career", sectionSlug: "career" },
  { id: 13, slug: "npm-npx-diff", title: "npm vs npx", sectionId: 6, sectionName: "Misc", sectionSlug: "misc" },
  { id: 14, slug: "cloudbase-free-rule", title: "Cloudbase Free Rule", sectionId: 6, sectionName: "Misc", sectionSlug: "misc" },
];

async function verifyPassword(password: string): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.ok;
    }
  } catch {
    // API unreachable, fall through to hardcoded check
  }
  // Fallback: hardcoded password (works even if Turso/Vercel env vars not set)
  return password === FALLBACK_PASSWORD;
}

export default function WikiPage() {
  const [authed, setAuthed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("wiki-auth") === "true";
  });
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [sections, setSections] = useState<WikiSection[]>([]);
  const [pages, setPages] = useState<WikiPageItem[]>([]);

  useEffect(() => {
    fetch("/api/wiki/sections")
      .then((r) => r.json())
      .then((data) => setSections(data.length ? data : FALLBACK_SECTIONS))
      .catch(() => setSections(FALLBACK_SECTIONS));
    fetch("/api/wiki/pages")
      .then((r) => r.json())
      .then((data) => setPages(data.length ? data : FALLBACK_PAGES))
      .catch(() => setPages(FALLBACK_PAGES));
  }, []);

  const pagesBySection: Record<number, WikiPageItem[]> = {};
  for (const p of pages) {
    if (!pagesBySection[p.sectionId]) pagesBySection[p.sectionId] = [];
    pagesBySection[p.sectionId].push(p);
  }

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    try {
      const ok = await verifyPassword(input);
      if (ok) {
        setAuthed(true);
        sessionStorage.setItem("wiki-auth", "true");
        setInput("");
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  };

  return (
    <>
      <section className="px-15 pt-25 pb-16">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          Wiki
        </div>
        <h1 className="text-[56px] font-light text-ink leading-[1.2] mb-5" style={{ textWrap: "balance" }}>
          Knowledge <span className="text-accent font-semibold">base</span>.
        </h1>
        <p className="text-[24px] font-medium text-lead leading-[1.6] max-w-[520px]">
          Personal notes, snippets, references, and decisions.{" "}
          <Link href="/wiki/ask" className="text-accent hover:underline">
            Ask the knowledge base &rarr;
          </Link>
        </p>
        {!authed && (
          <p className="text-[18px] text-muted mt-4">
            Password required to unlock content.
          </p>
        )}
      </section>

      {!authed && (
        <section className="px-15 pb-6">
          <form onSubmit={handleUnlock} className="inline-flex items-center gap-3">
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Password to unlock"
              autoComplete="off"
              className="bg-card border border-line rounded-lg px-3 py-1.5 text-[16px] text-ink focus:outline-none focus:border-accent transition-colors w-[200px]"
            />
            <button
              type="submit"
              className="text-[16px] font-medium text-muted hover:text-accent transition-colors"
            >
              Unlock →
            </button>
          </form>
          {error && (
            <p className="text-[16px] text-red-400 mt-2">Wrong password, try again.</p>
          )}
        </section>
      )}

      <section className="px-15 py-14 border-t border-line">
        <div className="flex flex-col gap-12">
          {sections.length === 0 ? (
            <div className="text-[20px] text-muted">Loading...</div>
          ) : (
            sections.map((section) => {
              const sectionPages = pagesBySection[section.id] || [];
              return (
                <div key={section.slug}>
                  <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6 flex items-center gap-3">
                    {section.name}
                    <span className="text-[16px] text-muted/60">{sectionPages.length}</span>
                  </div>
                  <div className="flex flex-col">
                    {sectionPages.length > 0 ? (
                      sectionPages.map((item, idx) => (
                        <div
                          key={item.slug}
                          className={`py-6 ${idx < sectionPages.length - 1 ? "border-b border-line" : ""}`}
                        >
                          <span
                            className={`text-[22px] font-medium transition-colors ${
                              authed
                                ? "text-lead hover:text-accent cursor-pointer"
                                : "text-muted cursor-default"
                            }`}
                          >
                            {authed ? item.title : `${item.slug}.md`}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[20px] text-muted/50 italic">No pages yet</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
