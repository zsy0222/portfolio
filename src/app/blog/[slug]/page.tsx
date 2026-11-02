import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostFilePath } from "@/lib/blog";
import { articleTranslations } from "@/data/article-translations";
import BilingualArticle from "@/components/world/BilingualArticle";
import ZoomableImage from "@/components/ZoomableImage";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getAllPosts().find((item) => item.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} — CHENMU`,
    description: post.summary,
    openGraph: { title: post.title, description: post.summary, type: "article", publishedTime: post.date, url: `https://chenmuqingtongyan.vercel.app/blog/${post.slug}` },
  };
}

function estimateReadingMinutes(content: string, locale: "zh" | "en") {
  const chineseCharacters = (content.match(/[\p{Script=Han}]/gu) || []).length;
  const latinWords = (content.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) || []).length;
  return Math.max(1, Math.ceil(chineseCharacters / 350 + latinWords / (locale === "en" ? 220 : 200)));
}

async function compileArticle(source: string) {
  return (await compileMDX({ source, components: { img: ZoomableImage }, options: { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]] } } })).content;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  // Public metadata is the allowlist: a draft remains inaccessible even by direct URL.
  const post = getAllPosts().find((item) => item.slug === slug);
  if (!post) notFound();
  const filePath = getPostFilePath(slug);
  if (!filePath) notFound();
  const { content } = matter(fs.readFileSync(filePath, "utf-8"));
  const edition = articleTranslations[slug];
  const translationPath = edition ? path.join(process.cwd(), "src/content-en", edition.translationFile) : null;
  const translation = translationPath && fs.existsSync(translationPath) ? fs.readFileSync(translationPath, "utf-8") : null;
  const [original, translated] = await Promise.all([compileArticle(content), translation ? compileArticle(translation) : Promise.resolve(undefined)]);
  const sourceLocale = edition?.sourceLocale ?? "zh";
  return <BilingualArticle post={post} original={original} translated={translated} readingMinutes={{
    zh: estimateReadingMinutes(sourceLocale === "zh" ? content : translation || content, "zh"),
    en: estimateReadingMinutes(sourceLocale === "en" ? content : translation || content, "en"),
  }} />;
}
