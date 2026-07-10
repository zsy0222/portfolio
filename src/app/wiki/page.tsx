import Footer from "@/components/Footer";

export default function WikiPage() {
  return (
    <>
      <section className="px-15 pt-25 pb-20">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          Wiki
        </div>
        <h1 className="text-[64px] font-light text-ink leading-[1.15] tracking-[-0.01em] mb-5" style={{ textWrap: "balance" }}>
          Knowledge <span className="text-accent font-semibold">base</span>.
        </h1>
        <p className="text-[24px] font-medium text-lead leading-[1.6] max-w-[520px] mb-9">
          A personal wiki for concepts, snippets, references, and decisions — coming soon.
        </p>
        <div className="text-[20px] font-normal text-muted">
          Step #9 in the roadmap. Stay tuned.
        </div>
      </section>
      <Footer />
    </>
  );
}
