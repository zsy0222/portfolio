import Link from "next/link";
import { getAllPosts, categories } from "@/lib/blog";

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
      <section className="ui-enter px-6 pb-12 pt-16 sm:px-10 sm:pb-14 sm:pt-20 xl:px-15 xl:pt-25">
        <div className="mb-6 text-[15px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[18px]">
          Blog
        </div>
        <h1 className="max-w-[880px] text-pretty text-[42px] font-light leading-[1.08] tracking-[-0.02em] text-ink sm:text-[56px] xl:text-[68px]">
          {activeCategory ? (
            <>
              {activeCategory.label}{" "}
              <span className="font-semibold text-accent">posts</span>.
            </>
          ) : (
            <>
              Thoughts &amp;{" "}
              <span className="font-semibold text-accent">notes</span>.
            </>
          )}
        </h1>
        <p className="mt-6 max-w-[720px] text-pretty text-[19px] font-medium leading-[1.7] text-lead sm:text-[22px] xl:text-[24px]">
          Research logs, course notes, and reflections from the intersection of
          engineering and business.
        </p>
      </section>

      <nav
        aria-label="Blog categories"
        className="overflow-x-auto border-b border-line px-6 sm:px-10 xl:px-15"
      >
        <div className="flex min-w-max gap-5 pb-5 sm:gap-7">
          <Link
            href="/blog"
            aria-current={!category ? "page" : undefined}
            className={[
              "flex items-center gap-2 rounded-sm border-b-2 pb-1 text-[17px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg sm:text-[19px]",
              !category
                ? "border-accent font-semibold text-ink"
                : "border-transparent font-normal text-body hover:text-accent",
            ].join(" ")}
          >
            All
            <span className="text-[14px] tabular-nums text-muted">
              {allPosts.length}
            </span>
          </Link>
          {categories.map((item) => {
            const count = allPosts.filter(
              (post) => post.category === item.slug,
            ).length;
            const active = category === item.slug;

            return (
              <Link
                key={item.slug}
                href={"/blog?category=" + item.slug}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex items-center gap-2 rounded-sm border-b-2 pb-1 text-[17px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg sm:text-[19px]",
                  active
                    ? "border-accent font-semibold text-ink"
                    : "border-transparent font-normal text-body hover:text-accent",
                ].join(" ")}
              >
                {item.label}
                <span className="text-[14px] tabular-nums text-muted">
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <section
        aria-label="Blog posts"
        className="px-4 py-7 sm:px-8 sm:py-10 xl:px-12"
      >
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-card/45 px-6 py-12 text-center">
            <p className="text-[18px] text-muted sm:text-[20px]">
              No posts in this category yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <article
                key={post.slug}
                className="ui-card-enter"
                style={{ animationDelay: 90 + index * 55 + "ms" }}
              >
                <Link
                  href={"/blog/" + post.slug}
                  className="group block rounded-2xl border border-transparent px-5 py-6 transition-colors hover:border-line hover:bg-card/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg sm:px-7 sm:py-7"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <time
                      dateTime={post.date}
                      className="text-[14px] font-medium tabular-nums text-muted sm:text-[15px]"
                    >
                      {dateFormatter.format(new Date(post.date))}
                    </time>
                    <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-accent sm:text-[14px]">
                      {categories.find((item) => item.slug === post.category)
                        ?.label || post.category}
                    </span>
                  </div>
                  <h2 className="max-w-[900px] text-pretty text-[27px] font-semibold leading-[1.25] text-ink transition-colors group-hover:text-accent sm:text-[31px]">
                    {post.title}
                  </h2>
                  <p className="mt-3 max-w-[820px] text-pretty text-[17px] font-medium leading-[1.65] text-lead sm:text-[19px]">
                    {post.summary}
                  </p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-[14px] text-body sm:text-[16px]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
