import Link from "next/link";
import { experiences } from "@/data/experiences";

export default function Timeline() {
  return (
    <ol className="flex flex-col">
      {experiences.map((exp, index) => (
        <li key={`${exp.date}-${exp.title}`} className="flex gap-4 sm:gap-8">
          <div className="flex flex-col items-center">
            <div
              className="mt-2.5 size-[10px] shrink-0 rounded-full bg-accent"
              aria-hidden="true"
            />
            {index < experiences.length - 1 && (
              <div
                className="min-h-[60px] w-px flex-1 bg-line"
                aria-hidden="true"
              />
            )}
          </div>
          <div
            className={`min-w-0 flex-1 ${index < experiences.length - 1 ? "pb-10 sm:pb-12" : ""}`}
          >
            <div className="mb-2 text-[14px] font-semibold uppercase tracking-[0.14em] text-muted sm:text-[16px]">
              {exp.date}
            </div>
            {exp.link ? (
              <Link
                href={exp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
              >
                <h3 className="mb-2.5 text-pretty text-[23px] font-semibold leading-[1.25] text-ink transition-colors group-hover:text-accent sm:text-[26px]">
                  {exp.title}
                </h3>
              </Link>
            ) : (
              <h3 className="mb-2.5 text-pretty text-[23px] font-semibold leading-[1.25] text-ink sm:text-[26px]">
                {exp.title}
              </h3>
            )}
            <p className="mb-4 max-w-[800px] text-pretty text-[17px] font-medium leading-[1.65] text-lead sm:text-[20px]">
              {exp.description}
            </p>
            {exp.tags && (
              <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="cursor-default text-[15px] font-normal text-body transition-colors hover:text-accent sm:text-[18px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
