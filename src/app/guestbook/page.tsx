import GiscusComments from "@/components/GiscusComments";
import Footer from "@/components/Footer";

export default function GuestbookPage() {
  return (
    <>
      <section className="px-15 pt-25 pb-16">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          Guestbook
        </div>
        <h1 className="text-[56px] font-light text-ink leading-[1.2] mb-5" style={{ textWrap: "balance" }}>
          Leave a <span className="text-accent font-semibold">message</span>.
        </h1>
        <p className="text-[24px] font-medium text-lead leading-[1.6] max-w-[520px]">
          Thoughts, feedback, or just say hi. Comments are powered by GitHub
          Discussions via Giscus.
        </p>
      </section>

      <section className="px-15 py-14 border-t border-line max-w-[800px]">
        <GiscusComments />
      </section>

      <Footer />
    </>
  );
}
