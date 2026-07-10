import fs from "fs";
import path from "path";

const ARXIV_API = "http://export.arxiv.org/api/query";
const KEYWORDS = [
  "program slicing",
  "fault localization",
  "LLM for code",
];
const MAX_RESULTS = 5;
const DAYS_BACK = 7;

function formatDate(d) {
  return d.toISOString().split("T")[0];
}

function parseArxivXml(xml) {
  const entries = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = block.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() || "";
    const summary = block.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.trim() || "";
    const published = block.match(/<published>([\s\S]*?)<\/published>/)?.[1]?.trim() || "";
    const id = block.match(/<id>([\s\S]*?)<\/id>/)?.[1]?.trim() || "";
    const authorMatches = [...block.matchAll(/<name>([\s\S]*?)<\/name>/g)];
    const authors = authorMatches.map((m) => m[1].trim()).join(", ");
    const link = id.replace("abs", "pdf");
    entries.push({ title, summary, published, authors, link: id, pdf: link });
  }
  return entries;
}

async function fetchPapers(keyword) {
  const query = encodeURIComponent(`(${keyword}) AND (cat:cs.SE OR cat:cs.AI OR cat:cs.PL)`);
  const url = `${ARXIV_API}?search_query=${query}&sortBy=submittedDate&sortOrder=descending&max_results=${MAX_RESULTS}`;
  console.log(`Fetching: ${keyword}`);
  const res = await fetch(url);
  const xml = await res.text();
  return parseArxivXml(xml);
}

function filterByDate(papers) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - DAYS_BACK);
  return papers.filter((p) => new Date(p.published) >= cutoff);
}

function generateMdx(papers, weekStart, weekEnd) {
  const grouped = {};
  for (const p of papers) {
    if (!grouped[p.keyword]) grouped[p.keyword] = [];
    grouped[p.keyword].push(p);
  }

  let sections = "";
  for (const [keyword, items] of Object.entries(grouped)) {
    sections += `## ${keyword}\n\n`;
    for (const p of items) {
      sections += `### ${p.title}\n\n`;
      sections += `**Authors:** ${p.authors}\n\n`;
      sections += `**Published:** ${p.published}\n\n`;
      sections += `**Link:** ${p.link}\n\n`;
      sections += `**Abstract:**\n\n${p.summary}\n\n`;
      sections += `---\n\n`;
    }
  }

  return `---
title: "Weekly Paper Digest: ${weekStart} ~ ${weekEnd}"
date: "${weekEnd}"
category: "research"
tags: ["weekly-digest", "arxiv"]
summary: "本周 ArXiv 论文摘要 — program slicing, fault localization, LLM for code."
draft: false
---

${sections.length > 0 ? sections : "本周无新论文。"}
`;
}

async function main() {
  const allPapers = [];
  const seen = new Set();

  for (const keyword of KEYWORDS) {
    const papers = await fetchPapers(keyword);
    const recent = filterByDate(papers);
    for (const p of recent) {
      if (!seen.has(p.link)) {
        seen.add(p.link);
        allPapers.push({ ...p, keyword });
      }
    }
  }

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - DAYS_BACK);
  const weekEnd = formatDate(now);
  const startStr = formatDate(weekStart);

  const mdx = generateMdx(allPapers, startStr, weekEnd);
  const outDir = path.join(process.cwd(), "src/content/research");
  const outFile = path.join(outDir, `weekly-digest-${weekEnd}.mdx`);

  fs.writeFileSync(outFile, mdx);
  console.log(`Generated: ${outFile} (${allPapers.length} papers)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
