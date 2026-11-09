"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import PasswordField from "@/components/PasswordField";
import Icon from "@/components/Icon";

interface Stats {
  wikiSections: number;
  wikiPages: number;
  blogPosts: number;
  projects: number;
}

interface VisitorStats {
  browsers: number;
  returning: number;
  visits: number;
}

async function fetchVisitorStats() {
  const response = await fetch("/api/status/visitors", { cache: "no-store" });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Visitor statistics unavailable");
  return await response.json() as VisitorStats;
}

async function verifyPassword(password: string, scope: "status" | "visitor-report"): Promise<"report" | "wiki" | null> {
  try {
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, scope }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.ok) return data.reportAccess === true ? "report" : "wiki";
    }
  } catch {
    // Verification failures must remain locked; only the server can grant access.
  }
  return null;
}

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
  const [authed, setAuthed] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);
  const [visitorState, setVisitorState] = useState<"loading" | "locked" | "ready" | "unavailable">("loading");
  const [reportCode, setReportCode] = useState("");
  const [reportError, setReportError] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/status/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
    let active = true;
    fetchVisitorStats().then((data) => {
      if (!active) return;
      setVisitorStats(data);
      setVisitorState(data ? "ready" : "locked");
      if (data) setAuthed(true);
      else {
        try { setAuthed(sessionStorage.getItem("wiki-auth") === "true"); } catch {}
      }
    }).catch(() => {
      if (active) setVisitorState("unavailable");
    }).finally(() => {
      if (active) setCheckingAccess(false);
    });
    return () => { active = false; };
  }, []);

  async function refreshVisitorStats() {
    setVisitorState("loading");
    try {
      const data = await fetchVisitorStats();
      setVisitorStats(data);
      setVisitorState(data ? "ready" : "locked");
    } catch {
      setVisitorState("unavailable");
    }
  }

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const access = await verifyPassword(input, "status");
    setError(!access);
    if (!access) return;
    setAuthed(true);
    setInput("");
    if (access === "wiki") {
      try { sessionStorage.setItem("wiki-auth", "true"); } catch {}
    }
    await refreshVisitorStats();
  };

  const handleReportUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportError(false);
    const access = await verifyPassword(reportCode, "visitor-report");
    if (access !== "report") {
      setReportError(true);
      return;
    }
    setReportCode("");
    await refreshVisitorStats();
  };

  if (!authed) {
    return (
      <div className="utility-page">
        <section className="px-6 sm:px-10 xl:px-15 pt-25 pb-16">
          <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
            Status
          </div>
          <h1 className="text-[44px] font-light text-ink leading-[1.25] mb-5" style={{ textWrap: "balance" }}>
            Site <span className="text-accent font-semibold">status</span>.
          </h1>
          <p className="text-[18px] text-muted mt-4">
            {checkingAccess ? "Checking access…" : "Password required to unlock content."}
          </p>
        </section>
        <section className="px-6 sm:px-10 xl:px-15 pb-6">
          {!checkingAccess && <form onSubmit={handleUnlock} className="ui-unlock-form">
            <PasswordField value={input} onChange={(value) => { setInput(value); setError(false); }} error={error} />
            <button
              type="submit"
              className="text-[16px] font-medium text-muted hover:text-accent transition-colors"
            >
              Unlock <Icon name="arrow-right" />
            </button>
          </form>}
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="utility-page">
      <section className="px-6 sm:px-10 xl:px-15 pt-25 pb-16">
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

      <section className="px-6 sm:px-10 xl:px-15 py-14 border-t border-line">
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
            Vercel Analytics <Icon name="arrow-up-right" />
          </a>
          <a
            href="https://github.com/zsy0222/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[20px] font-medium text-ink border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            GitHub Repo <Icon name="arrow-up-right" />
          </a>
          <a
            href="https://chenmuqingtongyan.vercel.app/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[20px] font-medium text-ink border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            RSS Feed <Icon name="arrow-right" />
          </a>
        </div>
      </section>

      <section className="px-6 sm:px-10 xl:px-15 py-14 border-t border-line" lang="zh-CN" aria-labelledby="visitor-stats-title">
        <h2 id="visitor-stats-title" className="text-[20px] font-medium text-ink mb-3">访客与回访 · 最近 30 天</h2>
        <p className="text-muted mb-6">仅含同意统计的浏览器。间隔 30 分钟或跨天后再次打开计为新一次访问。回访基于最近 90 天记录，按北京时间统计。</p>
        {visitorStats ? (
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: "独立浏览器", count: visitorStats.browsers },
              { label: "仅首次到访", count: visitorStats.browsers - visitorStats.returning },
              { label: "有过回访", count: visitorStats.returning },
              { label: "访问次数", count: visitorStats.visits },
            ].map(({ label, count }) => (
              <div className="ui-surface border border-line p-6 bg-card" key={label}>
                <dt className="text-muted">{label}</dt>
                <dd className="text-[36px] font-light text-accent">{count.toLocaleString("zh-CN")}</dd>
              </div>
            ))}
          </dl>
        ) : visitorState === "locked" ? (
          <form onSubmit={handleReportUnlock} className="ui-unlock-form">
            <PasswordField id="visitor-report-code" label="访客报表访问码" placeholder="输入访问码" errorMessage="访问码不正确，请重试。" value={reportCode} onChange={(value) => { setReportCode(value); setReportError(false); }} error={reportError} />
            <button type="submit" className="text-[16px] font-medium text-muted hover:text-accent transition-colors">
              解锁访客统计 <Icon name="arrow-right" />
            </button>
          </form>
        ) : <p role="status" className="text-muted">{visitorState === "unavailable" ? "暂时无法读取访客统计。" : "正在读取访客统计…"}</p>}
      </section>

      <section className="px-6 sm:px-10 xl:px-15 py-14 border-t border-line">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          Content Stats
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats ? [
            { label: "Wiki Sections", count: stats.wikiSections },
            { label: "Wiki Pages", count: stats.wikiPages },
            { label: "Blog Posts", count: stats.blogPosts },
            { label: "Projects", count: stats.projects },
          ].map((s) => (
            <div key={s.label} className="ui-surface border border-line p-6 bg-card">
              <div className="text-[40px] font-light text-accent mb-1">
                {s.count}
              </div>
              <div className="text-[18px] font-medium text-lead">
                {s.label}
              </div>
            </div>
          )) : (
            <div className="text-[20px] text-muted col-span-full">Loading stats...</div>
          )}
        </div>
      </section>

      <section className="px-6 sm:px-10 xl:px-15 py-14 border-t border-line">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          Routes
        </div>
        <div className="flex flex-col">
          {siteRoutes.map((route, idx) => (
            <div
              key={route.path}
              className={`py-5 flex flex-wrap items-center gap-x-6 gap-y-2 ${idx < siteRoutes.length - 1 ? "border-b border-line" : ""}`}
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

      <section className="px-6 sm:px-10 xl:px-15 py-14 border-t border-line">
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
    </div>
  );
}
