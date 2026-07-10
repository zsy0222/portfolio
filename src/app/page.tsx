import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import About from "@/components/About";
import Footer from "@/components/Footer";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <div id="top" className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Hero />

        <section className="px-15 py-18 border-t border-line">
          <div className="text-sm font-medium tracking-[0.16em] uppercase text-muted mb-8">
            Selected Work
          </div>
          <div className="grid grid-cols-2">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={index % 2 === 0 ? "border-r border-line" : ""}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </section>

        <About />
        <Footer />
      </main>
    </div>
  );
}
