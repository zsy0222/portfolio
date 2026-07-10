import Link from "next/link";
import { experiences } from "@/data/experiences";

export default function Timeline() {
  return (
    <div className="flex flex-col">
      {experiences.map((exp, index) => (
        <div key={index} className="flex gap-8">
          <div className="flex flex-col items-center">
            <div className="w-[10px] h-[10px] rounded-full bg-accent shrink-0 mt-3" />
            {index < experiences.length - 1 && (
              <div className="w-px flex-1 bg-line min-h-[60px]" />
            )}
          </div>
          <div className={`flex-1 ${index < experiences.length - 1 ? "pb-12" : ""}`}>
            <div className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted mb-2">
              {exp.date}
            </div>
            {exp.link ? (
              <Link href={exp.link} target="_blank" rel="noopener noreferrer">
                <h3 className="text-[26px] font-semibold text-ink mb-2.5 hover:text-accent transition-colors">
                  {exp.title}
                </h3>
              </Link>
            ) : (
              <h3 className="text-[26px] font-semibold text-ink mb-2.5">
                {exp.title}
              </h3>
            )}
            <p className="text-[20px] font-medium text-lead leading-[1.6] max-w-[800px] mb-4">
              {exp.description}
            </p>
            {exp.tags && (
              <div className="flex flex-wrap gap-3">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[18px] font-normal text-body hover:text-accent transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
