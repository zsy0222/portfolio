"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useWorldLocale } from "./WorldProvider";

const destinations = [
  { href: "/world", zh: "创作室", en: "My World" },
  { href: "/lab", zh: "创作实验室", en: "Creative Lab" },
  { href: "/memories", zh: "旅行记忆", en: "Memories" },
  { href: "/thoughts", zh: "思想档案", en: "Thoughts" },
  { href: "/about", zh: "关于我", en: "About" },
];
const archives = [
  { href: "/learning", zh: "学习与科研", en: "Learning & Research" },
  { href: "/projects", zh: "工程项目档案", en: "Engineering archive" },
  { href: "/blog", zh: "全部文章", en: "All writing" },
  { href: "/wiki", zh: "知识库与课程资料", en: "Wiki & course resources" },
  { href: "/wiki/ask", zh: "知识库语义搜索", en: "Semantic wiki search" },
  { href: "/guestbook", zh: "留言簿", en: "Guestbook" },
  { href: "/contact", zh: "联系我", en: "Contact" },
  { href: "/rss", zh: "RSS 订阅", en: "RSS feed" },
  { href: "/status", zh: "站点状态", en: "Site status" },
];

export default function WorldNavigation() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useWorldLocale();
  const [dark, setDark] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      let next = false;
      try { next = localStorage.getItem("theme") === "dark"; } catch { /* Theme is optional. */ }
      setDark(next);
      document.documentElement.classList.toggle("dark", next);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!indexOpen) return;
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    dialog?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = overflow; trigger?.focus(); };
  }, [indexOpen]);
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch { /* Theme is optional. */ }
  };
  return <>
    <header className="world-nav">
      <Link href="/" className="world-brand" aria-label="Chenmu — Home"><span className="world-monogram" aria-hidden="true">c.</span><span>CHENMU<span className="world-brand-caption">PERSONAL DIGITAL WORLD</span></span></Link>
      <nav className="world-nav-links" aria-label={t("主要导航", "Main navigation")}>
        {destinations.map((item) => <Link key={item.href} href={item.href} aria-current={pathname.startsWith(item.href) ? "page" : undefined}>{t(item.zh, item.en)}</Link>)}
      </nav>
      <div className="world-nav-tools">
        <Link href="/search" className="world-tool search-tool" aria-label={t("全局搜索", "Search everything")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg></Link>
        <button className="world-tool locale-tool" onClick={() => setLocale(locale === "zh" ? "en" : "zh")} aria-label={locale === "zh" ? "Switch to English" : "切换为中文"}>{locale === "zh" ? "EN" : "中"}</button>
        <button className="world-tool theme-tool" onClick={toggleTheme} aria-label={dark ? t("浅色模式", "Light mode") : t("深色模式", "Dark mode")}>{dark ? "☼" : "◐"}</button>
        <button ref={triggerRef} className="world-tool index-tool" onClick={() => setIndexOpen(true)} aria-label={t("打开全部导航", "Open site index")} aria-haspopup="dialog"><span className="index-label">{t("目录", "Index")}</span><span aria-hidden="true">≡</span></button>
      </div>
    </header>
    {indexOpen && <dialog ref={dialogRef} className="world-index" aria-labelledby="world-index-title" onCancel={(event) => { event.preventDefault(); setIndexOpen(false); }} onClick={(event) => { if (event.target === event.currentTarget) setIndexOpen(false); }}>
      <div className="world-index-inner"><div className="world-index-top"><p className="world-eyebrow" id="world-index-title">{t("这个世界的目录", "An index of this world")}</p><button className="world-tool" onClick={() => setIndexOpen(false)} aria-label={t("关闭导航", "Close navigation")}>×</button></div>
      <nav aria-label={t("全部页面", "All pages")}><Link href="/" onClick={() => setIndexOpen(false)} className="world-index-home">{t("回到首页", "Back to the beginning")} ↗</Link><div className="world-index-grid">{[...destinations, ...archives].map((item, index) => <Link key={item.href} href={item.href} onClick={() => setIndexOpen(false)}><small>{String(index + 1).padStart(2, "0")}</small>{t(item.zh, item.en)}<span>↗</span></Link>)}</div></nav>
      <p className="world-index-note">A mind that builds, a world that remembers.</p></div>
    </dialog>}
  </>;
}
