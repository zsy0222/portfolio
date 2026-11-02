import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { buildWorldSearchIndex, parseWorldSearchType, searchPublicWorld, searchTokens, searchWorldDocuments, type WorldSearchDocument } from "../src/lib/world-search";
import { creativeWorks } from "../src/data/world";
import { memories } from "../src/data/memories";
import { getAllPosts } from "../src/lib/blog";

const documents: WorldSearchDocument[] = [
  { id: "project:a", type: "project", href: "/lab/a", title: { zh: "程序分析与校园回收", en: "Program Analysis & Recycling" }, summary: { zh: "基于 AI 的回收系统", en: "An AI recycling system" }, body: "静态分析 FastAPI sustainability", tags: ["software"] },
  { id: "memory:b", type: "memory", href: "/memories/b", title: { zh: "呼伦贝尔草原", en: "Hulunbuir grasslands" }, summary: { zh: "在草原记录旅行记忆", en: "Travel memories on the grassland" }, body: "蒙古 蓝天 memory", tags: ["travel"] },
];

test("search handles CJK, case, punctuation and multiple required terms", () => {
  assert.deepEqual(searchTokens(" ＡＩ  AI,程序分析 "), ["ai", "程序分析"]);
  assert.equal(searchWorldDocuments(documents, "程序分析").results[0].id, "project:a");
  assert.equal(searchWorldDocuments(documents, "pRoGrAm AI").results[0].id, "project:a");
  assert.equal(searchWorldDocuments(documents, "program missing").total, 0);
  assert.equal(searchWorldDocuments(documents, "蒙古").results[0].id, "memory:b");
  assert.equal(searchWorldDocuments(documents, "!!!").total, 0);
});

test("type filters and localized results preserve valid destinations", () => {
  assert.equal(searchWorldDocuments(documents, "草原", "project").total, 0);
  assert.equal(searchWorldDocuments(documents, "草原", "memory", "en").results[0].title, "Hulunbuir grasslands");
  assert.equal(parseWorldSearchType("bogus"), "all");
  assert.equal(parseWorldSearchType("article"), "article");
});

test("the index contains only published articles and never leaks draft bodies", () => {
  const index = buildWorldSearchIndex();
  const ids = new Set(index.map((document) => document.id));
  assert(!ids.has("article:my-summer"));
  assert(!ids.has("article:hybrid-slicing-evolution"));
  assert(ids.has("article:experience-recording-and-replay"));
  const publicSlugs = new Set(getAllPosts().map((post) => post.slug));
  assert.deepEqual(index.filter((document) => document.type === "article").map((document) => document.id.slice(8)).sort(), [...publicSlugs].sort());
  assert.equal(searchPublicWorld("按下了快进键", "article").total, 0);
});

test("every indexed result points to an existing public route and known slug", () => {
  const publicSlugs = new Set(getAllPosts().map((post) => post.slug));
  const workSlugs = new Set(creativeWorks.map((work) => work.slug));
  const memorySlugs = new Set(memories.map((memory) => memory.slug));
  for (const document of buildWorldSearchIndex()) {
    assert.match(document.href, /^\/(lab|blog|memories)\/[a-z0-9-]+$/);
    const [, route, slug] = document.href.split("/");
    assert(fs.existsSync(`src/app/${route}/[slug]/page.tsx`), `Missing detail route: ${route}`);
    assert((route === "lab" ? workSlugs : route === "blog" ? publicSlugs : memorySlugs).has(slug), `Unknown slug: ${document.href}`);
  }
});

test("published article full text and translated titles are searchable", () => {
  assert(searchPublicWorld("6 04", "article").results.some((result) => result.id === "article:dream-time-and-inspiration"));
  const translated = searchPublicWorld("subjective experience", "article", "en");
  assert(translated.results.some((result) => result.id === "article:experience-recording-and-replay"));
  assert(searchPublicWorld("校园低碳", "project").results.some((result) => result.href.endsWith("/campus-recycling-tracker")));
  assert(searchPublicWorld("Hulunbuir", "memory").total > 0);
});

test("API-sized responses omit indexed bodies and empty queries return no documents", () => {
  const result = searchWorldDocuments(documents, "AI");
  assert.equal("body" in result.results[0], false);
  assert.equal("tags" in result.results[0], false);
  assert.deepEqual(searchPublicWorld("  ").results, []);
});

test("search API enforces query bounds and serves only public result metadata", async () => {
  const { GET } = await import("../src/app/api/search/route");
  const tooLong = await GET(new Request(`http://localhost/api/search?q=${"x".repeat(161)}`));
  assert.equal(tooLong.status, 400);
  const response = await GET(new Request("http://localhost/api/search?q=Hulunbuir&type=memory&lang=en"));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  const payload = await response.json();
  assert(payload.results.length > 0);
  assert(payload.results.every((result: { type: string; href: string }) => result.type === "memory" && result.href.startsWith("/memories/")));
  assert(!JSON.stringify(payload).includes('"body":'));
});

test("the legacy semantic-search download contains only current public blog routes", () => {
  const index = JSON.parse(fs.readFileSync("public/embeddings.json", "utf8")) as { id: string; type: string; title: string; snippet: string; embedding: number[] }[];
  const publicSlugs = new Set(getAllPosts().map((post) => post.slug));
  assert(index.length > 0);
  for (const entry of index) {
    assert(entry.embedding.length > 0);
    if (entry.type !== "blog") continue;
    assert.match(entry.id, /^blog\/[a-z0-9-]+$/);
    assert(publicSlugs.has(entry.id.slice(5)), `Nonpublic blog in downloadable index: ${entry.id}`);
  }
  const serialized = JSON.stringify(index);
  assert(!serialized.includes("hybrid-slicing-evolution"));
  assert(!serialized.includes("my-summer"));
  assert(!serialized.includes("weekly-digest-2026-07-10"));
  assert(!serialized.includes("按下了快进键"));
});

test("the embedding generator excludes drafts before any model processing", async () => {
  const { readMdxFiles } = await import("../scripts/build-embeddings.mjs");
  const documents = await readMdxFiles();
  const expected = getAllPosts().map((post) => `blog/${post.slug}`).sort();
  assert.deepEqual(documents.map((document: { id: string }) => document.id).sort(), expected);
  assert(!JSON.stringify(documents).includes("按下了快进键"));
  const publicTitles = new Map(getAllPosts().map((post) => [`blog/${post.slug}`, post.title]));
  for (const document of documents) assert.equal(document.title, publicTitles.get(document.id));
});
