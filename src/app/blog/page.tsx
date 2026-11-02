import { getAllPosts, categories } from "@/lib/blog";
import { BlogArchive } from "@/components/world/BilingualArticle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal · 思想档案 — CHENMU",
  description: "Bilingual research notes, project journals, and personal reflections from Chenmu.",
};

export default async function BlogPage({ searchParams }: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return <BlogArchive posts={getAllPosts()} category={category} categories={categories} />;
}
