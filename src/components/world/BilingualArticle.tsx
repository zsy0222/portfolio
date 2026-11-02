"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { BlogPost } from "@/lib/blog";
import { articleCategoryLabels, articleTranslations } from "@/data/article-translations";
import ArticleReader from "@/components/ArticleReader";
import ReadingProgress from "@/components/ReadingProgress";
import GiscusComments from "@/components/GiscusComments";
import Icon from "@/components/Icon";
import { useWorldLocale } from "./WorldProvider";

const proseClasses = `prose prose-lg max-w-none break-words text-[18px] leading-[1.85] text-lead sm:text-[20px]
  [&_h2]:scroll-mt-24 [&_h2]:text-pretty [&_h2]:text-[27px] [&_h2]:font-semibold [&_h2]:leading-[1.25] [&_h2]:text-ink [&_h2]:mt-12 [&_h2]:mb-5 sm:[&_h2]:text-[31px]
  [&_h3]:scroll-mt-24 [&_h3]:text-pretty [&_h3]:text-[22px] [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mt-9 [&_h3]:mb-3 sm:[&_h3]:text-[24px]
  [&_p]:mb-6 [&_p]:text-pretty [&_strong]:font-semibold [&_strong]:text-ink
  [&_code]:rounded [&_code]:bg-card [&_code]:px-2 [&_code]:py-0.5 [&_code]:text-accent
  [&_pre]:my-7 [&_pre]:overflow-auto [&_pre]:rounded-xl [&_pre]:bg-[#1a1525] [&_pre]:p-5 [&_pre]:text-[15px] [&_pre]:leading-[1.6] [&_pre]:text-[#e8e0f0] sm:[&_pre]:p-6 sm:[&_pre]:text-[16px]
  [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit
  [&_blockquote]:my-8 [&_blockquote]:border-l-[3px] [&_blockquote]:border-accent [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:italic [&_blockquote]:text-body
  [&_a]:rounded-sm [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors [&_a]:hover:text-ink
  [&_ul]:mb-7 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-7 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2.5 [&_li]:pl-1
  [&_table]:my-8 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:text-[15px] [&_table]:leading-relaxed
  [&_th]:border-b [&_th]:border-line [&_th]:p-3 [&_th]:text-left [&_th]:text-ink [&_td]:border-b [&_td]:border-line [&_td]:p-3 [&_td]:align-top`;

export default function BilingualArticle({ post, original, translated, readingMinutes }: {
  post: BlogPost;
  original: ReactNode;
  translated?: ReactNode;
  readingMinutes: { zh: number; en: number };
}) {
  const { locale, setLocale, t } = useWorldLocale();
  const edition = articleTranslations[post.slug];
  const sourceLocale = edition?.sourceLocale ?? "zh";
  const isTranslation = !!translated && locale !== sourceLocale;
  const title = edition?.title[locale] ?? post.title;
  return <>
    <ReadingProgress />
    <article className="ui-enter mx-auto max-w-[900px] px-6 pb-16 pt-14 sm:px-10 sm:pb-20 sm:pt-20 xl:px-12 xl:pt-24" lang={locale === "zh" ? "zh-CN" : "en"}>
      <header className="mb-10 border-b border-line pb-8 sm:mb-12 sm:pb-10">
        <Link href="/blog" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-muted hover:text-accent">
          <Icon name="arrow-left" /> {t("思想档案 / 全部文章", "Journal / All writing")}
        </Link>
        <h1 className="max-w-[860px] text-pretty text-[36px] font-semibold leading-[1.2] tracking-[-0.025em] text-ink sm:text-[47px] xl:text-[54px]">{title}</h1>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted sm:text-base">
          <time dateTime={post.date}>{new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(post.date))}</time>
          <span aria-hidden="true">·</span>
          <span>{readingMinutes[locale]} {t("分钟阅读", "min read")}</span>
          <span aria-hidden="true">·</span>
          <span>{articleCategoryLabels[post.category]?.[locale] ?? post.category}</span>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted" aria-live="polite">{isTranslation ? t("中文译文 · 英文原文保留", "English translation · Chinese original preserved") : t("原文", "Original edition")}</p>
          {translated && <div className="flex gap-2" role="group" aria-label={t("文章语言", "Article language")}>
            {(["zh", "en"] as const).map((language) => <button key={language} type="button" onClick={() => setLocale(language)} aria-pressed={locale === language}
              className={`min-h-11 border px-4 py-2 text-sm transition-colors ${locale === language ? "border-accent bg-accent text-white" : "border-line text-ink hover:border-accent"}`}>
              {language === "zh" ? "中文" : "English"}
            </button>)}
          </div>}
        </div>
      </header>
      <ArticleReader key={`${post.slug}-${locale}`} className={proseClasses}>{isTranslation ? translated : original}</ArticleReader>
      {post.tags?.length ? <div className="mt-12 flex flex-wrap gap-3 border-t border-line pt-7">{post.tags.map((tag) => <span key={tag} className="text-sm text-body">#{tag}</span>)}</div> : null}
      <Link href="/blog" className="mt-10 inline-flex items-center gap-2 text-base font-semibold text-ink underline decoration-line underline-offset-4 hover:text-accent"><Icon name="arrow-left" />{t("返回全部文章", "Back to all writing")}</Link>
    </article>
    <section aria-labelledby="comments-heading" className="mx-auto max-w-[900px] border-t border-line px-6 py-12 sm:px-10 sm:py-14 xl:px-12">
      <h2 id="comments-heading" className="mb-6 text-base font-semibold uppercase tracking-[0.14em] text-muted">{t("评论与交流", "Comments & conversation")}</h2>
      <GiscusComments />
    </section>
  </>;
}

export function BlogArchive({ posts, category, categories }: {
  posts: BlogPost[];
  category?: string;
  categories: { slug: string; label: string }[];
}) {
  const { locale, t } = useWorldLocale();
  const visiblePosts = category ? posts.filter((post) => post.category === category) : posts;
  const categoryName = category ? articleCategoryLabels[category]?.[locale] : null;
  return <div className="world-page">
    <header>
      <p className="world-eyebrow">JOURNAL / {t("思想档案", "THOUGHTS & NOTES")}</p>
      <h1 className="world-title">{categoryName || t("把想法，留在这里。", "A place for ideas.")}</h1>
      <p className="world-intro">{t("科研记录、课程笔记与个人反思。记录尚未想明白的问题，也记录一步步建立的理解。", "Research logs, course notes, and personal reflections. A record of open questions and understanding built over time.")}</p>
    </header>
    <nav aria-label={t("文章分类", "Blog categories")} className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-b border-line pb-5">
      {[{ slug: "", label: "All" }, ...categories].map((item) => {
        const active = (category || "") === item.slug;
        const count = item.slug ? posts.filter((post) => post.category === item.slug).length : posts.length;
        return <Link key={item.slug} href={item.slug ? `/blog?category=${item.slug}` : "/blog"} aria-current={active ? "page" : undefined}
          className={`inline-flex min-h-11 items-center gap-2 border-b-2 text-sm ${active ? "border-accent font-semibold text-ink" : "border-transparent text-body hover:text-accent"}`}>
          {item.slug ? articleCategoryLabels[item.slug]?.[locale] ?? item.label : t("全部", "All")}
          <span className="text-xs tabular-nums text-muted">{count}</span>
        </Link>;
      })}
    </nav>
    <section aria-label={t("文章列表", "Articles")} className="divide-y divide-line">
      {visiblePosts.length ? visiblePosts.map((post, index) => {
        const edition = articleTranslations[post.slug];
        return <article key={post.slug} className="py-9 sm:py-11">
          <Link href={`/blog/${post.slug}`} className="group grid gap-4 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-7">
            <span className="font-mono text-sm text-muted">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2 text-xs uppercase tracking-[0.1em] text-muted"><time dateTime={post.date}>{post.date.slice(0, 10)}</time><span>{articleCategoryLabels[post.category]?.[locale] ?? post.category}</span><span>中文 / EN</span></div>
              <h2 className="max-w-[900px] text-pretty text-[25px] font-medium leading-snug text-ink group-hover:text-accent sm:text-[31px]">{edition?.title[locale] ?? post.title}</h2>
              <p className="mt-3 max-w-[800px] text-base leading-relaxed text-lead sm:text-lg">{edition?.summary[locale] ?? post.summary}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm text-accent">{t("阅读全文", "Read the story")}<Icon name="arrow-right" /></span>
            </div>
          </Link>
        </article>;
      }) : <p role="status" className="py-16 text-muted">{t("这个分类暂时没有已公开文章。", "There are no published articles in this category yet.")}</p>}
    </section>
  </div>;
}
