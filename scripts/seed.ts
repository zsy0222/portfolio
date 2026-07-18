import { createClient } from "@libsql/client";
import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync, readdirSync, existsSync } from "fs";
import matter from "gray-matter";

config({ path: resolve(__dirname, "..", ".env.local") });

const client = createClient({
  url: process.env.TURSO_DB_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Import project data from TypeScript source (read as text and extract)
const projectsData = [
  {
    slug: "campus-recycling-tracker",
    title: "Campus Recycling Tracker",
    description: "AI-powered recycling tracking system with visual recognition, batch management, and anti-cheating mechanisms for campus sustainability.",
    tags: ["#python", "#fastapi", "#ai", "#html"],
    liveUrl: null,
    repoUrl: "https://github.com/zsy0222/LC_project",
    sortOrder: 0,
  },
  {
    slug: "hybrid-slicing",
    title: "Hybrid Slicing for Fault Localization",
    description: "A two-phase hybrid slice framework using assertions as decision points — combining dynamic backward tracing with static forward path validation. Built on Tree-sitter for code structure parsing.",
    tags: ["#research", "#fault-localization", "#program-slicing", "#tree-sitter"],
    liveUrl: null,
    repoUrl: "https://github.com/zsy0222/program-slicing",
    sortOrder: 1,
  },
  {
    slug: "travel-memoir",
    title: "Travel Memoir",
    description: "A full-stack web project that inspired research into AI-assisted code repair — discovered the challenge of debugging AI-generated code, leading to automated fix workflow design.",
    tags: ["#full-stack", "#ai-coding", "#web"],
    liveUrl: null,
    repoUrl: null,
    sortOrder: 2,
  },
];

async function main() {
  const now = new Date().toISOString();

  // ── Seed wiki sections ──
  console.log("Seeding wiki_sections...");
  const wikiJsonPath = resolve(__dirname, "..", "src", "data", "wiki.json");
  const wikiData: { section: string; path: string; items: { slug: string; title: string; text: string }[] }[] = JSON.parse(readFileSync(wikiJsonPath, "utf-8"));

  for (let i = 0; i < wikiData.length; i++) {
    const s = wikiData[i];
    await client.execute({
      sql: "INSERT OR IGNORE INTO wiki_sections (slug, name, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
      args: [s.path, s.section, i, now, now],
    });
    console.log(`  ✓ section: ${s.section}`);

    // Get the section id
    const secResult = await client.execute({
      sql: "SELECT id FROM wiki_sections WHERE slug = ?",
      args: [s.path],
    });
    const sectionId = secResult.rows[0]?.[0] as number;

    // Seed wiki pages for this section
    for (const item of s.items) {
      await client.execute({
        sql: "INSERT OR IGNORE INTO wiki_pages (slug, title, content, section_id, tags, is_draft, view_count, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 0, 0, ?, ?)",
        args: [item.slug, item.title, item.text, sectionId, "[]", now, now],
      });
      console.log(`    ✓ page: ${item.slug}`);
    }
  }

  // ── Seed projects ──
  console.log("\nSeeding projects...");
  for (const p of projectsData) {
    await client.execute({
      sql: "INSERT OR IGNORE INTO projects (slug, title, description, tags, live_url, repo_url, sort_order, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      args: [p.slug, p.title, p.description, JSON.stringify(p.tags), p.liveUrl, p.repoUrl, p.sortOrder, now],
    });
    console.log(`  ✓ project: ${p.slug}`);
  }

  // ── Seed site settings ──
  console.log("\nSeeding site_settings...");
  await client.execute({
    sql: "INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)",
    args: ["wiki_password", "nju2026", now],
  });
  console.log("  ✓ wiki_password");

  // ── Seed blog posts from MDX files ──
  console.log("\nSeeding blog_posts...");
  const contentDir = resolve(__dirname, "..", "src", "content");
  function scanMdx(dir: string): string[] {
    const results: string[] = [];
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...scanMdx(fullPath));
      } else if (entry.name.endsWith(".mdx")) {
        results.push(fullPath);
      }
    }
    return results;
  }

  const mdxFiles = scanMdx(contentDir);
  for (const file of mdxFiles) {
    const raw = readFileSync(file, "utf-8");
    const { data } = matter(raw);
    if (data.draft) continue;

    const relativePath = file.replace(contentDir + "\\", "").replace(contentDir + "/", "");
    const category = relativePath.split(/[\\/]/)[0];
    const slug = file.replace(/\\/g, "/").split("/").pop()!.replace(".mdx", "");

    await client.execute({
      sql: "INSERT OR IGNORE INTO blog_posts (slug, title, summary, category, tags, is_draft, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 0, ?, ?)",
      args: [
        slug,
        data.title || slug,
        data.summary || "",
        data.category || category,
        JSON.stringify(data.tags || []),
        data.date ? new Date(data.date).toISOString() : now,
        now,
      ],
    });
    console.log(`  ✓ blog: ${slug}`);
  }

  console.log("\n✅ Seed completed!");
}

main().catch((e) => {
  console.error("Seed failed:", e.message);
  process.exit(1);
});
