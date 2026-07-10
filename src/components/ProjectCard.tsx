import Link from "next/link";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="p-8 border-b border-line transition-colors hover:bg-card">
      {project.repoUrl ? (
        <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
          <h3 className="text-[30px] font-semibold text-ink mb-2.5 hover:text-accent transition-colors">
            {project.title}
          </h3>
        </Link>
      ) : (
        <h3 className="text-[30px] font-semibold text-ink mb-2.5">
          {project.title}
        </h3>
      )}
      <p className="text-[22px] font-medium text-lead leading-[1.6] mb-4">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-3 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-[20px] font-normal text-body hover:text-accent transition-colors cursor-default"
          >
            {tag}
          </span>
        ))}
      </div>
      {project.repoUrl && (
        <Link
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[20px] font-medium text-ink border-b border-ink pb-0.5 hover:text-accent hover:border-accent transition-colors"
        >
          View on GitHub <span>&rarr;</span>
        </Link>
      )}
    </div>
  );
}
