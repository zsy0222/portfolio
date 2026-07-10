import Link from "next/link";
import { getAllPosts, categories } from "@/lib/blog";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const allPosts = getAllPosts();
  const posts = category
    ? allPosts.filter((p) => p.category === category)
    : allPosts;

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <>
      <section className="px-15 pt-25 pb-16">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          Blog
        </div>
        <h1 className="text-[64px] font-light text-ink leading-[1.15] tracking-[-0.01em] mb-5" style={{ textWrap: "balance" }}>
          {activeCategory ? (
            <>
              {activeCategory.label} <span className="text-accent font-semibold">posts</span>.
            </>
          ) : (
            <>
              Thoughts &amp; <span className="text-accent font-semibold">notes</span>.
            </>
          )}
        </h1>
        <p className="text-[24px] font-medium text-lead leading-[1.6] max-w-[680px] whitespace-nowrap">
          Research logs, course notes, and reflections from the intersection of engineering and business.
        </p>
      </section>

      <div className="px-15 pb-8 flex flex-wrap gap-6 border-b border-line">
        <Link
          href="/blog"
          className={`text-[20px] pb-1 border-b-2 transition-colors ${
            !category
              ? "font-semibold text-ink border-accent"
              : "font-normal text-body border-transparent hover:text-accent"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/blog?category=${cat.slug}`}
            className={`text-[20px] pb-1 border-b-2 transition-colors ${
              category === cat.slug
                ? "font-semibold text-ink border-accent"
                : "font-normal text-body border-transparent hover:text-accent"
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      <div className="px-15">
        {posts.length === 0 ? (
          <p className="text-[20px] text-muted py-12">No posts in this category yet.</p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block py-8 border-b border-line transition-colors hover:bg-card -mx-15 px-15"
            >
              <div className="flex items-center gap-4 mb-2.5">
                <span className="text-[16px] font-medium text-muted">
                  {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
                <span className="text-[16px] font-semibold text-accent uppercase tracking-[0.1em]">
                  {categories.find((c) => c.slug === post.category)?.label || post.category}
                </span>
              </div>
              <h2 className="text-[30px] font-semibold text-ink mb-2 hover:text-accent transition-colors">
                {post.title}
              </h2>
              <p className="text-[20px] font-medium text-lead leading-[1.6] max-w-[800px] mb-3">
                {post.summary}
              </p>
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-3">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-[18px] text-body">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))
        )}
      </div>
    </>
  );
}
