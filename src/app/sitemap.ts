import { getAllPosts } from "@/lib/blog";
import { creativeWorks } from "@/data/world";
import { memories } from "@/data/memories";

const SITE_URL = "https://chenmuqingtongyan.vercel.app";

export default function sitemap() {
  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/projects`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/rss`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/guestbook`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
  ];

  const blogPosts = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const worldPages = ["world", "lab", "learning", "thoughts", "memories", "wiki"].map((slug) => ({
    url: `${SITE_URL}/${slug}`, changeFrequency: "monthly" as const, priority: 0.7,
  }));
  const details = [
    ...creativeWorks.map((work) => `lab/${work.slug}`),
    ...creativeWorks.filter((work) => work.sourceProjectId).map((work) => `projects/${work.slug}`),
    ...memories.map((memory) => `memories/${memory.slug}`),
  ].map((slug) => ({ url: `${SITE_URL}/${slug}`, changeFrequency: "monthly" as const, priority: 0.6 }));
  return [...staticPages, ...blogPosts, ...worldPages, ...details];
}
