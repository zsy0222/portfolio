import Link from "next/link";
import Image from "next/image";
import TypingText from "@/components/TypingText";

export default function Hero() {
  return (
    <section className="ui-enter px-6 pb-14 pt-16 sm:px-10 sm:pb-18 sm:pt-20 xl:px-15 xl:pb-20 xl:pt-25">
      <div className="flex flex-col-reverse items-start gap-8 sm:flex-row sm:items-center sm:gap-12 xl:gap-15">
        <div className="min-w-0 flex-1">
          <h1 className="mb-7 min-h-[140px] whitespace-pre-line text-pretty text-[34px] font-light leading-[1.22] tracking-[-0.02em] text-ink sm:min-h-[135px] sm:text-[40px] xl:text-[44px]">
            <TypingText
              segments={[
                { text: "Building at the intersection of\n" },
                { text: "AI", accent: true },
                { text: ", " },
                { text: "quantitative", accent: true },
                { text: " & " },
                { text: "product", accent: true },
                { text: "." },
              ]}
            />
          </h1>
          <p className="mb-9 max-w-[600px] text-pretty text-[18px] font-medium leading-[1.7] text-lead sm:text-[21px] xl:text-[24px]">
            A student from the Software Engineering Business Class at Nanjing
            University, exploring quantitative analysis, AI product
            management, and algorithm design.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-sm border-b border-ink pb-1 text-[18px] font-semibold text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg sm:text-[21px]"
            >
              View Work <span aria-hidden="true">&rarr;</span>
            </Link>
            <span
              className="inline-flex cursor-not-allowed items-center gap-2 text-[18px] font-medium text-muted opacity-50 sm:text-[21px]"
              aria-disabled="true"
            >
              Resume <span aria-hidden="true">&darr;</span>
            </span>
          </div>
        </div>
        <div className="relative flex size-[112px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-card sm:size-[132px] xl:size-[140px]">
          <Image
            src="/images/1fb9c4aafdb8974d3eda5d2c039aec06.jpg"
            alt="Siyuan Zheng"
            width={140}
            height={140}
            priority
            className="size-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
