import ProjectCard from "@/components/ProjectCard";
import Footer from "@/components/Footer";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <>
      <section className="ui-enter px-6 pb-14 pt-16 sm:px-10 sm:pb-18 sm:pt-20 xl:px-15 xl:pb-20 xl:pt-25">
        <div className="mb-6 text-[15px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[18px]">
          Work
        </div>
        <h1 className="max-w-[900px] text-pretty text-[42px] font-light leading-[1.08] tracking-[-0.02em] text-ink sm:text-[56px] xl:text-[68px]">
          Technology meets{" "}
          <span className="font-semibold text-accent">business</span>.
        </h1>
        <p className="mt-6 max-w-[760px] text-pretty text-[19px] font-medium leading-[1.7] text-lead sm:text-[22px] xl:text-[24px]">
          Six projects spanning program analysis, quantitative finance,
          frontier technology, international business, industry research,
          and sustainable product development.
        </p>
      </section>

      <section
        aria-label="Selected projects"
        className="border-t border-line px-4 py-8 sm:px-8 sm:py-12 xl:px-12 xl:py-14"
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:gap-7">
          {projects.map((project, index) => {
            const featured = index < 2;

            return (
              <div
                key={project.id}
                className={[
                  "ui-card-enter min-w-0",
                  featured ? "lg:col-span-2" : "",
                ].join(" ")}
                style={{ animationDelay: 100 + index * 70 + "ms" }}
              >
                <ProjectCard
                  project={project}
                  featured={featured}
                  sequence={index + 1}
                />
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </>
  );
}
