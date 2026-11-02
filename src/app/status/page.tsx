"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import PasswordField from "@/components/PasswordField";
import Icon from "@/components/Icon";
import { useWorldLocale } from "@/components/world/WorldProvider";

interface Stats {
  wikiSections: number;
  wikiPages: number;
  blogPosts: number;
  projects: number;
}


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
    // Verification failures must remain locked; only the server can grant access.
  }
  return false;
}

const siteRoutes = [
  { path: "/", type: "Static", desc: "Homepage", descZh: "首页" },
  { path: "/projects", type: "Static", desc: "Projects showcase", descZh: "项目展示" },
  { path: "/blog", type: "Dynamic", desc: "Blog list with category filter", descZh: "支持分类筛选的文章列表" },
  { path: "/blog/[slug]", type: "SSG", desc: "Blog post detail (MDX)", descZh: "文章阅读页（MDX）" },
  { path: "/wiki", type: "Static", desc: "Wiki knowledge base (password)", descZh: "知识库（需密码）" },
  { path: "/wiki/ask", type: "Static", desc: "RAG semantic search (password)", descZh: "语义检索（需密码）" },
  { path: "/rss", type: "Static", desc: "RSS subscription guide", descZh: "RSS 订阅指南" },
  { path: "/about", type: "Static", desc: "About page", descZh: "个人档案" },
  { path: "/contact", type: "Static", desc: "Contact info", descZh: "联系方式" },
  { path: "/feed.xml", type: "Dynamic", desc: "RSS 2.0 feed", descZh: "RSS 2.0 订阅源" },
  { path: "/sitemap.xml", type: "Dynamic", desc: "Sitemap", descZh: "站点地图" },
];

const techStack = [
  { label: "Framework", labelZh: "框架", value: "Next.js 16 (Turbopack)" },
  { label: "Language", labelZh: "语言", value: "TypeScript 5" },
  { label: "Styling", labelZh: "样式", value: "Tailwind CSS v4" },
  { label: "Font", labelZh: "字体", value: "DM Sans" },
  { label: "MDX", labelZh: "文章渲染", value: "next-mdx-remote + Shiki" },
  { label: "RAG Model", labelZh: "语义检索模型", value: "all-MiniLM-L6-v2 (ONNX)" },
  { label: "DB", labelZh: "数据库", value: "Turso (LibSQL)" },
  { label: "Analytics", labelZh: "访问分析", value: "Vercel Analytics" },
  { label: "Deploy", labelZh: "部署", value: "Vercel" },
  { label: "CI/CD", labelZh: "持续集成", value: "GitHub Actions" },
];

export default function StatusPage() {
  const { t } = useWorldLocale();
  const [authed, setAuthed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("wiki-auth") === "true";
  });
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/status/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

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

  if (!authed) {
    return (
      <>
        <section className="px-6 sm:px-10 xl:px-15 pt-25 pb-16">
          <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
            {t("站点状态", "Status")}
          </div>
          <h1 className="text-[44px] font-light text-ink leading-[1.25] mb-5" style={{ textWrap: "balance" }}>
            {t("站点运行状态。", "Site status.")}
          </h1>
          <p className="text-[18px] text-muted mt-4">
            {t("输入密码以查看此内容。", "Password required to unlock content.")}
          </p>
        </section>
        <section className="px-6 sm:px-10 xl:px-15 pb-6">
          <form onSubmit={handleUnlock} className="ui-unlock-form">
            <PasswordField value={input} onChange={(value) => { setInput(value); setError(false); }} error={error} />
            <button
              type="submit"
              className="text-[16px] font-medium text-muted hover:text-accent transition-colors"
            >
              {t("解锁", "Unlock")} <Icon name="arrow-right" />
            </button>
          </form>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <section className="px-6 sm:px-10 xl:px-15 pt-25 pb-16">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          {t("站点状态", "Status")}
        </div>
        <h1 className="text-[44px] font-light text-ink leading-[1.25] mb-5" style={{ textWrap: "balance" }}>
          {t("站点运行状态。", "Site status.")}
        </h1>
        <p className="text-[20px] font-medium text-lead leading-[1.6] max-w-[520px]">
          {t("访问分析、内容统计与部署信息。", "Analytics, content stats, and deployment info.")}
        </p>
      </section>

      <section className="px-6 sm:px-10 xl:px-15 py-14 border-t border-line">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          {t("快捷入口", "Quick Links")}
        </div>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://vercel.com/chenmuqingtongyan/portfolio/analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[20px] font-medium text-ink border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            {t("Vercel 访问分析", "Vercel Analytics")} <Icon name="arrow-up-right" />
          </a>
          <a
            href="https://github.com/zsy0222/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[20px] font-medium text-ink border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            {t("GitHub 仓库", "GitHub Repo")} <Icon name="arrow-up-right" />
          </a>
          <a
            href="https://chenmuqingtongyan.vercel.app/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[20px] font-medium text-ink border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            {t("RSS 订阅源", "RSS Feed")} <Icon name="arrow-right" />
          </a>
        </div>
      </section>

      <section className="px-6 sm:px-10 xl:px-15 py-14 border-t border-line">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          {t("内容统计", "Content Stats")}
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats ? [
            { label: t("知识库分区", "Wiki Sections"), count: stats.wikiSections },
            { label: t("知识库页面", "Wiki Pages"), count: stats.wikiPages },
            { label: t("博客文章", "Blog Posts"), count: stats.blogPosts },
            { label: t("原项目档案", "Projects"), count: stats.projects },
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
            <div className="text-[20px] text-muted col-span-full">{t("正在加载统计…", "Loading stats...")}</div>
          )}
        </div>
      </section>

      <section className="px-6 sm:px-10 xl:px-15 py-14 border-t border-line">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          {t("页面路由", "Routes")}
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
                {t(route.type === "Static" ? "静态" : route.type === "Dynamic" ? "动态" : "静态生成", route.type)}
              </span>
              <span className="text-[18px] text-lead">
                {t(route.descZh, route.desc)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 sm:px-10 xl:px-15 py-14 border-t border-line">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          {t("技术架构", "Tech Stack")}
        </div>
        <div className="flex flex-col">
          {techStack.map((tech, idx) => (
            <div
              key={tech.label}
              className={`py-4 flex items-center justify-between gap-4 ${idx < techStack.length - 1 ? "border-b border-line" : ""}`}
            >
              <span className="text-[18px] font-medium text-muted">
                {t(tech.labelZh, tech.label)}
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
