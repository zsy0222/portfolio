import Link from "next/link";
import Icon from "./Icon";

export default function About() {
  return (
    <section data-motion="section" className="home-about">
      <div className="home-about-label"><span className="section-label">03 / About</span><span className="about-asterisk" aria-hidden="true">✳</span></div>
      <div className="home-about-copy"><p>I&apos;m a student pursuing dual degrees in <em>software engineering</em> and <em>business administration</em> at Nanjing University.</p><p className="home-about-description">My interests span quantitative analysis, AI product management, and algorithm research — building at the intersection of technology and strategy.</p><div className="home-skill-list">{["#python", "#fastapi", "#ai", "#quantitative", "#product-management", "#algorithm"].map(tag => <span key={tag}>{tag}</span>)}</div><Link href="/about" className="understated-link">About me <Icon name="arrow-up-right" /></Link></div>
    </section>
  );
}
