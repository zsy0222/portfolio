import Link from "next/link";
import { experiences } from "@/data/experiences";
import Icon from "./Icon";
import "./editorial-pages.css";

export default function Timeline() {
  return (
    <ol className="archive-timeline">
      {experiences.map((exp) => (
        <li key={`${exp.date}-${exp.title}`} data-motion="timeline" className="archive-timeline-entry motion-timeline-row">
          <div className="archive-timeline-date"><span aria-hidden="true" /><time>{exp.date}</time></div>
          <div className="archive-timeline-copy">
            {exp.link ? (
              <Link href={exp.link} target="_blank" rel="noopener noreferrer" className="archive-timeline-link">
                <h3>{exp.title}</h3><Icon name="arrow-up-right" />
              </Link>
            ) : <h3>{exp.title}</h3>}
            <p>{exp.description}</p>
            {exp.tags && <div className="journal-tags">{exp.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
