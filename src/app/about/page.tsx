import Footer from "@/components/Footer";
import Timeline from "@/components/Timeline";
import "@/components/editorial-pages.css";

const skills = [
  "#java",
  "#c",
  "#python",
  "#full-stack",
  "#git",
  "#tree-sitter",
  "#program-slicing",
  "#llm-api",
  "#business-analysis",
  "#quantitative",
  "#product-management",
];

const awards = [
  { date: "2026.09", title: "National Scholarship" },
  { date: "2026.06", title: "Hengyang Logistics Scholarship" },
  { date: "2026.05", title: "Outstanding Student, NJU Freshman College" },
  { date: "2026.03", title: "Excellent Volunteer — Nanxing Dream Plan" },
  { date: "2025.12", title: "Top 10 Team — Business Case Analysis Competition" },
  { date: "2025.12", title: "Backbone Star — Career Development Association" },
  { date: "2025.11", title: "Military Training Advanced Individual" },
  { date: "2025.10", title: "First Place — Push-Putt Run, Business School Sports Day" },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-intro about-intro ui-enter">
        <div>
          <div className="page-kicker">About</div>
          <h1 className="page-title">About <em>me.</em></h1>
          <span className="about-intro-mark" aria-hidden="true">S / Z</span>
        </div>
        <p className="page-description">
          I&apos;m a student pursuing dual degrees in{" "}
          <span>software engineering</span> and <span>business administration</span>{" "}
          at Nanjing University. My interests span <span>quantitative analysis</span>,{" "}
          <span>AI product management</span>, and <span>algorithm research</span>{" "}
          — building at the intersection of technology and strategy.
        </p>
      </section>

      <div className="editorial-wrap about-archive">
        <section className="about-archive-section about-education" data-motion="section">
          <div className="about-section-heading"><span aria-hidden="true">01</span><h2 className="section-label">Education</h2></div>
          <div className="about-section-body">
            <time className="archive-date">2025 — Present</time>
            <h3 className="education-title">Nanjing University</h3>
            <p className="education-description">Dual degree in Software Engineering &amp; Business Administration
              (Business Innovation Class), Business School</p>
          </div>
        </section>

        <section className="about-archive-section" data-motion="section">
          <div className="about-section-heading"><span aria-hidden="true">02</span><h2 className="section-label">Skills</h2></div>
          <div className="about-section-body about-skills">
            {skills.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </section>

        <section className="about-archive-section" data-motion="section">
          <div className="about-section-heading"><span aria-hidden="true">03</span><div><h2 className="section-label">Awards</h2><small>Newest first</small></div></div>
          <ol className="about-section-body award-register">
            {awards.map((award) => (
              <li key={`${award.date}-${award.title}`}>
                <time className="archive-date">{award.date}</time><span>{award.title}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-archive-section about-timeline-section">
          <div className="about-section-heading"><span aria-hidden="true">04</span><div><h2 className="section-label">Timeline</h2><small>Newest first</small></div></div>
          <div className="about-section-body"><Timeline /></div>
        </section>
      </div>
      <Footer />
    </>
  );
}
