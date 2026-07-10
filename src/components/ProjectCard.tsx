import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="p-8 border-b border-line transition-colors hover:bg-card">
      <h3 className="text-2xl font-semibold text-ink mb-2.5">
        {project.title}
      </h3>
      <p className="text-base font-medium text-lead mb-4">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-3">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-sm font-normal text-body hover:text-accent transition-colors cursor-default"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
