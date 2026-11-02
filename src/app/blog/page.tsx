import Link from "next/link";
import { getAllPosts, categories } from "@/lib/blog";
import Icon from "@/components/Icon";
import Footer from "@/components/Footer";
import BlogTravelPreview from "@/components/BlogTravelPreview";
import "@/components/editorial-pages.css";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default async function BlogPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const allPosts = getAllPosts();
  const posts = category
    ? allPosts.filter((post) => post.category === category)
    : allPosts;
  const activeCategory = categories.find((item) => item.slug === category);

  return (
    <>
      <section className="page-intro journal-intro ui-enter">
        <div>
          <div className="page-kicker">Blog</div>
          <h1 className="page-title">
            {activeCategory ? <>{activeCategory.label} <em>posts.</em></> : <>Thoughts &amp;<br /><em>notes.</em></>}
          </h1>
        </div>
        <p className="page-description">
          Research logs, course notes, and reflections from the intersection of
          engineering and business.
        </p>
      </section>

      {!category && <BlogTravelPreview />}

      <div className="editorial-wrap journal-index">
        <nav aria-label="Blog categories" className="journal-categories">
          <Link href="/blog" aria-current={!category ? "page" : undefined}>
            All <span>{allPosts.length}</span>
          </Link>
          <Link href="/blog/travel">旅行墙 <Icon name="arrow-up-right" /></Link>
          {categories.map((item) => {
            const count = allPosts.filter((post) => post.category === item.slug).length;
            return (
              <Link key={item.slug} href={"/blog?category=" + item.slug}
                aria-current={category === item.slug ? "page" : undefined}>
                {item.label} <span>{count}</span>
              </Link>
            );
          })}
        </nav>

        <section aria-label="Blog posts" className="journal-posts">
          {posts.length === 0 ? (
            <div className="journal-empty"><p>No posts in this category yet.</p></div>
          ) : posts.map((post, index) => (
            <article key={post.slug} className="journal-entry ui-card-enter"
              style={{ animationDelay: Math.min(index * 45, 140) + "ms" }}>
              <Link href={"/blog/" + post.slug} className="journal-entry-link motion-article-link">
                <div className="journal-entry-meta">
                  <span className="journal-entry-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <time dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time>
                  <span className="journal-entry-category">
                    {categories.find((item) => item.slug === post.category)?.label || post.category}
                  </span>
                </div>
                <div className="journal-entry-copy">
                  <h2>{post.title}</h2>
                  <p>{post.summary}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="journal-tags">{post.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
                  )}
                </div>
                <span className="journal-entry-arrow" aria-hidden="true"><Icon name="arrow-up-right" /></span>
              </Link>
            </article>
          ))}
        </section>
      </div>
      <Footer />
    </>
  );
}
