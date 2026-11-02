import Link from "next/link";
import Icon from "./Icon";
import ProjectVisual from "./ProjectVisual";
import OpenProjectButton from "./OpenProjectButton";
import type { Project } from "@/data/projects";

interface ProjectCardProps { project: Project; featured?: boolean; sequence: number }

export default function ProjectCard({ project, featured = false, sequence }: ProjectCardProps) {
  return (
    <article id={project.id} className={`work-project ${featured ? "work-project-featured" : "work-project-compact"} work-project-${sequence}`} data-motion="section">
      <div className="work-project-art"><ProjectVisual variant={sequence - 1} /></div>
      <div className="work-project-copy">
        <div className="work-project-meta"><span className="work-project-number">{String(sequence).padStart(2, "0")}</span><span>{project.status}</span></div>
        <h2>{project.title}</h2>
        <p className="work-project-description">{project.description}</p>
        <div className="work-project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        <details className="work-project-details">
          <summary><span>My Role &amp; Selected Outcomes</span><span className="work-details-plus" aria-hidden="true">+</span></summary>
          <div className="work-project-detail-body">
            <h3>My Role</h3><p>{project.role}</p>
            <h3>Selected Outcomes</h3>
            <ol>{project.highlights.map((highlight, index) => <li key={highlight}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><p>{highlight}</p></li>)}</ol>
          </div>
        </details>
        <div className="work-project-links">
          <OpenProjectButton projectId={project.id} />
          {project.repoUrl && <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} repository on GitHub`} className="motion-link">View Repository <Icon name="arrow-up-right" /></Link>}
          {project.liveUrl && <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="motion-link">View Project <Icon name="arrow-up-right" /></Link>}
        </div>
        {project.availability && <p className="work-project-availability">{project.availability}</p>}
      </div>
    </article>
  );
}
