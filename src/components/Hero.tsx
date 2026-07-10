import Link from "next/link";

export default function Hero() {
  return (
    <section className="px-15 pt-25 pb-20">
      <div className="flex items-center gap-15">
        <div className="flex-1">
          <h1 className="text-[56px] font-light text-ink leading-[1.15] tracking-[-0.01em] mb-7">
            Crafting products
            <br />
            with <span className="text-accent font-semibold">warmth</span>{" "}
            &amp; intent.
          </h1>
          <p className="text-lg font-medium text-lead max-w-[480px] mb-9">
            Designer-developer building thoughtful interfaces at the
            intersection of engineering and human experience. Currently
            exploring AI-assisted creative tools.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-base font-medium text-ink border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            View Work <span>&rarr;</span>
          </Link>
        </div>
        <div className="w-[140px] h-[140px] rounded-full bg-card border border-line shrink-0 flex items-center justify-center text-xs text-muted tracking-[0.1em]">
          AVATAR
        </div>
      </div>
    </section>
  );
}
