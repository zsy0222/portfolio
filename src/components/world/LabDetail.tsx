"use client";

import Link from "next/link";
import { type CreativeWork, workCategories, creativeWorks } from "@/data/world";
import { useWorldLocale } from "./WorldProvider";
import { WorkCover } from "./LabCatalog";
import "./lab.css";

export default function LabDetail({ work }: { work: CreativeWork }) {
  const { locale, t } = useWorldLocale();
  const category = workCategories.find((item) => item.id === work.category)!;
  const related = creativeWorks.filter((item) => item.category === work.category && item.slug !== work.slug).slice(0, 2);
  return <article className="world-page lab-detail">
    <Link className="lab-back" href={`/lab?category=${work.category}`}>← {t("返回", "Back to")} {category.label[locale]}</Link>
    <header className="lab-detail-header"><p className="world-eyebrow">CREATIVE LAB / {category.number} / {work.year}</p><h1 className="world-title">{work.title[locale]}</h1><p className="world-intro">{work.summary[locale]}</p><div className="lab-detail-facts"><span className="lab-status"><i aria-hidden="true" />{work.status[locale]}</span><span>{work.tags.map((tag) => `#${tag}`).join(" · ")}</span></div></header>
    <WorkCover work={work} large />
    <div className="lab-detail-layout">
      <aside className="lab-detail-aside"><span className="world-eyebrow">PROJECT NOTES</span><nav aria-label={t("项目目录", "Project contents")}>{work.sections.map((section, index) => <a key={index} href={`#note-${index}`}>{String(index + 1).padStart(2, "0")} {section.title[locale]}</a>)}</nav><div className="lab-detail-provenance"><span>{t("档案状态", "Archive status")}</span><p>{t("截至 2026-11-02 整理；沿用已有项目记录与确认的创作需求。", "Curated as of 2 November 2026, from existing project records and confirmed creative briefs.")}</p></div></aside>
      <div className="lab-detail-body">{work.sections.map((section, index) => <section id={`note-${index}`} key={index}><span className="lab-section-number">{String(index + 1).padStart(2, "0")}</span><h2>{section.title[locale]}</h2><p>{section.body[locale]}</p></section>)}
        {work.videoUrl && <section><h2>{t("观看作品", "Watch the work")}</h2><video controls playsInline preload="none" poster={work.image} src={work.videoUrl}><a href={work.videoUrl}>{t("打开视频文件", "Open video file")}</a></video></section>}
        {work.modelUrl && <section><h2>{t("模型资源", "Model asset")}</h2><a className="world-button" href={work.modelUrl}>{t("下载 GLB 模型", "Download GLB model")} ↓</a></section>}
        {work.availability && <aside className="lab-availability"><span>{t("公开范围", "Availability")}</span><p>{work.availability[locale]}</p></aside>}
        {!!work.links?.length && <div className="lab-detail-links">{work.links.map((link) => <Link className="world-button" key={link.href} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}>{link.label[locale]} ↗</Link>)}</div>}
      </div>
    </div>
    {related.length > 0 && <section className="lab-related"><div><p className="world-eyebrow">CONTINUE EXPLORING</p><h2>{t("接着看一看", "Keep exploring")}</h2></div>{related.map((item) => <Link key={item.slug} href={`/lab/${item.slug}`}><span>{item.title[locale]}</span><span aria-hidden="true">↗</span></Link>)}</section>}
  </article>;
}
