"use client";

import { useState } from "react";
import Link from "next/link";
import { search, type SearchResult, type SearchFilter } from "@/lib/search";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import { useWorldLocale } from "@/components/world/WorldProvider";
import FormField from "@/components/FormField";


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

export default function WikiAskPage() {
  const { t } = useWorldLocale();
  const [authed, setAuthed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("wiki-auth") === "true";
  });
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [filter, setFilter] = useState<SearchFilter>("all");
  const [searchError, setSearchError] = useState(false);

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearchError(false);
    setSearched(false);
    setModelLoading(true);

    try {
      const res = await search(query.trim(), 10, filter);
      setResults(res);
      setSearched(true);
    } catch (err) {
      console.error("Search error:", err);
      setSearchError(true);
    } finally {
      setLoading(false);
      setModelLoading(false);
    }
  };

  const handleFilterChange = async (newFilter: SearchFilter) => {
    setFilter(newFilter);
    if (searched && query.trim()) {
      setLoading(true);
      setSearchError(false);
      try {
        const res = await search(query.trim(), 10, newFilter);
        setResults(res);
      } catch (err) {
        console.error("Search error:", err);
        setSearchError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!authed) {
    return (
      <>
        <section className="px-15 pt-25 pb-16">
          <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
            {t("知识库 / 搜索", "Wiki / Ask")}
          </div>
          <h1 className="text-[44px] font-light text-ink leading-[1.25] mb-5" style={{ textWrap: "balance" }}>
            {t("搜索", "Ask the ")}<span className="text-accent font-semibold">{t("知识库", "knowledge base")}</span>{t("", ".")}
          </h1>
          <p className="text-[18px] text-muted mt-4">
            {t("需要密码才能解锁内容。", "Password required to unlock content.")}
          </p>
        </section>

        <section className="px-15 pb-6">
          <form onSubmit={handleUnlock} className="ui-unlock-form">
            <FormField id="unlock-password" label={t("访问密码", "Password")} error={error ? t("密码不正确，请重试。", "Wrong password, try again.") : undefined}>
              <input id="unlock-password" name="password" type="password" value={input}
                onChange={(event) => { setInput(event.target.value); setError(false); }}
                placeholder={t("输入密码以解锁", "Password to unlock")} autoComplete="off"
                aria-invalid={error} aria-describedby={error ? "unlock-password-error" : undefined} />
            </FormField>
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
      <section className="px-15 pt-25 pb-16">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          {t("知识库 / 搜索", "Wiki / Ask")}
        </div>
        <h1 className="text-[44px] font-light text-ink leading-[1.25] mb-5" style={{ textWrap: "balance" }}>
          {t("搜索", "Ask the ")}<span className="text-accent font-semibold">{t("知识库", "knowledge base")}</span>{t("", ".")}
        </h1>
        <p className="text-[20px] font-medium text-lead leading-[1.6] max-w-[520px]">
          {t("在博客和知识笔记之间进行语义检索。all-MiniLM-L6-v2 模型在浏览器本地运行。", "Semantic search across blog posts and wiki notes. Powered by all-MiniLM-L6-v2, running locally in your browser.")}
        </p>
        <p className="text-[16px] text-muted mt-4">
          {t("搜索结果与笔记资料保留作者的原始语言。", "Search results and source notes remain in the author’s original language.")}
        </p>
      </section>

      <section className="px-15 pb-10">
        <form onSubmit={handleSearch} className="flex flex-wrap items-start gap-4">
          <div className="min-w-0 flex-1 max-w-[600px]">
          <FormField id="wiki-query" label={t("搜索知识库", "Search the knowledge base")} error={searchError ? t("搜索暂时不可用，请重试。", "Search unavailable. Please try again.") : undefined}>
          <input
            id="wiki-query"
            name="query"
            aria-invalid={Boolean(searchError)}
            aria-describedby={searchError ? "wiki-query-error" : undefined}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSearchError(false); }}
            placeholder={t("输入想探索的问题…", "Ask anything…")}
            className="flex-1 max-w-[600px] bg-card border border-line rounded-lg px-4 py-2.5 text-[18px] text-ink focus:outline-none focus:border-accent transition-colors"
            disabled={loading}
          />
          </FormField>
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="mt-7 min-h-11 text-[18px] font-medium text-ink border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t("搜索", "Search")} <Icon name="arrow-right" />
          </button>
        </form>
        {modelLoading && (
          <p className="text-[16px] text-muted mt-4">
            {t("正在准备搜索（首次使用需要下载模型）…", "Preparing search (the model downloads on first use)…")}
          </p>
        )}
      </section>

      {searched && !loading && (
        <section className="px-15 py-14 border-t border-line">
          <div className="flex items-center justify-between mb-8">
            <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted">
              {t(`${results.length} 条结果`, `${results.length} result${results.length !== 1 ? "s" : ""}`)}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {(["all", "blog", "wiki"] as SearchFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => handleFilterChange(f)}
                    className={`text-[16px] pb-0.5 border-b-2 transition-colors capitalize ${
                      filter === f
                        ? "font-semibold text-ink border-accent"
                        : "font-normal text-body border-transparent hover:text-accent"
                    }`}
                  >
                    {f === "all" ? t("全部", "All") : f === "blog" ? t("博客", "Blog") : t("知识笔记", "Wiki")}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {results.length === 0 ? (
            <p className="text-[20px] text-muted">{t("没有找到匹配内容。", "No matches found.")}</p>
          ) : (
            <div className="flex flex-col">
              {results.map((r, idx) => (
                <div
                  key={r.id}
                  className={`py-6 ${idx < results.length - 1 ? "border-b border-line" : ""}`}
                >
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    {r.id.startsWith("blog/") ? (
                      <Link
                        href={`/blog/${r.id.split("/").at(-1)}`}
                        className="text-[22px] font-medium text-lead hover:text-accent transition-colors"
                      >
                        {r.title}
                      </Link>
                    ) : (
                      <span className="text-[22px] font-medium text-lead">
                        {r.title}
                      </span>
                    )}
                    <span className="text-[16px] text-muted shrink-0">
                      {(r.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-[16px] text-body leading-[1.5] mb-1 max-w-[700px]">
                    {r.snippet}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] text-muted uppercase tracking-[0.1em]">
                      {r.type === "blog" ? t("博客", "Blog") : t("知识笔记", "Wiki")}
                    </span>
                    <span className="text-[14px] text-muted/60">{r.id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <Footer />
    </>
  );
}
