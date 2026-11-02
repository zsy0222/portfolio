"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Icon from "./Icon";

interface Heading { id: string; title: string; level: number }

export default function ArticleReader({ children, className = "" }: { children: ReactNode; className?: string }) {
  const content = useRef<HTMLDivElement>(null);
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const root = content.current;
    if (!root) return;
    const elements = Array.from(root.querySelectorAll<HTMLElement>("h2, h3, h4"));
    const ids = new Set(Array.from(document.querySelectorAll("[id]")).map((element) => element.id));
    const entries = elements.map((element) => {
      const title = element.textContent?.trim() || "Section";
      if (!element.id) {
        const base = "section-" + (title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "heading");
        let id = base;
        let suffix = 2;
        while (ids.has(id)) id = `${base}-${suffix++}`;
        element.id = id;
        ids.add(id);
      }
      element.tabIndex = -1;
      element.classList.add("article-heading");
      return { id: element.id, title, level: Number(element.tagName.slice(1)) };
    });
    const frame = requestAnimationFrame(() => setHeadings(entries));
    let timeout = 0;
    let pulseFrame = 0;
    let active: HTMLElement | null = null;
    const highlight = (hash: string, initial = false) => {
      let id: string;
      try { id = decodeURIComponent(hash.replace(/^#/, "")); } catch { return; }
      const target = elements.find((element) => element.id === id);
      if (!target) return;
      active?.classList.remove("heading-highlight");
      clearTimeout(timeout);
      cancelAnimationFrame(pulseFrame);
      active = target;
      if (initial) target.scrollIntoView({ block: "start", behavior: "instant" });
      target.focus({ preventScroll: true });
      pulseFrame = requestAnimationFrame(() => {
        target.classList.add("heading-highlight");
        timeout = window.setTimeout(() => target.classList.remove("heading-highlight"), 1900);
      });
    };
    const hashChanged = () => highlight(window.location.hash);
    const clicked = (event: MouseEvent) => {
      if (event.button || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") return;
      const url = new URL(link.href);
      // A new hash is handled by hashchange; repeated clicks still replay the cue.
      if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search && url.hash === location.hash) highlight(url.hash);
    };
    root.parentElement?.addEventListener("click", clicked);
    window.addEventListener("hashchange", hashChanged);
    const initialFrame = requestAnimationFrame(() => highlight(window.location.hash, true));
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(initialFrame);
      cancelAnimationFrame(pulseFrame);
      clearTimeout(timeout);
      active?.classList.remove("heading-highlight");
      root.parentElement?.removeEventListener("click", clicked);
      window.removeEventListener("hashchange", hashChanged);
    };
  }, [children]);

  return (
    <div className="article-reader">
      {headings.length > 1 && (
        <details className="article-toc ui-surface">
          <summary><span>On this page</span><Icon name="chevron-down" /></summary>
          <nav aria-label="Article table of contents">
            <ol>{headings.map((heading) => <li key={heading.id} data-level={heading.level}>
              <a href={`#${encodeURIComponent(heading.id)}`}>{heading.title}</a>
            </li>)}</ol>
          </nav>
        </details>
      )}
      <div ref={content} className={className} data-article-content>{children}</div>
    </div>
  );
}
