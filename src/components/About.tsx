export default function About() {
  return (
    <section className="px-15 py-18 border-t border-line">
      <div className="text-sm font-medium tracking-[0.16em] uppercase text-muted mb-8">
        About
      </div>
      <p className="text-lg font-medium text-lead max-w-[620px] mb-6">
        I build software that feels{" "}
        <span className="text-accent font-medium">considered</span> — where
        every interaction has a reason and every detail earns its place. My
        work lives between{" "}
        <span className="text-accent font-medium">engineering</span> and{" "}
        <span className="text-accent font-medium">design</span>.
      </p>
      <div className="flex flex-wrap gap-3.5">
        {[
          "#typescript",
          "#react",
          "#nextjs",
          "#design-systems",
          "#interaction",
          "#ai-tools",
        ].map((tag) => (
          <span
            key={tag}
            className="text-sm font-normal text-body hover:text-accent transition-colors cursor-default"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
