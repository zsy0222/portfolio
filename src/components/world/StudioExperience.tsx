"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useWorldLocale } from "@/components/world/WorldProvider";
import type { StudioView } from "./StudioCanvas";
import "./studio.css";

const StudioCanvas = dynamic(() => import("./StudioCanvas"), { ssr: false });
const entrances = [
  { name: "computer", href: "/lab?category=software", zh: "电脑 · 项目", en: "Computer · Projects", number: "01" },
  { name: "bookshelf", href: "/learning", zh: "书架 · 学习", en: "Bookshelf · Learning", number: "02" },
  { name: "photos", href: "/memories", zh: "照片墙 · 记忆", en: "Photos · Memories", number: "03" },
  { name: "notebook", href: "/thoughts", zh: "笔记本 · 思考", en: "Notebook · Thoughts", number: "04" },
];

export default function StudioExperience({ compact = false }: { compact?: boolean }) {
  const { t } = useWorldLocale();
  const router = useRouter();
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [compatibility, setCompatibility] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [view, setView] = useState<StudioView>("room");
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    if (!host.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { setActive(true); observer.disconnect(); }
    }, { rootMargin: "180px" });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);

  const retry = () => { setFailed(false); setReady(false); setCompatibility(false); setAttempt(n => n + 1); setActive(true); };
  const hoveredEntrance = entrances.find(item => item.name === hover);

  return (
    <div ref={host} className={`studio-experience${compact ? " studio-compact" : ""}`}>
      <div className="studio-stage">
        <div className="studio-stage-heading"><span className="studio-live-dot" /><span>{t("创作室 / 可交互场景", "THE STUDIO / INTERACTIVE SCENE")}</span><span className="studio-edition">01—04</span></div>
        {active && !failed && <StudioCanvas key={attempt} view={view} onReady={() => setReady(true)} onError={() => { setFailed(true); setReady(false); }} onCompatibility={() => setCompatibility(true)} onNavigate={href => router.push(href)} onHover={setHover} label={t("紫色与暖木色创作室，酒红卫衣人物坐在双屏电脑前。可通过下方入口或直接点击物件探索。", "A purple and warm-wood studio with a burgundy-hoodie character and dual monitors. Explore by clicking objects or using the links below.")} />}
        {!ready && !failed && <div className="studio-loading" role="status"><span className="studio-loading-mark">C<span>m</span></span><span>{t("正在打开创作室…", "Opening the studio…")}</span><small>{t("内容入口始终可以直接访问", "All content is also available through the links below")}</small></div>}
        {failed && <div className="studio-loading studio-fallback" role="status"><span className="studio-loading-mark">C<span>m</span></span><strong>{t("先从文字世界开始", "Start with the stories")}</strong><p>{t("当前设备暂时无法显示 3D，所有内容仍可从下方入口访问。", "3D is unavailable on this device. Every story is still accessible below.")}</p><button type="button" onClick={retry}>{t("重新加载 3D", "Retry 3D")} ↗</button></div>}
        <div className="studio-stage-bottom">
          <span className="studio-interaction-hint" aria-live="polite">{hoveredEntrance ? t(hoveredEntrance.zh, hoveredEntrance.en) + " ↗" : t("拖动环视 · 点击物件探索", "Drag to look around · Click an object")}</span>
          <div className="studio-view-controls" role="group" aria-label={t("创作室视角", "Studio camera view")}>
            {([{ id: "room", zh: "全景", en: "Room" }, { id: "desk", zh: "书桌", en: "Desk" }, { id: "memories", zh: "照片", en: "Photos" }] as const).map(item => <button key={item.id} type="button" aria-pressed={view === item.id} onClick={() => { setView(item.id); if (!active) setActive(true); }}>{t(item.zh, item.en)}</button>)}
          </div>
        </div>
      </div>
      <nav className="studio-entrances" aria-label={t("创作室内容入口", "Studio content entrances")}>
        {entrances.map(item => <Link key={item.name} href={item.href} className={hover === item.name ? "studio-entrance is-hovered" : "studio-entrance"}><small>{item.number}</small><span>{t(item.zh, item.en)}</span><span aria-hidden="true">↗</span></Link>)}
      </nav>
      <p className="studio-concept-note">{compatibility && <span className="studio-compatibility-note">{t("兼容视图 · 简化材质", "Compatibility view · Simplified materials")} · </span>}{t("空间概念演绎 · 可交互 3D 场景；不是现实房间的实拍。", "An interactive 3D interpretation of the studio, not a photograph of a real room.")}</p>
    </div>
  );
}
