"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { creativeWorks, workCategories, type CreativeWork, type WorkCategory } from "@/data/world";
import { useWorldLocale } from "./WorldProvider";
import "./lab.css";

export function WorkCover({ work, large = false }: { work: CreativeWork; large?: boolean }) {
  const { t, locale } = useWorldLocale();
  const [failed, setFailed] = useState(false);
  if (work.image && !failed) {
    return <div className={`lab-cover lab-cover-photo ${large ? "lab-cover-large" : ""}`} data-category={work.category}>
      <Image src={work.image} alt={work.title[locale]} fill sizes={large ? "(max-width: 800px) 100vw, 80vw" : "(max-width: 700px) 100vw, 50vw"} onError={() => setFailed(true)} />
      <span className="lab-media-tag">{work.imageKind === "photo" ? t("真实旅行照片", "Real travel photographs") : t("视觉设计作品", "Visual design artwork")}</span>
    </div>;
  }
  const symbols = { software: "{ }", research: "∴", worlds: "◇", film: "↗" };
  return <div className={`lab-cover lab-cover-diagram ${large ? "lab-cover-large" : ""}`} data-category={work.category} aria-label={t("项目文字封面，非作品渲染", "Typographic project cover, not a render")}>
    <span className="lab-cover-index">CHENMU / {work.category.toUpperCase()}</span>
    <div className="lab-cover-lines" aria-hidden="true"><span /><span /><span /><span /></div>
    <span className="lab-cover-symbol" aria-hidden="true">{symbols[work.category]}</span>
    <div className="lab-cover-foot"><span>{work.tags.slice(0, 2).join(" / ")}</span><span>{work.year}</span></div>
    {(work.category === "worlds" || work.category === "film") && <span className="lab-asset-note">{t("展陈素材待接入", "Exhibition media to come")}</span>}
  </div>;
}

export default function LabCatalog() {
  const { locale, t } = useWorldLocale();
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get("category") || "all";
  const category = workCategories.some((item) => item.id === rawCategory) ? rawCategory as WorkCategory : "all";
  const query = searchParams.get("q") || "";
  const normalized = query.toLocaleLowerCase().trim();
  const works = creativeWorks.filter((work) => (category === "all" || work.category === category) && (!normalized || [work.title.zh, work.title.en, work.summary.zh, work.summary.en, ...work.tags].join(" ").toLocaleLowerCase().includes(normalized)));
  const setFilter = (key: "category" | "q", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value); else params.delete(key);
    const next = params.size ? `/lab?${params}` : "/lab";
    if (key === "category") window.history.pushState(null, "", next);
    else window.history.replaceState(null, "", next);
  };
  return <div className="world-page lab-page">
    <header className="lab-heading">
      <p className="world-eyebrow">THE CREATIVE LAB / 01—04</p>
      <h1 className="world-title">{t("把想法，做成世界。", "Ideas, made into worlds.")}</h1>
      <p className="world-intro">{t("工程、研究、空间与影像。这里保留成品，也记录还在生长的过程。", "Engineering, research, space and film. A home for finished work and ideas still taking shape.")}</p>
      <span className="lab-heading-note">{t("持续学习 · 持续创造", "Still learning. Always making.")}</span>
    </header>
    <div className="lab-controls">
      <div className="lab-filters" role="group" aria-label={t("作品分类", "Work categories")}>
        <button type="button" aria-pressed={category === "all"} onClick={() => setFilter("category", "all")}>{t("全部作品", "All work")} <sup>{creativeWorks.length}</sup></button>
        {workCategories.map((item) => <button type="button" key={item.id} aria-pressed={category === item.id} onClick={() => setFilter("category", item.id)}><span>{item.number}</span> {item.label[locale]}</button>)}
      </div>
      <label className="lab-search"><span aria-hidden="true">⌕</span><span className="sr-only">{t("搜索作品", "Search works")}</span><input type="search" value={query} onChange={(event) => setFilter("q", event.target.value)} placeholder={t("搜索标题、技术或想法…", "Search a title, technology or idea…")} /></label>
    </div>
    <div className="lab-results-summary" aria-live="polite"><span>{t(`找到 ${works.length} 件作品`, `${works.length} works found`)}</span><span>{t("按创作领域探索", "Explore by field")}</span></div>
    {works.length ? <div className="lab-work-grid">{works.map((work, index) => <article key={work.slug} className="lab-work-entry">
      <Link href={`/lab/${work.slug}`} className="lab-cover-link" aria-label={`${t("查看", "View")} ${work.title[locale]}`}><WorkCover work={work} /></Link>
      <div className="lab-work-caption"><span className="lab-work-number">{String(index + 1).padStart(2, "0")}</span><div><p className="lab-work-kind">{workCategories.find((item) => item.id === work.category)?.label[locale]} <span> / {work.year}</span></p><h2><Link href={`/lab/${work.slug}`}>{work.title[locale]} <span aria-hidden="true">↗</span></Link></h2><p>{work.summary[locale]}</p><div className="lab-entry-bottom"><span className="lab-status"><i aria-hidden="true" />{work.status[locale]}</span><span className="lab-tags">{work.tags.slice(0, 2).map((tag) => `#${tag}`).join(" ")}</span></div></div></div>
    </article>)}</div> : <div className="lab-empty"><span aria-hidden="true">∅</span><h2>{t("暂时没有匹配的作品", "No matching work yet")}</h2><p>{t("换一个关键词，或回到全部作品继续探索。", "Try a different keyword or return to the full collection.")}</p><button type="button" className="world-button" onClick={() => window.history.pushState(null, "", "/lab")}>{t("清除筛选", "Clear filters")}</button></div>}
    <footer className="lab-archive-footer"><p>{t("每个作品都从一个问题开始。", "Every work begins with a question.")}</p><Link href="/projects">{t("查看原项目档案", "Original project archive")} ↗</Link></footer>
  </div>;
}
