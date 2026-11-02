"use client";
import Image from "next/image";
import Link from "next/link";
import { useWorldLocale } from "./WorldProvider";
import StudioExperience from "./StudioExperience";

export default function WorldHome() {
  const { t } = useWorldLocale();
  return <div className="world-home">
    <section className="world-hero">
      <div className="world-hero-top"><span className="world-eyebrow"><i className="world-status-dot" />{t("个人数字世界 · 持续生长中", "A personal digital world · In progress")}</span><span className="world-edition">VOL. 01 / 2026</span></div>
      <div className="world-hero-grid">
        <div className="world-hero-copy"><p className="world-overline">HELLO, I’M</p><h1>CHENMU<span className="world-name-dot">.</span></h1><p className="world-hero-field">Software Engineering<br/><span>× Business Innovation</span></p><p className="world-hero-statement">I build things,<br/>explore worlds,<br/><em>and collect ideas.</em></p><p className="world-hero-zh">{t("在代码里构建，在世界里探索。", "A mind that builds, a world that remembers.")}</p><div className="world-hero-actions"><Link className="world-button world-button-solid" href="/lab">{t("探索我的作品", "Explore My Work")}<span>↗</span></Link><Link className="world-text-link" href="/world">{t("走进我的世界", "Enter My World")} <span>↗</span></Link></div></div>
        <div className="world-hero-scene"><div className="world-scene-caption"><span>THE CREATOR’S ROOM</span><span>{t("点击物件，开始探索", "Objects hold stories")}</span></div><StudioExperience compact/><div className="world-scene-bottom"><span>01 — {t("创作室的一角", "A place for making")}</span><Link href="/world">{t("完整视角", "Explore the room")} ↗</Link></div></div>
      </div>
      <div className="world-hero-foot"><span>{t("南京大学 · 软件工程 × 商业创新", "Nanjing University · Engineering × Business")}</span><span>{t("向下探索这个世界", "Scroll to explore")} ↓</span></div>
    </section>

    <section className="world-manifesto"><span className="world-section-number">01 / {t("关于这个世界", "THE IDEA")}</span><h2>A mind that builds,<br/><em>a world that remembers.</em></h2><div><p>{t("这里收藏的不只有作品，还有问题、尝试，以及不想忘记的时刻。", "A collection of things I make, questions I follow, and moments I don’t want to forget.")}</p><p>{t("一边学习如何构建系统，一边学习如何感受世界。", "Learning to build systems. Learning to notice the world.")}</p><Link className="world-text-link" href="/about">{t("认识我", "A little about me")} ↗</Link></div></section>

    <section className="world-selected"><div className="world-section-heading"><div><span className="world-section-number">02 / CREATIVE LAB</span><h2>{t("从一个想法开始", "Ideas, made tangible.")}</h2></div><Link className="world-text-link" href="/lab">{t("所有作品", "All explorations")} ↗</Link></div>
      <div className="world-work-grid"><Link className="world-work-feature" href="/lab/campus-recycling-tracker"><div className="world-system-art" aria-hidden="true"><div className="world-system-word">RE:<br/>CYCLE</div><div className="world-system-orbit"><span>01</span><span>02</span><span>03</span><span>04</span></div><p>SUBMIT → COLLECT → REUSE → TRACE</p><span className="world-art-label">SYSTEM STUDY / 2026</span></div><div className="world-work-meta"><span>01 / SOFTWARE ENGINEERING</span><span>↗</span></div><h3>{t("校园低碳回收全路径追踪", "Campus Recycling Tracker")}</h3><p>{t("让每一次回收，都能找到它的下一站。", "Following the journey from a recycled object to its next use.")}</p></Link>
      <Link className="world-work-feature" href="/lab?category=worlds"><div className="world-spatial-art" aria-hidden="true"><div className="world-spatial-grid"/><span className="world-spatial-label">WORLD<br/><em>building.</em></span><span className="world-art-label">BLENDER / DIGITAL SPACE</span></div><div className="world-work-meta"><span>02 / 3D WORLDS & DIGITAL ART</span><span>↗</span></div><h3>{t("让想象拥有一个空间", "Giving imagination a place")}</h3><p>{t("木屋、生态城市与体素世界，一次次空间实验。", "Cottages, ecological cities and miniature worlds in progress.")}</p></Link></div>
      <Link href="/lab/assertion-guided-cascaded-hybrid-slicing" className="world-research-strip"><span className="world-section-number">03 / AI & RESEARCH</span><h3>LLM-assisted<br/><em>Formal Program Analysis</em></h3><p>{t("让 AI 学会理解、验证和改进软件。", "Exploring how AI can understand, verify and improve software.")}</p><span className="world-circle-arrow">↗</span></Link>
    </section>

    <section className="world-memory-feature"><div className="world-memory-photo"><Image src="/images/huolunbeier-memory.webp" alt={t("2025年夏天呼伦贝尔旅行的真实照片拼图", "Original photo collage from the summer 2025 Hulunbuir trip")} width={1254} height={1254} sizes="(max-width: 760px) 100vw, 48vw"/><span>{t("真实旅行影像 · 2025 夏", "ORIGINAL PHOTOGRAPHS · SUMMER 2025")}</span></div><div className="world-memory-copy"><span className="world-section-number">03 / TRAVEL MEMORIES</span><h2>{t("有些夏天，", "Some summers") }<br/><em>{t("一直在心里。", "stay with you.")}</em></h2><p>{t("呼伦贝尔，和高中同学的毕业旅行。广阔的草坡、山头的落日，还有终于慢下来的时间。", "Hulunbuir, after the exams, with friends from high school. Open grasslands, a sunset on the hill, and time that finally slowed down.")}</p><Link className="world-button" href="/memories">{t("打开旅行记忆", "Discover My Memories")}<span>↗</span></Link><div className="world-memory-footnote">HULUNBUIR, INNER MONGOLIA<br/>SUMMER ’25 — A MEMORY, NOT A DESTINATION.</div></div></section>

    <section className="world-notes"><div className="world-section-heading"><div><span className="world-section-number">04 / THOUGHTS & DREAMS</span><h2>{t("还没有答案的问题", "Questions worth keeping.")}</h2></div><Link className="world-text-link" href="/thoughts">{t("打开思想档案", "Open the journal")} ↗</Link></div><div className="world-notes-list">
      <Link href="/blog/experience-recording-and-replay"><span>01</span><div><small>FUTURE / MEMORY</small><h3>{t("如果记忆可以被重新感受", "What if memories could be felt again?")}</h3><p>{t("从一次旅行的怀念，想到脑机接口的未来。", "A thought about brain–computer interfaces, sparked by a journey.")}</p></div><span>↗</span></Link>
      <Link href="/blog/dream-time-and-inspiration"><span>02</span><div><small>DREAMS / EXPERIENCE</small><h3>{t("梦境：另一种时间与灵感的入口", "Dreams: another entrance to time and inspiration")}</h3><p>{t("梦里经历的时间，能否成为创造的素材？", "Could time experienced in dreams become material for creativity?")}</p></div><span>↗</span></Link>
      <Link href="/blog/sophomore-confusion-and-reflection"><span>03</span><div><small>LEARNING / GROWTH</small><h3>{t("大二初的迷茫与反思", "Finding direction at the start of sophomore year")}</h3><p>{t("从分数转向问题，从完成任务转向主动探索。", "From grades to questions; from finishing tasks to exploring ideas.")}</p></div><span>↗</span></Link>
    </div></section>
    <div className="world-closing"><span>STILL LEARNING.</span><span>ALWAYS <em>MAKING.</em></span><Link href="/learning">{t("看看我正在学习什么", "See what I’m learning")} ↗</Link></div>
  </div>;
}
