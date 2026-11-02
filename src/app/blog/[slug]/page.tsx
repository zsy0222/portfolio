import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { getAllPosts, getPostFilePath, categories } from "@/lib/blog";
import GiscusComments from "@/components/GiscusComments";
import ReadingProgress from "@/components/ReadingProgress";
import ArticleReader from "@/components/ArticleReader";
import ZoomableImage from "@/components/ZoomableImage";
import Icon from "@/components/Icon";
import Footer from "@/components/Footer";
import "@/components/editorial-pages.css";
import type { Metadata } from "next";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getAllPosts().find((item) => item.slug === slug);
  if (!post) return {};

  return {
    title: post.title + " — Siyuan Zheng",
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      url: "https://chenmuqingtongyan.vercel.app/blog/" + post.slug,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const filePath = getPostFilePath(slug);
  if (!filePath) notFound();

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(raw);
  const post = getAllPosts().find((item) => item.slug === slug);
  if (!post) notFound();

  const { content: mdxContent } = await compileMDX({
    source: content,
    components: { img: ZoomableImage },
    options: {
      mdxOptions: {
        rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]],
      },
    },
  });

  const categoryLabel =
    categories.find((item) => item.slug === post.category)?.label ||
    post.category;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));

  return (
    <>
      <ReadingProgress />
      <article className="journal-article ui-enter">
        <header className="journal-article-header">
          <Link href="/blog" className="journal-back-link"><Icon name="arrow-left" /> Blog</Link>
          <h1>{post.title}</h1>
          <div className="journal-article-meta">
            <span className="journal-article-category">{categoryLabel}</span>
            <time dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time>
            <span>{readingMinutes} min read</span>
          </div>
        </header>
        <div className="journal-reading-sheet">
          <ArticleReader className="journal-prose">{mdxContent}</ArticleReader>
          {post.tags && post.tags.length > 0 && (
            <div className="journal-tags journal-article-tags">
              {post.tags.map((tag) => <span key={tag}>#{tag}</span>)}
            </div>
          )}
          <Link href="/blog" className="journal-back-link journal-bottom-link"><Icon name="arrow-left" /> Back to Blog</Link>
        </div>
      </article>
      <section aria-labelledby="comments-heading" className="journal-comments">
        <h2 id="comments-heading" className="section-label">Comments</h2>
        <GiscusComments />
      </section>
      <Footer />
    </>
  );
}
