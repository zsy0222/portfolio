"use client";

import { useState } from "react";
import Footer from "@/components/Footer";

const STATUS_PASSWORD = "nju2026";

const siteRoutes = [
  { path: "/", type: "Static", desc: "Homepage" },
  { path: "/projects", type: "Static", desc: "Projects showcase" },
  { path: "/blog", type: "Dynamic", desc: "Blog list with category filter" },
  { path: "/blog/[slug]", type: "SSG", desc: "Blog post detail (MDX)" },
  { path: "/wiki", type: "Static", desc: "Wiki knowledge base (password)" },
  { path: "/wiki/ask", type: "Static", desc: "RAG semantic search (password)" },
  { path: "/rss", type: "Static", desc: "RSS subscription guide" },
  { path: "/about", type: "Static", desc: "About page" },
  { path: "/contact", type: "Static", desc: "Contact info" },
  { path: "/feed.xml", type: "Dynamic", desc: "RSS 2.0 feed" },
  { path: "/sitemap.xml", type: "Dynamic", desc: "Sitemap" },
];

const contentStats = [
  { label: "Blog Posts", count: 4 },
  { label: "Wiki Items", count: 14 },
  { label: "Projects", count: 3 },
  { label: "Blog Categories", count: 5 },
  { label: "Wiki Sections", count: 6 },
  { label: "Embedded Docs", count: 18 },
];

const techStack = [
  { label: "Framework", value: "Next.js 16 (Turbopack)" },
  { label: "Language", value: "TypeScript 5" },
  { label: "Styling", value: "Tailwind CSS v4" },
  { label: "Font", value: "DM Sans" },
  { label: "MDX", value: "next-mdx-remote + Shiki" },
  { label: "RAG Model", value: "all-MiniLM-L6-v2 (ONNX)" },
  { label: "DB", value: "Turso (LibSQL)" },
  { label: "Analytics", value: "Vercel Analytics" },
  { label: "Deploy", value: "Vercel" },
  { label: "CI/CD", value: "GitHub Actions" },
];

export default function StatusPage() {
  const [authed, setAuthed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("wiki-auth") === "true";
  });
  const [input, setInput] = useState("");

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === STATUS_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem("wiki-auth", "true");
      setInput("");
    }
  };

  if (!authed) {
    return (
      <>
        <section className="px-15 pt-25 pb-16">
          <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
            Status
          </div>
          <h1 className="text-[44px] font-light text-ink leading-[1.25] mb-5" style={{ textWrap: "balance" }}>
            Site <span className="text-accent font-semibold">status</span>.
          </h1>
          <p className="text-[18px] text-muted mt-4">
            Password required to unlock content.
          </p>
        </section>
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
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <section className="px-15 pt-25 pb-16">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          Status
        </div>
        <h1 className="text-[44px] font-light text-ink leading-[1.25] mb-5" style={{ textWrap: "balance" }}>
          Site <span className="text-accent font-semibold">status</span>.
        </h1>
        <p className="text-[20px] font-medium text-lead leading-[1.6] max-w-[520px]">
          Analytics, content stats, and deployment info.
        </p>
      </section>

      <section className="px-15 py-14 border-t border-line">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          Quick Links
        </div>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://vercel.com/chenmuqingtongyan/portfolio/analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[20px] font-medium text-ink border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            Vercel Analytics &rarr;
          </a>
          <a
            href="https://github.com/zsy0222/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[20px] font-medium text-ink border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            GitHub Repo &rarr;
          </a>
          <a
            href="https://chenmuqingtongyan.vercel.app/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[20px] font-medium text-ink border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            RSS Feed &rarr;
          </a>
        </div>
      </section>

      <section className="px-15 py-14 border-t border-line">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          Content Stats
        </div>
        <div className="grid grid-cols-3 gap-6">
          {contentStats.map((stat) => (
            <div key={stat.label} className="border border-line rounded-lg p-6 bg-card">
              <div className="text-[40px] font-light text-accent mb-1">
                {stat.count}
              </div>
              <div className="text-[18px] font-medium text-lead">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-15 py-14 border-t border-line">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          Routes
        </div>
        <div className="flex flex-col">
          {siteRoutes.map((route, idx) => (
            <div
              key={route.path}
              className={`py-5 flex items-center gap-6 ${idx < siteRoutes.length - 1 ? "border-b border-line" : ""}`}
            >
              <code className="text-[18px] text-ink font-mono w-[180px] shrink-0">
                {route.path}
              </code>
              <span className="text-[16px] text-accent font-medium uppercase tracking-[0.1em] w-[80px] shrink-0">
                {route.type}
              </span>
              <span className="text-[18px] text-lead">
                {route.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-15 py-14 border-t border-line">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          Tech Stack
        </div>
        <div className="flex flex-col">
          {techStack.map((tech, idx) => (
            <div
              key={tech.label}
              className={`py-4 flex items-center justify-between gap-4 ${idx < techStack.length - 1 ? "border-b border-line" : ""}`}
            >
              <span className="text-[18px] font-medium text-muted">
                {tech.label}
              </span>
              <span className="text-[18px] font-medium text-lead">
                {tech.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
