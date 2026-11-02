import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { creativeWorks } from "../data/world";
import { memories } from "../data/memories";
import { articleTranslations } from "../data/article-translations";
import { getAllPosts, getPostFilePath } from "./blog";

export type WorldSearchType = "all" | "project" | "article" | "memory";
export type WorldSearchLocale = "zh" | "en";
type LocalizedText = { zh: string; en: string };

export interface WorldSearchDocument {
  id: string;
  type: Exclude<WorldSearchType, "all">;
  href: string;
  title: LocalizedText;
  summary: LocalizedText;
  body: string;
  bodyText?: LocalizedText;
  tags: string[];
}

export interface WorldSearchResult {
  id: string;
  type: Exclude<WorldSearchType, "all">;
  href: string;
  title: string;
  snippet: string;
}

export interface WorldSearchResponse {
  query: string;
  type: WorldSearchType;
  total: number;
  results: WorldSearchResult[];
}

export function parseWorldSearchType(value: string | undefined | null): WorldSearchType {
  return value === "project" || value === "article" || value === "memory" ? value : "all";
}

function normalize(value: string) {
  return value.normalize("NFKC").toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, "");
}

/** Keep Chinese phrases intact; spaces combine independent terms with AND semantics. */
export function searchTokens(query: string): string[] {
  return [...new Set(normalize(query).match(/[\p{L}\p{N}]+/gu) ?? [])].slice(0, 12);
}

function plainText(markdown: string) {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/[`*_#>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Server-only index: never ships private Wiki records, draft text, or embeddings. */
export function buildWorldSearchIndex(): WorldSearchDocument[] {
  const works: WorldSearchDocument[] = creativeWorks.map((work) => ({
    id: `project:${work.slug}`,
    type: "project",
    href: `/lab/${work.slug}`,
    title: work.title,
    summary: work.summary,
    body: work.sections.map((section) => `${section.title.zh} ${section.title.en} ${section.body.zh} ${section.body.en}`).join(" "),
    bodyText: {
      zh: work.sections.map((section) => `${section.title.zh} ${section.body.zh}`).join(" "),
      en: work.sections.map((section) => `${section.title.en} ${section.body.en}`).join(" "),
    },
    tags: work.tags,
  }));

  // getAllPosts is the public allowlist. Never scan MDX files directly into an index.
  const articles: WorldSearchDocument[] = getAllPosts().flatMap((post) => {
    const filePath = getPostFilePath(post.slug);
    if (!filePath) return [];
    const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
    if (data.draft) return [];
    const translation = articleTranslations[post.slug];
    const originalText = plainText(content);
    const translatedPath = translation ? path.join(process.cwd(), "src/content-en", translation.translationFile) : undefined;
    const translatedText = translatedPath && fs.existsSync(translatedPath)
      ? plainText(matter(fs.readFileSync(translatedPath, "utf8")).content)
      : originalText;
    const bodyText = translation?.sourceLocale === "en"
      ? { zh: translatedText, en: originalText }
      : { zh: originalText, en: translatedText };
    return [{
      id: `article:${post.slug}`,
      type: "article" as const,
      href: `/blog/${post.slug}`,
      title: translation?.title ?? { zh: post.title, en: post.title },
      summary: translation?.summary ?? { zh: post.summary, en: post.summary },
      body: `${bodyText.zh} ${bodyText.en}`,
      bodyText,
      tags: post.tags ?? [],
    }];
  });

  const travel: WorldSearchDocument[] = memories.map((memory) => ({
    id: `memory:${memory.slug}`,
    type: "memory",
    href: `/memories/${memory.slug}`,
    title: memory.title,
    summary: memory.summary,
    body: [memory.location.zh, memory.location.en, ...memory.story.flatMap((paragraph) => [paragraph.zh, paragraph.en])].join(" "),
    bodyText: { zh: memory.story.map((paragraph) => paragraph.zh).join(" "), en: memory.story.map((paragraph) => paragraph.en).join(" ") },
    tags: ["travel", "旅行", memory.kind === "photo" ? "photography 摄影" : "archive 档案"],
  }));

  return [...works, ...articles, ...travel];
}

function excerpt(document: WorldSearchDocument, tokens: string[], locale: WorldSearchLocale) {
  const summary = document.summary[locale];
  if (tokens.some((token) => normalize(summary).includes(token))) return summary;
  const text = document.bodyText?.[locale] ?? document.body;
  const normalized = normalize(text);
  const positions = tokens.map((token) => normalized.indexOf(token)).filter((position) => position >= 0);
  if (positions.length === 0) return summary;
  const match = Math.min(...positions);
  const start = Math.max(0, match - 38);
  const end = Math.min(text.length, start + 190);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

export function searchWorldDocuments(
  documents: WorldSearchDocument[],
  query: string,
  type: WorldSearchType = "all",
  locale: WorldSearchLocale = "zh",
  limit = 50,
): WorldSearchResponse {
  const cleanQuery = query.trim().slice(0, 160);
  const tokens = searchTokens(cleanQuery);
  if (!tokens.length) return { query: cleanQuery, type, total: 0, results: [] };

  const scored = documents.flatMap((document) => {
    if (type !== "all" && document.type !== type) return [];
    const title = normalize(`${document.title.zh} ${document.title.en}`);
    const summary = normalize(`${document.summary.zh} ${document.summary.en}`);
    const tags = normalize(document.tags.join(" "));
    const haystack = `${title} ${summary} ${tags} ${normalize(document.body)}`;
    if (!tokens.every((token) => haystack.includes(token))) return [];
    const score = tokens.reduce((sum, token) => sum + (title.includes(token) ? 20 : 0) + (tags.includes(token) ? 8 : 0) + (summary.includes(token) ? 5 : 0) + 1, 0);
    return [{ document, score }];
  });

  scored.sort((a, b) => b.score - a.score || a.document.id.localeCompare(b.document.id));
  return {
    query: cleanQuery,
    type,
    total: scored.length,
    results: scored.slice(0, Math.max(1, Math.min(50, limit))).map(({ document }) => ({
      id: document.id,
      type: document.type,
      href: document.href,
      title: document.title[locale],
      snippet: excerpt(document, tokens, locale),
    })),
  };
}

export function searchPublicWorld(query: string, type: WorldSearchType = "all", locale: WorldSearchLocale = "zh") {
  return searchWorldDocuments(buildWorldSearchIndex(), query, type, locale);
}
