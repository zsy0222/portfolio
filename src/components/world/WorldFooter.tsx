"use client";
import Link from "next/link";
import { useWorldLocale } from "./WorldProvider";

export default function WorldFooter() {
  const { t } = useWorldLocale();
  return <footer className="world-footer">
    <div className="world-footer-main"><Link href="/" className="world-footer-logo">CHENMU</Link><p>{t("在学习中生长，在创造中留下痕迹。", "Still learning. Always making.")}</p><Link href="/contact" className="world-contact-link">{t("让想法相遇", "Let’s exchange ideas")} ↗</Link></div>
    <div className="world-footer-bottom"><span>© 2026 CHENMU · {t("一个不断生长的世界", "A world in progress")}</span><nav aria-label={t("页脚导航", "Footer navigation")}><Link href="/wiki">{t("知识库", "Wiki")}</Link><Link href="/blog">{t("文章", "Journal")}</Link><Link href="/guestbook">{t("留言簿", "Guestbook")}</Link><Link href="/rss">RSS</Link><a href="https://github.com/zsy0222/portfolio" target="_blank" rel="noreferrer">GitHub ↗</a></nav><span>南京 / NANJING</span></div>
  </footer>;
}
