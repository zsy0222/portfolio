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

interface WikiReadme {
  title: string;
  content: string;
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
  } catch { /* fall through */ }
  return password === FALLBACK_PASSWORD;
}

// ── Simple markdown to JSX converter ──────────────────────────────────
function renderMarkdown(md: string): React.ReactNode[] {
  const lines = md.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Empty line → skip
    if (!line.trim()) {
      i++;
      continue;
    }

    // Heading ##
    if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={key++} className="text-[28px] font-semibold text-ink mt-10 mb-3">
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // Sub-heading ### or （一） style → same size as body
    if (line.startsWith("### ") || /^（[一二三四五六七]）/.test(line.trim())) {
      nodes.push(
        <h4 key={key++} className="text-[18px] font-semibold text-ink mt-6 mb-1">
          {line.startsWith("### ") ? line.slice(4) : line.trim()}
        </h4>
      );
      i++;
      continue;
    }

    // Collect paragraph: consecutive non-empty, non-heading lines
    let para = "";
    while (i < lines.length && lines[i].trim() && !lines[i].startsWith("## ") && !lines[i].startsWith("### ")) {
      para += (para ? " " : "") + lines[i].trim();
      i++;
    }
    if (!para) { i++; continue; }

    // Render inline: **bold**, [text](url), plain text
    const parts: Array<{ type: "text" | "bold" | "link"; text: string; url?: string }> = [];

    // Split by bold markers first
    const boldSplit = para.split(/(\*\*[^*]+\*\*)/g);
    for (const seg of boldSplit) {
      if (seg.startsWith("**") && seg.endsWith("**")) {
        parts.push({ type: "bold", text: seg.slice(2, -2) });
      } else {
        // Further split by [text](url) links
        let m;
        let sIdx = 0;
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
      if (part.type === "bold") {
        return <strong key={pi} className="font-semibold text-ink">{part.text}</strong>;
      }
      if (part.type === "link") {
        const isPdf = part.url?.endsWith(".pdf");
        return <a key={pi} href={part.url} target="_blank" rel="noopener noreferrer" download={isPdf || undefined} className={isPdf ? "text-[17px] font-medium text-lead hover:text-accent hover:underline underline-offset-4 transition-colors" : "inline-flex items-center gap-1.5 px-4 py-2 bg-accent/10 border border-accent/30 rounded-lg text-[17px] font-medium text-accent hover:bg-accent hover:text-white transition-all"}>{part.text}{isPdf ? "" : " ↗"}</a>;
      }
      return part.text;
    });

    nodes.push(
      <p key={key++} className="text-[18px] font-medium text-lead leading-[1.8] mb-4">
        {children}
      </p>
    );
  }

  return nodes;
}

// ── Component ──────────────────────────────────────────────────────────
export default function WikiPage() {
  const [authed, setAuthed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("wiki-auth") === "true";
  });
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [sections, setSections] = useState<WikiSection[]>([]);
  const [pages, setPages] = useState<WikiPageItem[]>([]);
  const [readme, setReadme] = useState<WikiReadme | null>(null);
  const [readmeOpen, setReadmeOpen] = useState(false);
  const [studyGuide, setStudyGuide] = useState<WikiReadme | null>(null);
  const [expandedSg, setExpandedSg] = useState(false);
  const [macroGuide, setMacroGuide] = useState<WikiReadme | null>(null);
  const [expandedMg, setExpandedMg] = useState(false);

  useEffect(() => {
    fetch("/api/wiki/sections")
      .then((r) => r.json())
      .then((data) => setSections(data.length ? data : FALLBACK_SECTIONS))
      .catch(() => setSections(FALLBACK_SECTIONS));
    fetch("/api/wiki/pages")
      .then((r) => r.json())
      .then((data) => setPages(data.length ? data : FALLBACK_PAGES))
      .catch(() => setPages(FALLBACK_PAGES));
    // Fetch README page specifically
    fetch("/api/wiki/pages/freshman-experience-summary")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data && data.content) setReadme(data); })
      .catch(() => {});
    // Fetch Study Guide
    fetch("/api/wiki/pages/calculus-1-readme")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data && data.content) setStudyGuide(data); })
      .catch(() => {});
    // Fetch Macro Study Guide
    fetch("/api/wiki/pages/macro-readme-index")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data && data.content) setMacroGuide(data); })
      .catch(() => {});
  }, []);

  const pagesBySection: Record<number, WikiPageItem[]> = {};
  for (const p of pages) {
    if (p.sectionSlug === "nju-guides") continue; // skip README section, shown above
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
      {/* ── Header ── */}
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

      {/* ── Password gate ── */}
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

      {/* ── README: Featured article (collapsible) ── */}
      {readme && (
        <section className="px-15 py-14 border-t border-line">
          <button
            onClick={() => setReadmeOpen((prev) => !prev)}
            className="flex items-center gap-3 text-left w-full cursor-pointer bg-transparent border-none p-0"
          >
            <span className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted">
              README
            </span>
            <h2 className="text-[36px] font-light text-ink group-hover:text-accent transition-colors">
              {readme.title}
            </h2>
            <span className={`text-[28px] text-ink/40 hover:text-accent ml-auto transition-transform duration-300 ${readmeOpen ? "rotate-90" : ""}`} title={readmeOpen ? "Collapse" : "Expand"}>
              ▸
            </span>
          </button>
          {readmeOpen && (
            <div className="max-w-[760px] mt-10">
              {renderMarkdown(readme.content)}
            </div>
          )}
        </section>
      )}

      {/* ── Sections & pages ── */}
      <section className="px-15 py-14 border-t border-line">
        <div className="flex flex-col gap-12">
          {sections.length === 0 ? (
            <div className="text-[20px] text-muted">Loading...</div>
          ) : (
            (() => {
                const filtered = sections.filter((s) => s.slug !== "nju-guides" && !s.slug.startsWith("macro-"));
                const calcSections = filtered.filter((s) => s.slug.startsWith("calculus-"));
                const macroSections = sections.filter((s) => s.slug.startsWith("macro-"));
                const otherSections = filtered.filter((s) => !s.slug.startsWith("calculus-"));

                const calcNotes = calcSections.filter((s) => s.slug.endsWith("-notes"));
                const calcTop = calcSections.filter((s) => !s.slug.endsWith("-notes") && s.slug !== "calculus-1-notes" && s.slug !== "calculus-2-notes");

                const calc1 = calcNotes.find((s) => s.slug === "calculus-1-notes");
                const calc2 = calcNotes.find((s) => s.slug === "calculus-2-notes");

                const renderSection = (section: WikiSection) => {
                  const sectionPages = pagesBySection[section.id] || [];
                  const isSG = section.slug === "calculus-readme";
                  return (
                    <div key={section.slug}>
                      {isSG ? (
                        <button
                          onClick={() => setExpandedSg((prev) => !prev)}
                          className="text-left w-full cursor-pointer bg-transparent border-none p-0 mb-4 group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted">Study Guide</span>
                            <span className={`text-[28px] text-ink/40 group-hover:text-accent ml-auto transition-transform duration-300 ${expandedSg ? "rotate-90" : ""}`}>▸</span>
                          </div>
                          <div className="text-[24px] font-light text-ink mt-1">微积分学科指导</div>
                        </button>
                      ) : (
                        <div className="text-[18px] font-medium tracking-[0.14em] uppercase text-muted mb-4 flex items-center gap-2">
                          {section.name.replace("Calculus I — ", "").replace("Calculus II — ", "")}
                          <span className="text-[14px] text-muted/60">{sectionPages.length}</span>
                        </div>
                      )}
                      {isSG && expandedSg && studyGuide && (
                        <div className="mb-8 pb-8 border-b border-line max-w-[760px]">
                          {renderMarkdown(studyGuide.content)}
                        </div>
                      )}
                      {!isSG && (
                      <div className="flex flex-col">
                        {sectionPages.length > 0 ? (
                          sectionPages.map((item, idx) => (
                            <div key={item.slug} className={`py-5 ${idx < sectionPages.length - 1 ? "border-b border-line" : ""}`}>
                              {authed ? (
                                <Link href={`/wiki/${item.slug}`} className="text-[20px] font-medium text-lead hover:text-accent transition-colors">
                                  {item.title}
                                </Link>
                              ) : (
                                <span className="text-[20px] font-medium text-muted cursor-default">{item.slug}.md</span>
                              )}
                            </div>
                          ))
                        ) : (
                          <span className="text-[18px] text-muted/50 italic">No pages yet</span>
                        )}
                      </div>
                      )}
                    </div>
                  );
                };

                return (
                  <>
                    {macroSections.length > 0 && (
                      <div>
                        <div className="text-[24px] font-semibold text-ink mb-2">Macroeconomics</div>
                        <div className="text-[18px] text-muted mb-8">宏观经济学</div>
                        <div className="ml-4 pl-6 border-l-2 border-line flex flex-col gap-8">
                          {/* Macro Study Guide (collapsible inline) */}
                          {(() => {
                            const mgSection = macroSections.find((s) => s.slug === "macro-readme");
                            if (mgSection) {
                              return (
                                <div>
                                  <button
                                    onClick={() => setExpandedMg((prev) => !prev)}
                                    className="text-left w-full cursor-pointer bg-transparent border-none p-0 mb-4 group"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted">Study Guide</span>
                                      <span className={`text-[28px] text-ink/40 group-hover:text-accent ml-auto transition-transform duration-300 ${expandedMg ? "rotate-90" : ""}`}>▸</span>
                                    </div>
                                    <div className="text-[24px] font-light text-ink mt-1">宏观经济学学科指导</div>
                                  </button>
                                  {expandedMg && macroGuide && (
                                    <div className="mb-8 pb-8 border-b border-line max-w-[760px]">
                                      {renderMarkdown(macroGuide.content)}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          })()}
                          {macroSections.filter((s) => s.slug !== "macro-readme").map(renderSection)}
                        </div>
                      </div>
                    )}
                    {otherSections.map(renderSection)}
                    {calcSections.length > 0 && (
                      <div>
                        <div className="text-[24px] font-semibold text-ink mb-2">Calculus</div>
                        <div className="text-[18px] text-muted mb-8">微积分 · 学科资料</div>
                        <div className="ml-4 pl-6 border-l-2 border-line flex flex-col gap-8">
                          {calcTop.map(renderSection)}
                          {calc1 && (
                            <div>
                              <div className="text-[20px] font-semibold text-ink mb-3">Calculus I</div>
                              <div className="text-[16px] text-muted mb-5">微积分一层次</div>
                              {renderSection(calc1)}
                            </div>
                          )}
                          {calc2 && (
                            <div>
                              <div className="text-[20px] font-semibold text-ink mb-3">Calculus II</div>
                              <div className="text-[16px] text-muted mb-5">微积分二层次</div>
                              {renderSection(calc2)}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
