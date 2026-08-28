import Link from "next/link";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
  sequence: number;
}

export default function ProjectCard({
  project,
  featured = false,
  sequence,
}: ProjectCardProps) {
  return (
    <article
      className={[
        "group h-full overflow-hidden rounded-2xl border border-line bg-card/55 p-6 shadow-[0_18px_50px_rgba(42,30,62,0.04)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-1 sm:p-8",
        featured ? "lg:p-10" : "",
      ].join(" ")}
    >
      <div
        className={[
          "h-full min-w-0",
          featured
            ? "lg:grid lg:grid-cols-[minmax(0,1.12fr)_minmax(280px,0.88fr)] lg:gap-12"
            : "flex flex-col",
        ].join(" ")}
      >
        <div className="min-w-0">
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="rounded-full border border-accent/25 bg-accent/8 px-3 py-1 text-[13px] font-semibold uppercase tracking-[0.1em] text-accent">
              {project.status}
            </span>
            <span
              className="font-mono text-[14px] tabular-nums text-muted"
              aria-hidden="true"
            >
              {String(sequence).padStart(2, "0")}
            </span>
          </div>

          <h2
            className={[
              "text-pretty font-semibold leading-[1.15] text-ink",
              featured
                ? "text-[34px] sm:text-[40px] xl:text-[44px]"
                : "text-[30px] sm:text-[34px]",
            ].join(" ")}
          >
            {project.title}
          </h2>
          <p
            className={[
              "mt-4 text-pretty font-medium leading-[1.65] text-lead",
              featured
                ? "text-[19px] sm:text-[21px]"
                : "text-[18px] sm:text-[20px]",
            ].join(" ")}
          >
            {project.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line bg-bg/70 px-3 py-1 text-[14px] font-medium text-body sm:text-[15px]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          className={[
            "mt-8 flex min-w-0 flex-col border-t border-line pt-7",
            featured
              ? "lg:mt-0 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
              : "",
          ].join(" ")}
        >
          <div className="mb-6">
            <div className="mb-2 text-[13px] font-semibold uppercase tracking-[0.13em] text-muted">
              My Role
            </div>
            <p className="text-[17px] leading-[1.6] text-body sm:text-[18px]">
              {project.role}
            </p>
          </div>

          <div>
            <div className="mb-3 text-[13px] font-semibold uppercase tracking-[0.13em] text-muted">
              Selected Outcomes
            </div>
            <ol className="space-y-3">
              {project.highlights.map((highlight, index) => (
                <li
                  key={highlight}
                  className="grid grid-cols-[1.6rem_minmax(0,1fr)] gap-2.5 text-[16px] leading-[1.55] text-lead sm:text-[17px]"
                >
                  <span
                    className="pt-0.5 font-mono text-[13px] tabular-nums text-accent"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-auto pt-7">
            {project.repoUrl ? (
              <Link
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm text-[17px] font-semibold text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-card"
              >
                View on GitHub
                <span aria-hidden="true">&rarr;</span>
              </Link>
            ) : (
              <p className="border-l-2 border-accent/35 pl-3 text-[14px] italic leading-[1.5] text-muted sm:text-[15px]">
                {project.availability}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
