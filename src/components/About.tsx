export default function About() {
  return (
    <section className="px-15 py-18 border-t border-line">
      <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-8">
        About
      </div>
      <p className="text-[24px] font-medium text-lead leading-[1.6] max-w-[620px] mb-6">
        I&apos;m a student pursuing dual degrees in{" "}
        <span className="text-accent font-medium">software engineering</span>{" "}
        and{" "}
        <span className="text-accent font-medium">business administration</span>{" "}
        at Nanjing University. My interests span{" "}
        <span className="text-accent font-medium">quantitative analysis</span>,{" "}
        <span className="text-accent font-medium">AI product management</span>,
        and{" "}
        <span className="text-accent font-medium">algorithm research</span> —
        building at the intersection of technology and strategy.
      </p>
      <div className="flex flex-wrap gap-3.5">
        {[
          "#python",
          "#fastapi",
          "#ai",
          "#quantitative",
          "#product-management",
          "#algorithm",
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
  );
}
