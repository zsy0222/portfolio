import Link from "next/link";
import Image from "next/image";
import Icon from "./Icon";

export default function Hero() {
  return (
    <section className="editorial-hero">
      <div className="hero-overline"><span><i /> Available for work</span><span>SOFTWARE ENGINEERING × BUSINESS ADMINISTRATION</span></div>
      <div className="hero-composition">
        <div className="hero-copy">
          <p className="hero-name">SIYUAN ZHENG <span> / </span> NANJING UNIVERSITY</p>
          <h1>Building at the<br /><em>intersection</em> of<br /><span className="hero-disciplines">AI, quantitative<br />&amp; product.</span></h1>
          <p className="hero-description">A student from the Software Engineering Business Class at Nanjing University, exploring quantitative analysis, AI product management, and algorithm design.</p>
          <div className="hero-actions"><Link className="pill-link" href="/projects">View Work <span><Icon name="arrow-up-right" /></span></Link><Link className="understated-link" href="/about">About me <Icon name="arrow-right" /></Link></div>
        </div>
        <div className="hero-portrait-composition">
          <div className="portrait-field" aria-hidden="true"><span className="portrait-orbit orbit-one" /><span className="portrait-orbit orbit-two" /><span className="portrait-cross">+</span><span className="portrait-grid" /></div>
          <figure className="portrait-print"><div className="portrait-photo"><Image src="/images/1fb9c4aafdb8974d3eda5d2c039aec06.jpg" alt="Siyuan Zheng" width={958} height={958} priority sizes="(max-width: 700px) 76vw, 400px" /></div><figcaption><span>Siyuan Zheng</span><span>郑思源</span></figcaption></figure>
          <div className="portrait-note"><span className="section-label">Currently</span><p>Exploring quantitative analysis<br />&amp; AI product management</p></div>
          <span className="portrait-side-note" aria-hidden="true">ENGINEERING · RESEARCH · PRODUCT</span>
        </div>
      </div>
      <div className="hero-bottom"><span>BASED IN WENZHOU, CN</span><a href="#selected-work">Explore the work <Icon name="arrow-down" /></a><span>PORTFOLIO / 2026</span></div>
    </section>
  );
}
