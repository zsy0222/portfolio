export default function About() {
  return (
    <section className="border-t border-line px-6 py-12 sm:px-10 sm:py-14 xl:px-15 xl:py-18">
      <div className="mb-7 text-[15px] font-semibold uppercase tracking-[0.16em] text-muted sm:mb-8 sm:text-[18px]">
        About
      </div>
      <p className="mb-6 max-w-[720px] text-pretty text-[18px] font-medium leading-[1.7] text-lead sm:text-[21px] xl:text-[24px]">
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
      <div className="flex flex-wrap gap-x-4 gap-y-2">
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
            className="cursor-default text-[16px] font-normal text-body transition-colors hover:text-accent sm:text-[19px]"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
