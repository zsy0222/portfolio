import Footer from "@/components/Footer";
import Timeline from "@/components/Timeline";

export default function AboutPage() {
  return (
    <>
      <section className="px-15 pt-25 pb-20">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-8">
          About
        </div>
        <h1 className="text-[64px] font-light text-ink leading-[1.15] tracking-[-0.01em] mb-7">
          About <span className="text-accent font-semibold">me</span>.
        </h1>
        <p className="text-[24px] font-medium text-lead leading-[1.6] max-w-[620px] mb-9">
          I&apos;m a student pursuing dual degrees in{" "}
          <span className="text-accent font-medium">software engineering</span>{" "}
          and{" "}
          <span className="text-accent font-medium">
            business administration
          </span>{" "}
          at Nanjing University. My interests span{" "}
          <span className="text-accent font-medium">
            quantitative analysis
          </span>
          ,{" "}
          <span className="text-accent font-medium">
            AI product management
          </span>
          , and{" "}
          <span className="text-accent font-medium">
            algorithm research
          </span>{" "}
          — building at the intersection of technology and strategy.
        </p>
      </section>

      <section className="px-15 py-18 border-t border-line">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-8">
          Skills
        </div>
        <div className="flex flex-wrap gap-3.5">
          {[
            "#python",
            "#fastapi",
            "#ai",
            "#quantitative",
            "#product-management",
            "#algorithm",
            "#html",
            "#css",
            "#javascript",
            "#git",
          ].map((tag) => (
            <span
              key={tag}
              className="text-[20px] font-normal text-body hover:text-accent transition-colors cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="px-15 py-18 border-t border-line">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-8">
          Timeline
        </div>
        <Timeline />
      </section>

      <section className="px-15 py-18 border-t border-line">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-8">
          Education
        </div>
        <div>
          <h3 className="text-[30px] font-semibold text-ink mb-2.5">
            Nanjing University
          </h3>
          <p className="text-[22px] font-medium text-lead leading-[1.6]">
            Dual degree in Software Engineering &amp; Business Administration
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
