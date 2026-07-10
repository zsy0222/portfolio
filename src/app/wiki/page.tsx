"use client";

import { useState } from "react";
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
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === WIKI_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem("wiki-auth", "true");
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!authed) {
    return (
      <>
        <section className="px-15 pt-25 pb-20 min-h-[60vh] flex flex-col justify-center">
          <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
            Private
          </div>
          <h1 className="text-[56px] font-light text-ink leading-[1.2] mb-5" style={{ textWrap: "balance" }}>
            <span className="text-accent font-semibold">Wiki</span> access.
          </h1>
          <p className="text-[20px] font-medium text-lead mb-9">
            This area is private. Enter password to continue.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-[400px]">
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Password"
              autoFocus
              autoComplete="off"
              className="bg-card border border-line rounded-lg px-4 py-3 text-[20px] text-ink focus:outline-none focus:border-accent transition-colors"
            />
            {error && (
              <p className="text-[18px] text-accent">Incorrect password.</p>
            )}
            <button
              type="submit"
              className="self-start text-[20px] font-medium text-ink border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors"
            >
              Enter →
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
          Wiki
        </div>
        <h1 className="text-[56px] font-light text-ink leading-[1.2] mb-5" style={{ textWrap: "balance" }}>
          Knowledge <span className="text-accent font-semibold">base</span>.
        </h1>
        <p className="text-[24px] font-medium text-lead leading-[1.6] max-w-[520px]">
          Personal notes, snippets, references, and decisions.
        </p>
      </section>

      <section className="px-15 py-14 border-t border-line">
        <div className="flex flex-col gap-12">
          {wikiSections.map((section) => (
            <div key={section.path}>
              <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
                {section.name}
              </div>
              <div className="flex flex-col">
                {section.items.map((item, idx) => (
                  <div
                    key={item}
                    className={`py-6 ${idx < section.items.length - 1 ? "border-b border-line" : ""}`}
                  >
                    <span className="text-[22px] font-medium text-lead hover:text-accent transition-colors cursor-default">
                      {item}.md
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
