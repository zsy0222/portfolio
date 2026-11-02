"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useWorldLocale } from "./WorldProvider";
import type { WorldSearchResponse, WorldSearchType } from "@/lib/world-search";
import "./search.css";

const filters: { id: WorldSearchType; zh: string; en: string }[] = [
  { id: "all", zh: "全部", en: "Everything" },
  { id: "project", zh: "作品与项目", en: "Works & projects" },
  { id: "article", zh: "文章", en: "Writing" },
  { id: "memory", zh: "旅行记忆", en: "Memories" },
];

function validType(value: string | null): WorldSearchType {
  return value === "project" || value === "article" || value === "memory" ? value : "all";
}

interface Props {
  initialQuery?: string;
  initialType?: WorldSearchType;
  initialResponse?: WorldSearchResponse;
}

export default function GlobalSearch({ initialQuery = "", initialType = "all", initialResponse }: Props) {
  const { locale, t } = useWorldLocale();
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<WorldSearchType>(initialType);
  const [response, setResponse] = useState<WorldSearchResponse | undefined>(initialResponse);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(initialResponse ? "success" : "idle");
  const [retry, setRetry] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const cleanedQuery = query.trim();

  useEffect(() => {
    const restoreFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setQuery((params.get("q") ?? "").slice(0, 160));
      setFilter(validType(params.get("type")));
    };
    window.addEventListener("popstate", restoreFromUrl);
    return () => window.removeEventListener("popstate", restoreFromUrl);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      const pageParams = new URLSearchParams();
      if (cleanedQuery) pageParams.set("q", cleanedQuery);
      if (filter !== "all") pageParams.set("type", filter);
      const suffix = pageParams.toString();
      const nextUrl = `/search${suffix ? `?${suffix}` : ""}`;
      if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
        window.history.replaceState(window.history.state, "", nextUrl);
      }
      if (!cleanedQuery) {
        setResponse(undefined);
        setStatus("idle");
        return;
      }
      setStatus("loading");
      try {
        const params = new URLSearchParams({ q: cleanedQuery, type: filter, lang: locale });
        const result = await fetch(`/api/search?${params}`, { signal: controller.signal });
        if (!result.ok) throw new Error("Search unavailable");
        const data: WorldSearchResponse = await result.json();
        if (!controller.signal.aborted) {
          setResponse(data);
          setStatus("success");
        }
      } catch {
        if (!controller.signal.aborted) setStatus("error");
      }
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [cleanedQuery, filter, locale, retry]);

  const visibleResults = response?.query === cleanedQuery && response.type === filter ? response.results : [];
  const isPending = !!cleanedQuery && (status === "loading" || (status !== "error" && (response?.query !== cleanedQuery || response?.type !== filter)));
  const typeLabel = (type: string) => {
    const item = filters.find((candidate) => candidate.id === type);
    return item ? t(item.zh, item.en) : type;
  };

  return (
    <div className="world-page world-search">
      <header className="search-heading">
        <p className="world-eyebrow">THE INDEX · {t("世界索引", "A connected archive")}</p>
        <h1 className="world-title">{t("寻找一个想法。", "Find a thread.")}</h1>
        <p className="world-intro">{t("在作品、文字与旅行记忆之间，找到你想探索的线索。", "Follow an idea through projects, writing, and places remembered.")}</p>
      </header>

      <form className="search-form" action="/search" method="get" role="search" onSubmit={(event) => {
        event.preventDefault();
        setRetry((value) => value + 1);
      }}>
        <label htmlFor="world-search-input" className="search-input-label">{t("搜索这个数字世界", "Search this digital world")}</label>
        <div className="search-input-row">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 4.5 4.5" /></svg>
          <input ref={inputRef} id="world-search-input" type="search" name="q" value={query} maxLength={160} autoComplete="off" placeholder={t("试试「脑机接口」或「草原」", "Try “memory” or “program analysis”")} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              const firstResult = listRef.current?.querySelector<HTMLAnchorElement>("a");
              if (firstResult) { event.preventDefault(); firstResult.focus(); }
            }
            if (event.key === "Escape") setQuery("");
          }} aria-describedby="search-hint" />
          <button className="search-submit" type="submit">{t("搜索", "Search")} <span aria-hidden="true">↗</span></button>
        </div>
        <p id="search-hint" className="search-hint">{t("支持中英文和多个关键词。按 ↓ 进入结果，Esc 清空。", "Search in Chinese or English. Use ↓ for results, Esc to clear.")}</p>
        <fieldset className="search-filters">
          <legend>{t("搜索范围", "Search within")}</legend>
          {filters.map((item) => (
            <label key={item.id} className={`search-filter ${filter === item.id ? "is-active" : ""}`}>
              <input type="radio" name="type" value={item.id} checked={filter === item.id} onChange={() => setFilter(item.id)} />
              <span>{t(item.zh, item.en)}</span>
            </label>
          ))}
        </fieldset>
      </form>

      {!cleanedQuery ? (
        <section className="search-discover" aria-label={t("探索主题", "Explore a subject")}>
          <p>{t("从一个词开始", "Start somewhere")}</p>
          <div>{[
            { zh: "脑机接口", en: "Brain computer" },
            { zh: "呼伦贝尔", en: "Hulunbuir" },
            { zh: "程序切片", en: "Program slicing" },
            { zh: "梦境", en: "Dream" },
          ].map((item, index) => <button key={item.en} type="button" onClick={() => { setQuery(t(item.zh, item.en)); inputRef.current?.focus(); }}><small>0{index + 1}</small><span>{t(item.zh, item.en)}</span><span aria-hidden="true">↗</span></button>)}</div>
        </section>
      ) : (
        <section className="search-results" aria-label={t("搜索结果", "Search results")} aria-busy={isPending}>
          <div className="search-status" role="status" aria-live="polite">
            {isPending ? t("正在寻找…", "Looking through the archive…") : status === "error" ? t("暂时无法搜索。", "Search is temporarily unavailable.") : t(`找到 ${response?.total ?? 0} 条结果`, `${response?.total ?? 0} results found`)}
          </div>
          {status === "error" ? <div className="search-empty"><p>{t("请稍后重试，也可以从导航直接浏览各个展区。", "Try again, or browse the collections through the navigation.")}</p><button type="button" onClick={() => setRetry((value) => value + 1)}>{t("重新搜索", "Try again")}</button></div> : isPending ? <div className="search-loading" aria-hidden="true"><span /><span /><span /></div> : visibleResults.length === 0 ? <div className="search-empty"><h2>{t("这条线索还没有记录。", "No matching thread yet.")}</h2><p>{t("试试更短的词，或切换为「全部」。", "Try a shorter phrase or choose “Everything”.")}</p>{filter !== "all" && <button type="button" onClick={() => setFilter("all")}>{t("搜索全部内容", "Search everything")}</button>}</div> : <ul ref={listRef} className="search-result-list" onKeyDown={(event) => {
            if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
            const links = Array.from(listRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
            const index = links.indexOf(document.activeElement as HTMLAnchorElement);
            if (index < 0) return;
            event.preventDefault();
            const next = index + (event.key === "ArrowDown" ? 1 : -1);
            if (next < 0) inputRef.current?.focus();
            else links[Math.min(next, links.length - 1)]?.focus();
          }}>
            {visibleResults.map((result, index) => <li key={result.id}><Link href={result.href}><div className="search-result-meta"><span>{String(index + 1).padStart(2, "0")}</span><span>{typeLabel(result.type)}</span></div><div className="search-result-body"><h2>{result.title}</h2><p>{result.snippet}</p></div><span className="search-result-arrow" aria-hidden="true">↗</span></Link></li>)}
          </ul>}
        </section>
      )}
    </div>
  );
}
