"use client";

import Link from "next/link";
import { projects } from "@/data/projects";
import { getWorkBySlug } from "@/data/world";
import { useWorldLocale } from "./WorldProvider";
import "./lab.css";

/** The original six-project archive, with all original evidence retained. */
export default function ProjectArchive() {
  const { locale, t } = useWorldLocale();
  return <div className="world-page project-archive">
    <header className="lab-heading">
      <p className="world-eyebrow">PROJECTS & ENGINEERING / THE ORIGINAL ARCHIVE</p>
      <h1 className="world-title">{t("技术，遇见商业。", "Technology meets business.")}</h1>
      <p className="world-intro">{t("六项项目记录，涵盖程序分析、量化金融、前沿技术、国际商业、行业研究与可持续产品开发。", "Six projects spanning program analysis, quantitative finance, frontier technology, international business, industry research, and sustainable product development.")}</p>
      <div className="project-archive-heading-bottom"><span>{t("项目记录截至 2026-11-02；研究与回测结果为历史记录。", "Project records as of 2 November 2026; research and backtest results are historical.")}</span><Link href="/lab">{t("探索全部创作", "Explore the full Creative Lab")} ↗</Link></div>
    </header>
    <section aria-label={t("项目档案", "Selected project archive")}>
      {projects.map((project, index) => {
        const work = getWorkBySlug(project.id)!;
        const title = locale === "en" ? project.title : work.title.zh;
        return <article className="project-archive-entry" key={project.id}>
          <div className="project-archive-index"><span>{String(index + 1).padStart(2, "0")}</span><p>{locale === "en" ? project.status : work.status.zh}</p></div>
          <div className="project-archive-main">
            <h2><Link href={`/projects/${project.id}`}>{title}<span aria-hidden="true">↗</span></Link></h2>
            <p className="project-archive-description">{locale === "en" ? project.description : work.summary.zh}</p>
            <ul className="project-archive-tags" aria-label={t("技术与主题", "Technologies and topics")}>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            <div className="project-archive-record">
              <section><h3>{t("我的职责", "My role")}</h3><p>{locale === "en" ? project.role : work.sections[1].body.zh}</p></section>
              <section><h3>{t("实现与已有成果", "Selected outcomes")}</h3>{locale === "en" ? <ol>{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ol> : <p>{work.sections[2].body.zh}</p>}</section>
            </div>
            <div className="project-archive-links"><Link href={`/projects/${project.id}`}>{t("阅读项目详情", "Read the project notes")} →</Link>{project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" aria-label={t(`在 GitHub 查看${title}`, `View ${title} repository on GitHub`)}>{t("GitHub 仓库", "GitHub repository")} ↗</a>}{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">{t("打开演示", "Open demo")} ↗</a>}</div>
            {project.availability && <p className="project-archive-availability">{locale === "en" ? project.availability : work.availability?.zh || project.availability}</p>}
          </div>
        </article>;
      })}
    </section>
  </div>;
}
