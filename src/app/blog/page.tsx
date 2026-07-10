import Link from "next/link";
import { getAllPosts, categories } from "@/lib/blog";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <section className="px-15 pt-25 pb-16">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          Blog
        </div>
        <h1 className="text-[64px] font-light text-ink leading-[1.15] tracking-[-0.01em] mb-5" style={{ textWrap: "balance" }}>
          Thoughts &amp; <span className="text-accent font-semibold">notes</span>.
        </h1>
        <p className="text-[24px] font-medium text-lead leading-[1.6] max-w-[520px]">
          Research logs, course notes, and reflections from the intersection of engineering and business.
        </p>
      </section>

      <div className="px-15 pb-8 flex gap-6 border-b border-line">
        <Link href="/blog" className="text-[20px] font-semibold text-ink border-b-2 border-accent pb-1">
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/blog?category=${cat.slug}`}
            className="text-[20px] font-normal text-body hover:text-accent transition-colors"
          >
            {cat.label}
          </Link>
        ))}
      </div>

      <div className="px-15">
        {posts.map((post) => (
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
        ))}
      </div>
    </>
  );
}
