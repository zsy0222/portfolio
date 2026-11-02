import GiscusComments from "@/components/GiscusComments";
import Footer from "@/components/Footer";

export default function GuestbookPage() {
  return (
    <>
      <section className="ui-enter px-6 pb-14 pt-16 sm:px-10 sm:pb-18 sm:pt-20 xl:px-15 xl:pt-25">
        <div className="mb-6 text-[15px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[18px]">
          Guestbook
        </div>
        <h1 className="max-w-[820px] text-pretty text-[42px] font-light leading-[1.08] tracking-[-0.02em] text-ink sm:text-[56px] xl:text-[68px]">
          Leave a <span className="text-accent font-semibold">message</span>.
        </h1>
        <p className="mt-6 max-w-[680px] text-pretty text-[19px] font-medium leading-[1.7] text-lead sm:text-[22px] xl:text-[24px]">
          Thoughts, feedback, or just say hi. Comments are powered by GitHub
          Discussions via Giscus.
        </p>
      </section>

      <section className="max-w-[900px] border-t border-line px-6 py-12 sm:px-10 sm:py-14 xl:px-15">
        <GiscusComments />
      </section>

      <Footer />
    </>
  );
}
