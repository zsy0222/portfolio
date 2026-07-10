import ProjectCard from "@/components/ProjectCard";
import Footer from "@/components/Footer";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <>
      <section className="px-15 pt-25 pb-20">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-8">
          All Projects
        </div>
        <h1 className="text-[64px] font-light text-ink leading-[1.15] tracking-[-0.01em] mb-7">
          Things I&apos;ve <span className="text-accent font-semibold">built</span>.
        </h1>
        <p className="text-[24px] font-medium text-lead leading-[1.6] max-w-[520px] mb-9">
          A collection of projects spanning AI, web development, and
          software engineering research.
        </p>
      </section>

      <section className="px-15 py-18 border-t border-line">
        <div className="grid grid-cols-2">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={index % 2 === 0 && index < projects.length - 1 ? "border-r border-line" : ""}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
