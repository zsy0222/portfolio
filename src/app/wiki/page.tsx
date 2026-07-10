"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

const WIKI_PASSWORD = "nju2026";

const wikiSections = [
  {
    name: "Frontend",
    path: "frontend",
    items: ["next-notes", "vercel-deploy", "css-template"],
  },
  {
    name: "AI Agent",
    path: "ai-agent",
    items: ["agents-md-spec", "rag-practice", "multi-agent-design"],
  },
  {
    name: "Paper",
    path: "paper",
    items: ["ai-product-papers", "quantitative-analysis-notes"],
  },
  {
    name: "Project Record",
    path: "project-record",
    items: ["portfolio-build-log", "git-operation-standard"],
  },
  {
    name: "Career",
    path: "career",
    items: ["resume-template", "job-match-logic"],
  },
  {
    name: "Misc",
    path: "misc",
    items: ["npm-npx-diff", "cloudbase-free-rule"],
  },
];

export default function WikiPage() {
  const [authed, setAuthed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("wiki-auth") === "true";
  });
  const [input, setInput] = useState("");

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === WIKI_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem("wiki-auth", "true");
      setInput("");
    }
  };

  return (
    <>
      <section className="px-15 pt-25 pb-16">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          Wiki
        </div>
        <h1 className="text-[56px] font-light text-ink leading-[1.2] mb-5" style={{ textWrap: "balance" }}>
          Knowledge <span className="text-accent font-semibold">base</span>.
        </h1>
        <p className="text-[24px] font-medium text-lead leading-[1.6] max-w-[520px]">
          Personal notes, snippets, references, and decisions.{" "}
          <Link href="/wiki/ask" className="text-accent hover:underline">
            Ask the knowledge base &rarr;
          </Link>
        </p>
        {!authed && (
          <p className="text-[18px] text-muted mt-4">
            Password required to unlock content.
          </p>
        )}
      </section>

      {!authed && (
        <section className="px-15 pb-6">
          <form onSubmit={handleUnlock} className="inline-flex items-center gap-3">
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Password to unlock"
              autoComplete="off"
              className="bg-card border border-line rounded-lg px-3 py-1.5 text-[16px] text-ink focus:outline-none focus:border-accent transition-colors w-[200px]"
            />
            <button
              type="submit"
              className="text-[16px] font-medium text-muted hover:text-accent transition-colors"
            >
              Unlock →
            </button>
          </form>
        </section>
      )}

      <section className="px-15 py-14 border-t border-line">
        <div className="flex flex-col gap-12">
          {wikiSections.map((section) => (
            <div key={section.path}>
              <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6 flex items-center gap-3">
                {section.name}
                <span className="text-[16px] text-muted/60">{section.items.length}</span>
              </div>
              <div className="flex flex-col">
                {section.items.map((item, idx) => (
                  <div
                    key={item}
                    className={`py-6 ${idx < section.items.length - 1 ? "border-b border-line" : ""}`}
                  >
                    <span
                      className={`text-[22px] font-medium transition-colors ${
                        authed
                          ? "text-lead hover:text-accent cursor-pointer"
                          : "text-muted cursor-default"
                      }`}
                    >
                      {authed ? `${item}.md` : `${item}.md`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
