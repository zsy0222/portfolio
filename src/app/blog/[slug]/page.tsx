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
      <article className="ui-enter mx-auto max-w-[900px] px-6 pb-16 pt-14 sm:px-10 sm:pb-20 sm:pt-20 xl:px-12 xl:pt-24">
        <header className="mb-10 border-b border-line pb-8 sm:mb-12 sm:pb-10">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-2 rounded-sm text-[15px] font-semibold uppercase tracking-[0.1em] text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
          >
            <Icon name="arrow-left" />
            Blog
          </Link>
          <h1 className="max-w-[860px] text-pretty text-[38px] font-semibold leading-[1.13] tracking-[-0.015em] text-ink sm:text-[50px] xl:text-[56px]">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] text-muted sm:text-[17px]">
            <time dateTime={post.date} className="tabular-nums">
              {dateFormatter.format(new Date(post.date))}
            </time>
            <span aria-hidden="true">·</span>
            <span>{readingMinutes} min read</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold uppercase tracking-[0.1em] text-accent">
              {categoryLabel}
            </span>
          </div>
        </header>

        <ArticleReader
          className="prose prose-lg max-w-none break-words text-[18px] leading-[1.85] text-lead sm:text-[20px]
          [&_h2]:scroll-mt-24 [&_h2]:text-pretty [&_h2]:text-[27px] [&_h2]:font-semibold [&_h2]:leading-[1.25] [&_h2]:text-ink [&_h2]:mt-12 [&_h2]:mb-5 sm:[&_h2]:text-[31px]
          [&_h3]:scroll-mt-24 [&_h3]:text-pretty [&_h3]:text-[22px] [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mt-9 [&_h3]:mb-3 sm:[&_h3]:text-[24px]
          [&_p]:mb-6 [&_p]:text-pretty
          [&_strong]:font-semibold [&_strong]:text-ink
          [&_code]:rounded [&_code]:bg-card [&_code]:px-2 [&_code]:py-0.5 [&_code]:text-accent
          [&_pre]:my-7 [&_pre]:overflow-auto [&_pre]:rounded-xl [&_pre]:bg-[#1a1525] [&_pre]:p-5 [&_pre]:text-[15px] [&_pre]:leading-[1.6] [&_pre]:text-[#e8e0f0] sm:[&_pre]:p-6 sm:[&_pre]:text-[16px]
          [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit
          [&_blockquote]:my-8 [&_blockquote]:rounded-r-xl [&_blockquote]:border-l-[3px] [&_blockquote]:border-accent [&_blockquote]:bg-card/55 [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:italic [&_blockquote]:text-body
          [&_a]:rounded-sm [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors [&_a]:hover:text-ink [&_a]:focus-visible:outline-none [&_a]:focus-visible:ring-2 [&_a]:focus-visible:ring-accent
          [&_ul]:mb-7 [&_ul]:list-disc [&_ul]:pl-6
          [&_ol]:mb-7 [&_ol]:list-decimal [&_ol]:pl-6
          [&_li]:mb-2.5 [&_li]:pl-1"
        >
          {mdxContent}
        </ArticleReader>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2 border-t border-line pt-7">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line bg-card/55 px-3 py-1 text-[14px] text-body sm:text-[16px]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <Link
          href="/blog"
          className="mt-10 inline-flex items-center gap-2 rounded-sm text-[17px] font-semibold text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg sm:text-[19px]"
        >
          <Icon name="arrow-left" />
          Back to Blog
        </Link>
      </article>

      <section
        aria-labelledby="comments-heading"
        className="mx-auto max-w-[900px] border-t border-line px-6 py-12 sm:px-10 sm:py-14 xl:px-12"
      >
        <h2
          id="comments-heading"
          className="mb-6 text-[16px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[18px]"
        >
          Comments
        </h2>
        <GiscusComments />
      </section>
    </>
  );
}
