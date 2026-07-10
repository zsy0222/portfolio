import Link from "next/link";

export default function Hero() {
  return (
    <section className="px-15 pt-25 pb-20">
      <div className="flex items-center gap-15">
        <div className="flex-1">
          <h1 className="text-[64px] font-light text-ink leading-[1.15] tracking-[-0.01em] mb-7">
            Building at the
            <br />
            intersection of <span className="text-accent font-semibold">AI</span>,
            <span className="text-accent font-semibold"> quantitative</span>{" "}
            &amp; <span className="text-accent font-semibold">product</span>.
          </h1>
          <p className="text-[24px] font-medium text-lead leading-[1.6] max-w-[520px] mb-9">
            A student from the Software Engineering Business Class at Nanjing
            University, exploring quantitative analysis, AI product
            management, and algorithm design.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[22px] font-medium text-ink border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            View Work <span>&rarr;</span>
          </Link>
        </div>
        <div className="w-[140px] h-[140px] rounded-full bg-card border border-line shrink-0 flex items-center justify-center overflow-hidden">
          <img
            src="/images/1fb9c4aafdb8974d3eda5d2c039aec06.jpg"
            alt="Siyuan Zheng"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
