import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { getAllPosts, getPostFilePath, categories } from "@/lib/blog";
import GiscusComments from "@/components/GiscusComments";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getAllPosts().find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} — Siyuan Zheng`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      url: `https://chenmuqingtongyan.vercel.app/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const filePath = getPostFilePath(slug);
  if (!filePath) notFound();

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(raw);
  const post = getAllPosts().find((p) => p.slug === slug);
  if (!post) notFound();

  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]],
      },
    },
  });

  const categoryLabel = categories.find((c) => c.slug === post.category)?.label || post.category;

  return (
    <>
      <article className="px-15 pt-25 pb-20 max-w-[800px]">
        <h1 className="text-[48px] font-semibold text-ink leading-[1.2] mb-5" style={{ textWrap: "balance" }}>
          {post.title}
        </h1>
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-line">
          <span className="text-[18px] text-muted">
            {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
          <span className="text-[18px] font-semibold text-accent uppercase tracking-[0.1em]">
            {categoryLabel}
          </span>
        </div>

        <div className="prose prose-lg max-w-none text-[20px] text-lead leading-[1.8]
          [&_h2]:text-[28px] [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:mt-10 [&_h2]:mb-4
          [&_p]:mb-6
          [&_code]:bg-card [&_code]:text-accent [&_code]:px-2 [&_code]:py-0.5 [&_code]:rounded
          [&_pre]:bg-[#1a1525] [&_pre]:text-[#e8e0f0] [&_pre]:p-5 [&_pre]:rounded-lg [&_pre]:overflow-auto [&_pre]:text-[16px] [&_pre]:leading-[1.5] [&_pre]:my-6
          [&_pre_code]:bg-transparent [&_pre_code]:text-inherit [&_pre_code]:p-0
          [&_blockquote]:border-l-[3px] [&_blockquote]:border-accent [&_blockquote]:pl-5 [&_blockquote]:text-body [&_blockquote]:italic [&_blockquote]:my-6
          [&_a]:text-accent [&_a]:underline
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6
          [&_li]:mb-2
        ">
          {mdxContent}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-3 mt-10 pt-6 border-t border-line">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[18px] text-body">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[20px] font-medium text-ink border-b border-ink pb-1 mt-10 hover:text-accent hover:border-accent transition-colors"
        >
          ← Back to Blog
        </Link>
      </article>

      <section className="px-15 py-14 border-t border-line max-w-[800px]">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          Comments
        </div>
        <GiscusComments />
      </section>
    </>
  );
}
