"use client";

import { useState } from "react";
import Link from "next/link";
import { search, type SearchResult } from "@/lib/search";
import Footer from "@/components/Footer";

export default function WikiAskPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(false);
    setModelLoading(true);

    try {
      const res = await search(query.trim(), 5);
      setResults(res);
      setSearched(true);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
      setModelLoading(false);
    }
  };

  return (
    <>
      <section className="px-15 pt-25 pb-16">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          Wiki / Ask
        </div>
        <h1 className="text-[44px] font-light text-ink leading-[1.25] mb-5" style={{ textWrap: "balance" }}>
          Ask the <span className="text-accent font-semibold">knowledge base</span>.
        </h1>
        <p className="text-[20px] font-medium text-lead leading-[1.6] max-w-[520px]">
          Semantic search across blog posts and wiki notes. Powered by
          all-MiniLM-L6-v2, runs locally in your browser.
        </p>
      </section>

      <section className="px-15 pb-10">
        <form onSubmit={handleSearch} className="flex items-center gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 max-w-[600px] bg-card border border-line rounded-lg px-4 py-2.5 text-[18px] text-ink focus:outline-none focus:border-accent transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="text-[18px] font-medium text-ink border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Search &rarr;
          </button>
        </form>
        {modelLoading && (
          <p className="text-[16px] text-muted mt-4">
            Loading model (first time ~30s)...
          </p>
        )}
      </section>

      {searched && !loading && (
        <section className="px-15 py-14 border-t border-line">
          <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-8">
            {results.length} Result{results.length !== 1 ? "s" : ""}
          </div>
          {results.length === 0 ? (
            <p className="text-[20px] text-muted">No matches found.</p>
          ) : (
            <div className="flex flex-col">
              {results.map((r, idx) => (
                <div
                  key={r.id}
                  className={`py-6 ${idx < results.length - 1 ? "border-b border-line" : ""}`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    {r.id.startsWith("blog/") ? (
                      <Link
                        href={`/blog/${r.id.split("/").slice(2).join("/")}`}
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
                  <div className="text-[16px] text-muted mt-1">{r.id}</div>
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
