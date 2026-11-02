import Link from "next/link";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import ProjectGallery from "@/components/ProjectGallery";
import { projects } from "@/data/projects";
import { getAllPosts, categories } from "@/lib/blog";

export default function Home() {
  const posts = getAllPosts().filter(post => ["projects", "career-future"].includes(post.category)).slice(0, 3);
  return (
    <>
      <Hero />
      <section id="selected-work" className="home-work editorial-wrap">
        <div className="section-heading" data-motion="section"><div><span className="section-label">01 / Selected work</span><h2>Technology meets <em>business.</em></h2></div><Link className="understated-link" href="/projects">All work <span className="link-count">{String(projects.length).padStart(2, "0")}</span><Icon name="arrow-up-right" /></Link></div>
        <ProjectGallery />
      </section>
      <section className="home-journal editorial-wrap">
        <div className="section-heading" data-motion="section"><div><span className="section-label">02 / Blog</span><h2>Thoughts &amp; <em>notes.</em></h2></div><Link href="/blog" className="understated-link">All writing <Icon name="arrow-up-right" /></Link></div>
        <div className="home-journal-list">{posts.map((post, index) => <Link key={post.slug} href={`/blog/${post.slug}`} className="home-journal-row" data-motion="section"><span className="journal-number">{String(index + 1).padStart(2, "0")}</span><div><span className="section-label">{categories.find(category => category.slug === post.category)?.label || post.category}</span><h3>{post.title}</h3></div><time dateTime={post.date}>{new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(new Date(post.date))}</time><Icon name="arrow-up-right" /></Link>)}</div>
      </section>
      <About />
      <Footer />
    </>
  );
}
