import Footer from "@/components/Footer";
import Timeline from "@/components/Timeline";

const skills = [
  "#java",
  "#c",
  "#python",
  "#full-stack",
  "#git",
  "#tree-sitter",
  "#program-slicing",
  "#llm-api",
  "#business-analysis",
  "#quantitative",
  "#product-management",
];

const awards = [
  { date: "2026.06", title: "Hengyang Logistics Scholarship" },
  { date: "2026.05", title: "Outstanding Student, NJU Freshman College" },
  { date: "2026.03", title: "Excellent Volunteer — Nanxing Dream Plan" },
  { date: "2025.12", title: "Top 10 Team — Business Case Analysis Competition" },
  { date: "2025.12", title: "Backbone Star — Career Development Association" },
  { date: "2025.11", title: "Military Training Advanced Individual" },
];

const sectionClasses =
  "border-t border-line px-6 py-12 sm:px-10 sm:py-14 xl:px-15 xl:py-18";
const sectionLabelClasses =
  "mb-7 text-[15px] font-semibold uppercase tracking-[0.16em] text-muted sm:mb-8 sm:text-[18px]";

export default function AboutPage() {
  return (
    <>
      <section className="ui-enter px-6 pb-14 pt-16 sm:px-10 sm:pb-18 sm:pt-20 xl:px-15 xl:pb-20 xl:pt-25">
        <div className="mb-6 text-[15px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[18px]">
          About
        </div>
        <h1 className="max-w-[900px] text-pretty text-[42px] font-light leading-[1.08] tracking-[-0.02em] text-ink sm:text-[56px] xl:text-[68px]">
          About <span className="font-semibold text-accent">me</span>.
        </h1>
        <p className="mt-6 max-w-[760px] text-pretty text-[19px] font-medium leading-[1.7] text-lead sm:text-[22px] xl:text-[24px]">
          I&apos;m a student pursuing dual degrees in{" "}
          <span className="font-medium text-accent">software engineering</span>{" "}
          and{" "}
          <span className="font-medium text-accent">
            business administration
          </span>{" "}
          at Nanjing University. My interests span{" "}
          <span className="font-medium text-accent">
            quantitative analysis
          </span>
          ,{" "}
          <span className="font-medium text-accent">
            AI product management
          </span>
          , and{" "}
          <span className="font-medium text-accent">algorithm research</span>{" "}
          — building at the intersection of technology and strategy.
        </p>
      </section>

      <section className={sectionClasses}>
        <div className={sectionLabelClasses}>Education</div>
        <div className="max-w-[820px]">
          <time className="text-[14px] font-semibold uppercase tracking-[0.14em] text-muted sm:text-[16px]">
            2025 — Present
          </time>
          <h2 className="mt-2 text-pretty text-[27px] font-semibold text-ink sm:text-[30px]">
            Nanjing University
          </h2>
          <p className="mt-2.5 text-pretty text-[18px] font-medium leading-[1.65] text-lead sm:text-[22px]">
            Dual degree in Software Engineering &amp; Business Administration
            (Business Innovation Class), Business School
          </p>
        </div>
      </section>

      <section className={sectionClasses}>
        <div className={sectionLabelClasses}>Skills</div>
        <div className="flex max-w-[900px] flex-wrap gap-x-4 gap-y-2.5">
          {skills.map((tag) => (
            <span
              key={tag}
              className="cursor-default text-[17px] font-normal text-body transition-colors hover:text-accent sm:text-[20px]"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className={sectionClasses}>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3 sm:mb-8">
          <div className="text-[15px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[18px]">
            Awards
          </div>
          <div className="text-[14px] text-muted sm:text-[15px]">
            Newest first
          </div>
        </div>
        <ol className="max-w-[900px] divide-y divide-line">
          {awards.map((award) => (
            <li
              key={`${award.date}-${award.title}`}
              className="grid gap-1 py-4 first:pt-0 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-5 sm:py-5"
            >
              <time className="font-mono text-[14px] font-medium tabular-nums text-muted sm:text-[16px]">
                {award.date}
              </time>
              <span className="text-pretty text-[18px] font-medium leading-[1.55] text-lead sm:text-[21px]">
                {award.title}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className={sectionClasses}>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3 sm:mb-8">
          <div className="text-[15px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[18px]">
            Timeline
          </div>
          <div className="text-[14px] text-muted sm:text-[15px]">
            Newest first
          </div>
        </div>
        <Timeline />
      </section>

      <Footer />
    </>
  );
}
