import ProjectCard from "@/components/ProjectCard";
import Footer from "@/components/Footer";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <>
      <section className="page-intro work-page-intro ui-enter">
        <div className="page-kicker"><span>Work</span><span className="work-page-count">{String(projects.length).padStart(2, "0")} projects</span></div>
        <h1 className="page-title">Technology meets<br /><em>business.</em></h1>
        <p className="page-description">Six projects spanning program analysis, quantitative finance, frontier technology, international business, industry research, and sustainable product development.</p>
      </section>
      <section className="work-collection editorial-wrap" aria-label="Selected projects">
        <div className="work-collection-heading"><span>Selected projects</span><span aria-hidden="true">01 — {String(projects.length).padStart(2, "0")}</span></div>
        <div className="work-featured-projects">{projects.slice(0, 2).map((project, index) => <ProjectCard key={project.id} project={project} featured sequence={index + 1} />)}</div>
        <div className="work-project-grid">{projects.slice(2).map((project, index) => <ProjectCard key={project.id} project={project} sequence={index + 3} />)}</div>
      </section>
      <Footer />
    </>
  );
}
