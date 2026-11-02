"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useWorldLocale } from "./WorldProvider";
import { memories, type Memory } from "@/data/memories";
import { experiences } from "@/data/experiences";
import type { BlogPost } from "@/lib/blog";
import { articleTranslations } from "@/data/article-translations";
import "./archive.css";


function MemoryPhoto({ memory, large = false }: { memory: Memory; large?: boolean }) {
  const { locale, t } = useWorldLocale();
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const current = dialog.current;
    const returnFocusTo = trigger.current;
    const previousOverflow = document.body.style.overflow;
    current?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      current?.close();
      document.body.style.overflow = previousOverflow;
      returnFocusTo?.focus({ preventScroll: true });
    };
  }, [open]);
  if (!memory.image) return null;
  return <>
    <button ref={trigger} className={`archive-photo-trigger ${large ? "archive-photo-large" : ""}`} onClick={() => { setFailed(false); setOpen(true); }} aria-haspopup="dialog" aria-label={t("放大呼伦贝尔旅行照片", "Enlarge the Hulunbuir travel photographs")}>
      <Image src={memory.image} alt={t("2025 年夏天与高中同学在呼伦贝尔的真实旅行照片拼图", "Original photo collage from the summer 2025 Hulunbuir trip with high-school friends")} fill sizes={large ? "(max-width: 800px) 90vw, 900px" : "(max-width: 800px) 90vw, 50vw"} priority={!large} />
      <span className="archive-photo-expand">{t("查看原图", "View photograph")} <span aria-hidden="true">↗</span></span>
    </button>
    {open && <dialog ref={dialog} className="archive-lightbox" aria-label={t("旅行影像展览", "Travel photograph exhibition")} onCancel={(e) => { e.preventDefault(); setOpen(false); }} onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <button className="archive-lightbox-close" onClick={() => setOpen(false)} aria-label={t("关闭图片", "Close photograph")}>×</button>
      <figure>
        {failed ? <p role="status">{t("图片暂时无法加载，请关闭后重试。", "The photograph could not load. Close the viewer and try again.")}</p> : <Image src={memory.image} alt={memory.title[locale]} width={1254} height={1254} sizes="90vw" onError={() => setFailed(true)} />}
        <figcaption>{memory.period[locale]} · {t("真实旅行摄影 / 原始拼图", "Original travel photography / photo collage")}</figcaption>
      </figure>
    </dialog>}
  </>;
}

export function MemoriesIndex() {
  const { locale, t } = useWorldLocale();
  const featured = memories[0];
  return <div className="world-page archive-page">
    <header className="archive-intro">
      <p className="world-eyebrow">03 / TRAVEL MEMORIES</p>
      <h1 className="world-title">{t("世界很大。记忆很近。", "A wide world. A close memory.")}</h1>
      <p className="world-intro">{t("不只是去过哪里。也记下某个瞬间，世界曾怎样让我感动。", "Not only where I have been, but how the world felt in a moment I wanted to keep.")}</p>
    </header>
    <section className="archive-memory-feature" aria-labelledby="featured-memory">
      <div className="archive-memory-copy">
        <div className="archive-catalogue-label"><span>EXHIBITION 001</span><span>{featured.period[locale]}</span></div>
        <p className="archive-place-name">HULUNBUIR</p>
        <h2 id="featured-memory">{featured.subtitle[locale]}</h2>
        <p>{featured.summary[locale]}</p>
        <Link className="world-button" href="/memories/hulunbuir">{t("走进这段记忆", "Enter this memory")} <span aria-hidden="true">↗</span></Link>
        <span className="archive-media-tag">{t("真实摄影 · 个人叙述", "Original photography · Personal account")}</span>
      </div>
      <div className="archive-memory-frame"><MemoryPhoto memory={featured} /><span className="archive-frame-caption">{t("草坡、朋友，以及慢慢落下的太阳。", "Rolling hills, friends, and a slowly setting sun.")}</span></div>
    </section>
    <section className="archive-section" aria-labelledby="memory-index">
      <div className="archive-section-heading"><div><p className="world-eyebrow">PLACES IN THE ARCHIVE</p><h2 id="memory-index">{t("地图还在展开", "The map keeps unfolding")}</h2></div><p>{t("每一页，都等待真实的故事。", "Each page makes room for a real story.")}</p></div>
      <div className="archive-memory-list">
        {memories.slice(1).map((memory, index) => <Link key={memory.slug} href={`/memories/${memory.slug}`} className="archive-memory-row">
          <span className="archive-index-number">{String(index + 2).padStart(2, "0")}</span>
          <div><h3>{memory.title[locale]}</h3><p>{memory.subtitle[locale]}</p></div>
          <span className="archive-memory-status">{t("素材整理中", "Being curated")}</span><span aria-hidden="true">↗</span>
        </Link>)}
      </div>
    </section>
    <aside className="archive-provenance"><span aria-hidden="true">◎</span><p>{t("这里的旅行照片来自真实经历。数字场景与生成视觉作品会单独标注；缺少的照片、视频和路线，留待原始素材到位。", "Travel photographs here come from real experiences. Digital scenes and generated artworks are labelled separately; missing photographs, video and routes wait for the original material.")}</p></aside>
  </div>;
}

export function MemoryDetail({ memory }: { memory: Memory }) {
  const { locale, t } = useWorldLocale();
  const isFeatured = memory.slug === "hulunbuir";
  return <article className="world-page archive-page archive-memory-detail">
    <Link className="archive-back" href="/memories">← {t("旅行记忆博物馆", "Travel memories")}</Link>
    <header className="archive-intro"><p className="world-eyebrow">{memory.period[locale]} / {memory.kind === "photo" ? "PERSONAL RECORD" : "ARCHIVE ENTRY"}</p><h1 className="world-title">{memory.title[locale]}</h1><p className="archive-story-subtitle">{memory.subtitle[locale]}</p></header>
    <div className="archive-location"><span aria-hidden="true">◉</span><span>{memory.location[locale]}</span><span>{t("区域记录", "Regional record")}</span></div>
    {memory.image ? <figure className="archive-story-photo"><MemoryPhoto memory={memory} large /><figcaption>{t("2025 年夏天 · 真实旅行摄影。点击图片进入沉浸浏览。", "Summer 2025 · Original travel photography. Select the image to open the immersive viewer.")}</figcaption></figure> : <div className="archive-pending-art"><span className="archive-pending-word">{memory.title.en.toUpperCase()}</span><span>{t("原始影像待整理", "Original media being curated")}</span></div>}
    <div className="archive-story-layout"><aside><p className="world-eyebrow">FIELD NOTES</p><nav aria-label={t("本页章节", "Page chapters")}><a href="#story">{t("旅行故事", "The story")}</a><a href="#route">{t("区域与路线", "Place & route")}</a><a href="#moving-image">{t("动态影像", "Moving images")}</a></nav></aside><div>
      <section id="story" className="archive-story-text"><h2>{t("把感受留在这一页", "Keeping the feeling on this page")}</h2>{memory.story.map((paragraph, i) => <p key={i}>{paragraph[locale]}</p>)}</section>
      <section id="route" className="archive-route-section"><p className="world-eyebrow">PLACE / ROUTE</p><h2>{t("一段旅程的坐标", "Locating the memory")}</h2>
        <div className="archive-region-map"><div className="archive-map-rings" aria-hidden="true"><i /><i /><i /><span>◉</span></div><div><span className="archive-media-tag">{t("区域定位示意", "Schematic region locator")}</span><h3>{memory.location[locale]}</h3><p>{t("具体停靠点、日期和行进顺序待确认，暂不绘制行程线。", "Stops, dates and their order are not yet confirmed, so no itinerary is drawn.")}</p><a href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(memory.title.en)}`} target="_blank" rel="noreferrer">{t("在地图中查找地区", "Find the region on a map")} ↗</a></div></div>
      </section>
      <section id="moving-image" className="archive-film-note"><span aria-hidden="true">▷</span><div><h2>{t("让记忆慢慢动起来", "Let the memory move")}</h2><p>{isFeatured ? t("旅行 Vlog 正在整理。完成的视频与路线动画将在确认素材后加入，这里先保留照片与文字。", "The travel vlog is being curated. Finished video and route animations will join the archive when their source material is confirmed; photographs and words begin the story here.") : t("本条记录暂未提供公开视频。", "No public video has been supplied for this record yet.")}</p></div></section>
      {memory.relatedHref && <Link className="archive-related" href={memory.relatedHref}><span className="world-eyebrow">CONTINUE THE STORY</span><strong>{isFeatured ? t("如果记忆可以被重新感受", "What if a memory could be felt again?") : t("马来西亚数字技术研究项目", "Digital technology research in Malaysia")}</strong><span>{t("阅读相关记录", "Read the related record")} ↗</span></Link>}
    </div></div>
  </article>;
}

const learningShelves = [
  { zh: "软件工程", en: "Engineering", subZh: "计算机基础与系统构建", subEn: "Computer foundations & systems", href: "/wiki", bodyZh: "把计算机基础课程、开发笔记与实际系统连接起来。已有知识库保留专题笔记、课程资料和学习记录，可从中继续阅读。", bodyEn: "Connecting computer science foundations, development notes and working systems. The existing knowledge base retains topic notes, course materials and learning records for further reading." },
  { zh: "人工智能", en: "Artificial intelligence", subZh: "大语言模型与智能体", subEn: "Language models & agents", href: "/lab?category=research", bodyZh: "关注大语言模型如何参与分析、推理与产品构建。研究目录集中展示已有 AI 相关项目，并保留研究进行中与原型阶段的区别。", bodyEn: "Exploring how language models support analysis, reasoning and product development. The research catalogue brings together existing AI projects while distinguishing ongoing research from prototypes." },
  { zh: "程序分析", en: "Program analysis", subZh: "切片、验证与程序修复", subEn: "Slicing, validation & repair", href: "/projects/assertion-guided-cascaded-hybrid-slicing", bodyZh: "围绕 LLM 辅助形式化程序分析，探索程序切片、错误定位与约束修复。项目详情记录研究问题、个人工作和当前实验范围。", bodyEn: "Research into program slicing, fault localisation and constrained repair within LLM-assisted formal program analysis. The project record explains the research question, personal contributions and current experimental scope." },
  { zh: "未来技术", en: "Future technology", subZh: "脑机接口与主观体验", subEn: "Brain interfaces & experience", href: "/blog/experience-recording-and-replay", bodyZh: "从脑机接口行业研究走向关于记忆与主观体验的提问。个人随想与技术事实保持区分：想象一个方向，并不意味着它已经能够实现。", bodyEn: "Moving from brain–computer interface industry research to questions about memory and subjective experience. Personal speculation remains distinct from technical evidence: imagining a direction does not mean it has already been achieved." },
  { zh: "经济与商业", en: "Economics & business", subZh: "量化研究与商业创新", subEn: "Quantitative research & innovation", href: "/projects/cost-aware-asynchronous-quantitative-strategy", bodyZh: "用经济学与商业分析理解技术的应用环境，也通过量化项目练习数据分析、回测与证据核查。历史回测结果保留其样本与实验限制。", bodyEn: "Using economics and business analysis to understand the settings in which technology is applied, and quantitative projects to practise analysis, backtesting and evidence checks. Historical backtests retain their sample and experimental limitations." },
  { zh: "论文与行业", en: "Papers & industry", subZh: "阅读、证据与研究记录", subEn: "Reading, evidence & research", href: "/lab?category=research", bodyZh: "从养老设备、数字技术出海到脑机接口，整理行业问题、资料来源与研究过程。尚未公开的论文和实地材料仍遵循原项目的公开范围。", bodyEn: "Organising questions, sources and research processes across elderly-care equipment, digital expansion and brain–computer interfaces. Unreleased papers and field materials retain their original publication boundaries." },
];

export function LearningArchive({ posts }: { posts: BlogPost[] }) {
  const { locale, t } = useWorldLocale();
  const selected = posts.filter((post) => ["summer-projects-2026", "experience-recording-and-replay", "sunlit-elf-live-wallpaper"].includes(post.slug));
  return <div className="world-page archive-page">
    <header className="archive-intro"><p className="world-eyebrow">02 / LEARNING & RESEARCH</p><h1 className="world-title">{t("好奇心，有自己的书架。", "A bookshelf for curiosity.")}</h1><p className="world-intro">{t("从一门课、一篇论文、一个问题开始。把知识连成线，再试着用它构建一些东西。", "Start with a course, a paper, a question. Connect what I learn, then try to build something with it.")}</p></header>
    <section className="archive-bookshelf" aria-label={t("按专题浏览", "Browse by subject")}>{learningShelves.map((shelf, i) => <Link key={shelf.en} href={shelf.href} className="archive-book" data-index={i}><span className="archive-book-number">0{i + 1}</span><h2>{t(shelf.zh, shelf.en)}</h2><p>{t(shelf.subZh, shelf.subEn)}</p><span className="archive-book-arrow" aria-hidden="true">↗</span></Link>)}</section>
    <section className="archive-topic-notes" aria-label={t("专题导读", "Subject reading guides")}>{learningShelves.map((shelf) => <details key={shelf.en}><summary><span>{t(shelf.zh, shelf.en)}</span><span aria-hidden="true">+</span></summary><p>{t(shelf.bodyZh, shelf.bodyEn)}</p><Link href={shelf.href}>{t("打开相关资料", "Open related material")} <span aria-hidden="true">↗</span></Link></details>)}</section>
    <section className="archive-section"><div className="archive-section-heading"><div><p className="world-eyebrow">FROM THE NOTEBOOK</p><h2>{t("知识走向实践", "From learning to making")}</h2></div><Link href="/thoughts">{t("全部文章", "All writing")} ↗</Link></div><div className="archive-reading-list">{selected.map((post) => <ArticleRow key={post.slug} post={post} />)}</div></section>
    <section className="archive-section archive-resource-section"><div><p className="world-eyebrow">OPEN THE LIBRARY</p><h2>{t("课程资料与知识库", "Course materials & knowledge base")}</h2><p>{t("保留原有知识库、专题笔记与课程文件，随学习进度继续更新。课程资料保留原语言。", "The existing knowledge base, topic notes and course files remain available and can grow with my learning. Course documents retain their original language.")}</p><Link className="world-button" href="/wiki">{t("进入完整知识库", "Open the full knowledge base")} ↗</Link></div><div className="archive-resource-links"><a href="/files/micro-review/微观经济学-详细框架.pdf" target="_blank" rel="noreferrer"><span>PDF</span><strong>{t("微观经济学 · 详细框架", "Microeconomics · detailed framework")}</strong><span aria-hidden="true">↗</span></a><a href="/files/calculus-1-notes/31不定积分.pdf" target="_blank" rel="noreferrer"><span>PDF</span><strong>{t("微积分 · 不定积分笔记", "Calculus · indefinite integral notes")}</strong><span aria-hidden="true">↗</span></a><Link href="/wiki/ask"><span>AI</span><strong>{t("向知识库提问", "Ask the knowledge base")}</strong><span aria-hidden="true">↗</span></Link></div></section>
    <div className="archive-closing-line">{locale === "zh" ? "Still learning. Always making." : "Learning is a practice, not a finish line."}</div>
  </div>;
}

function ArticleRow({ post }: { post: BlogPost }) {
  const { locale, t } = useWorldLocale();
  const translation = articleTranslations[post.slug];
  const title = translation?.title[locale] || post.title;
  const summary = translation?.summary[locale] || post.summary;
  return <Link className="archive-article-row" href={`/blog/${post.slug}`}><time dateTime={post.date}>{post.date.slice(0, 10).replaceAll("-", ".")}</time><div><h3>{title}</h3><p>{summary}</p></div><span aria-label={t("阅读文章", "Read article")}>↗</span></Link>;
}

export function ThoughtsArchive({ posts }: { posts: BlogPost[] }) {
  const { locale, t } = useWorldLocale();
  const [filter, setFilter] = useState("all");
  const filtered = posts.filter((post) => filter === "all" || (filter === "making" ? post.category === "projects" : post.category !== "projects"));
  const featured = posts.find((post) => post.slug === "experience-recording-and-replay");
  return <div className="world-page archive-page">
    <header className="archive-intro"><p className="world-eyebrow">04 / THOUGHTS & DREAMS</p><h1 className="world-title">{t("给尚未成形的想法，一点空间。", "Room for unfinished thoughts.")}</h1><p className="world-intro">{t("关于梦境、记忆、创造力与成长。把问题写下来，也允许答案慢一点到来。", "On dreams, memory, creativity and growing up. Writing down the questions, and allowing the answers to take their time.")}</p></header>
    {featured && <Link className="archive-thought-feature" href={`/blog/${featured.slug}`}><div><span className="world-eyebrow">FEATURED ESSAY / 2026.11.02</span><h2>{articleTranslations[featured.slug]?.title[locale] || featured.title}</h2><p>{articleTranslations[featured.slug]?.summary[locale] || featured.summary}</p><span className="archive-text-link">{t("继续阅读", "Read the essay")} ↗</span></div><div className="archive-thought-image"><Image src="/images/huolunbeier-memory.webp" alt={t("呼伦贝尔真实旅行摄影", "Original Hulunbuir travel photography")} fill sizes="(max-width: 700px) 85vw, 38vw" /></div></Link>}
    <section className="archive-section"><div className="archive-filter-row"><h2>{t("思想档案", "The writing archive")}</h2><div className="archive-filters" aria-label={t("文章筛选", "Filter writing")}>{[["all", "全部", "All"], ["ideas", "随想与成长", "Ideas & growth"], ["making", "项目与创造", "Making"]].map(([id, zh, en]) => <button key={id} type="button" onClick={() => setFilter(id)} aria-pressed={filter === id}>{t(zh, en)}</button>)}</div></div><div className="archive-reading-list" aria-live="polite">{filtered.map((post) => <ArticleRow key={post.slug} post={post} />)}{!filtered.length && <p>{t("这个专题暂时没有公开文章。", "There are no published entries in this collection yet.")}</p>}</div></section>
    <p className="archive-source-note">{locale === "zh" ? "收录已发表文章；草稿保持私密。随想中的未来设想，不代表已经实现的技术能力。" : "Published writing only; drafts stay private. Future possibilities discussed in personal essays are not claims of technology already achieved."}</p>
  </div>;
}

const experienceZh = [
  { title: "个人作品集网站", description: "使用 Next.js、React 和 Tailwind CSS 设计并构建紫色极简作品集，包含深色模式、打字动画与成长时间轴。", category: "making" },
  { title: "校园低碳回收全路径追踪系统", description: "构建基于 AI 视觉识别、批次管理和防作弊机制的校园回收追踪系统。", category: "making" },
  { title: "奖学金与荣誉", description: "获南京大学新生学院优秀学生、商学院恒阳物流奖学金。", category: "learning" },
  { title: "LLM 辅助形式化程序分析", description: "参与王轲老师指导的早期研究，关注程序切片与大语言模型驱动的代码修复流程。", category: "research" },
  { title: "南星梦想计划 · 温州队队长", description: "带领寒假社会实践团队前往温州中学开展高校招生宣讲，获优秀志愿者。", category: "service" },
  { title: "线上支教志愿服务", description: "参与山语未来、南悦学堂等乡村儿童教育项目，设计并讲授数学思维与编程启蒙课程。", category: "service" },
  { title: "竞赛与集体荣誉", description: "获军事训练先进个人，作为核心成员参与商学院第五届管理案例分析大赛十佳团队。", category: "learning" },
  { title: "学生职业发展协会", description: "加入行业研究部，参与行业研究报告与企业研究，获骨干之星。", category: "service" },
  { title: "进入南京大学", description: "开始软件工程与工商管理交叉方向的学习，加入商业创新班。", category: "learning" },
];
const awards = [
  { date: "2026.09", zh: "国家奖学金", en: "National Scholarship" },
  { date: "2026.06", zh: "恒阳物流奖学金", en: "Hengyang Logistics Scholarship" },
  { date: "2026.05", zh: "南京大学新生学院优秀学生", en: "Outstanding Student, NJU Freshman College" },
  { date: "2026.03", zh: "南星梦想计划优秀志愿者", en: "Excellent Volunteer — Nanxing Dream Plan" },
  { date: "2025.12", zh: "商业案例分析大赛十佳团队", en: "Top 10 Team — Business Case Analysis Competition" },
  { date: "2025.12", zh: "职业发展协会骨干之星", en: "Backbone Star — Career Development Association" },
  { date: "2025.11", zh: "军事训练先进个人", en: "Military Training Advanced Individual" },
  { date: "2025.10", zh: "商学院运动会推杆跑第一名", en: "First Place — Push-Putt Run, Business School Sports Day" },
];

export function AboutArchive() {
  const { t } = useWorldLocale();
  const [timelineFilter, setTimelineFilter] = useState("all");
  return <div className="world-page archive-page">
    <header className="archive-about-header"><div><p className="world-eyebrow">05 / THE PERSON BEHIND THE WORLD</p><h1 className="world-title">{t("你好，我是 Chenmu。", "Hello, I’m Chenmu.")}</h1><p className="archive-about-name">Siyuan Zheng / 郑思源</p><p className="world-intro">{t("南京大学软件工程与商业创新方向学生。在工程、科研、商业分析和数字创作之间，寻找愿意长期投入的问题。", "A Software Engineering and Business Innovation student at Nanjing University, exploring questions across engineering, research, business analysis and digital creation.")}</p></div><div className="archive-identity-mark" aria-hidden="true"><span>C</span><span>M</span><small>STILL LEARNING.<br />ALWAYS MAKING.</small></div></header>
    <section className="archive-education"><p className="world-eyebrow">2025 — {t("至今", "PRESENT")}</p><div><h2>{t("南京大学", "Nanjing University")}</h2><p>{t("软件工程 × 工商管理 · 商业创新班", "Software Engineering × Business Administration · Business Innovation Class")}</p></div></section>
    <section className="archive-section"><div className="archive-section-heading"><div><p className="world-eyebrow">A DATED SNAPSHOT</p><h2>{t("成长，不只是一组数字", "Growth is more than a set of numbers")}</h2></div></div><div className="archive-stats"><div><strong>4.62<span>/5.0</span></strong><p>{t("大一 GPA", "First-year GPA")}</p><small>{t("2025—2026 学年 · 历史自述", "2025–2026 academic year · historical self-report")}</small></div><div><strong>3<span>/41</span></strong><p>{t("大一专业排名", "First-year programme ranking")}</p><small>{t("2025—2026 学年 · 历史自述", "2025–2026 academic year · historical self-report")}</small></div><div><strong>126.7<span>h</span></strong><p>{t("志愿服务历史累计", "Recorded volunteer hours")}</p><small>{t("历史自述，统计日期待补充；非当前累计", "Historical self-report; cutoff date pending, not a current total")}</small></div></div></section>
    <section className="archive-section"><div className="archive-section-heading"><div><p className="world-eyebrow">TOOLS & INTERESTS</p><h2>{t("用不同的方法，理解同一个世界", "Different tools, the same curiosity")}</h2></div></div><div className="archive-skill-columns"><div><h3>{t("工程实践", "Engineering")}</h3><p>Java · C · Python · Full-stack · Git</p></div><div><h3>{t("研究探索", "Research")}</h3><p>Tree-sitter · Program slicing · LLM APIs</p></div><div><h3>{t("跨学科连接", "Across disciplines")}</h3><p>{t("商业分析 · 量化研究 · 产品管理", "Business analysis · Quantitative research · Product management")}</p></div><div><h3>{t("数字创作", "Digital creation")}</h3><p>Blender · Three.js · {t("视觉叙事", "Visual storytelling")}</p></div></div></section>
    <section className="archive-section"><div className="archive-filter-row"><div><p className="world-eyebrow">THE GROWING ARCHIVE</p><h2>{t("把每一步连起来", "Connecting the steps")}</h2></div><div className="archive-filters" aria-label={t("经历筛选", "Filter experiences")}>{[["all", "全部", "All"], ["research", "科研", "Research"], ["making", "项目", "Projects"], ["service", "实践", "Service"]].map(([id, zh, en]) => <button key={id} type="button" onClick={() => setTimelineFilter(id)} aria-pressed={timelineFilter === id}>{t(zh, en)}</button>)}</div></div><ol className="archive-timeline" aria-live="polite">{experiences.map((experience, i) => ({ experience, translated: experienceZh[i] })).filter(({ translated }) => timelineFilter === "all" || translated?.category === timelineFilter).map(({ experience, translated }) => <li key={`${experience.date}-${experience.title}`}><time>{experience.date}</time><div><h3>{t(translated?.title || experience.title, experience.title)}</h3><p>{t(translated?.description || experience.description, experience.description)}</p>{experience.link && <a href={experience.link} target="_blank" rel="noreferrer">{t("相关项目", "Related project")} ↗</a>}</div></li>)}</ol></section>
    <section className="archive-section"><div className="archive-section-heading"><div><p className="world-eyebrow">HONOURS & RECOGNITION</p><h2>{t("沿途的鼓励", "Encouragement along the way")}</h2></div><span className="archive-source-note">{t("保留已有档案记录", "From the existing personal archive")}</span></div><ol className="archive-awards">{awards.map((award) => <li key={`${award.date}-${award.en}`}><time>{award.date}</time><span>{t(award.zh, award.en)}</span></li>)}</ol></section>
    <footer className="archive-about-footer"><p>{t("如果你也对这些问题感到好奇，欢迎交流。", "If these questions make you curious too, let’s talk.")}</p><Link className="world-button" href="/contact">{t("联系我", "Get in touch")} ↗</Link></footer>
  </div>;
}
