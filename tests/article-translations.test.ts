import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import matter from "gray-matter";
import { getAllPosts, getPostFilePath } from "../src/lib/blog";
import { articleTranslations } from "../src/data/article-translations";

test("every current public article has a separate, nonempty bilingual edition", () => {
  for (const post of getAllPosts()) {
    const entry = articleTranslations[post.slug];
    assert(entry, `Missing translation entry: ${post.slug}`);
    assert(entry.title.zh && entry.title.en && entry.summary.zh && entry.summary.en);
    assert.equal(path.basename(entry.translationFile), entry.translationFile);
    const translation = fs.readFileSync(path.join(process.cwd(), "src/content-en", entry.translationFile), "utf-8");
    assert(translation.trim().length > 50);
  }
});

test("translation registry cannot introduce drafts into the published archive", () => {
  const publicSlugs = new Set(getAllPosts().map((post) => post.slug));
  for (const slug of Object.keys(articleTranslations)) assert(publicSlugs.has(slug), `${slug} is not public`);
  assert(!publicSlugs.has("my-summer"));
  assert(!publicSlugs.has("hybrid-slicing-evolution"));
});

test("parallel editions preserve article image sources", () => {
  for (const post of getAllPosts()) {
    const sourcePath = getPostFilePath(post.slug);
    assert(sourcePath);
    const source = matter(fs.readFileSync(sourcePath, "utf-8")).content;
    const translated = fs.readFileSync(path.join(process.cwd(), "src/content-en", articleTranslations[post.slug].translationFile), "utf-8");
    const imageSources = (value: string) => Array.from(value.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g), (match) => match[1]);
    assert.deepEqual(imageSources(translated), imageSources(source), post.slug);
  }
});

test("quantitative translation retains reported metrics and wallpaper remains a test version", () => {
  const summer = fs.readFileSync("src/content-en/summer-projects-2026.mdx", "utf-8");
  for (const metric of ["10.66", "10.25", "15.29", "37.80", "12.71", "4.91", "1.64", "0.636", "89"]) assert(summer.includes(metric));
  const wallpaper = fs.readFileSync("src/content-en/sunlit-elf-live-wallpaper.mdx", "utf-8");
  assert.match(wallpaper, /test version 0\.2\.0/);
  assert.match(wallpaper, /have not been added/);
  const memory = fs.readFileSync("src/content-en/experience-recording-and-replay.mdx", "utf-8");
  assert.match(memory, /remains a highly speculative/);
});
