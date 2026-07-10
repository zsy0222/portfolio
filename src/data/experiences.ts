export interface Experience {
  date: string;
  title: string;
  description: string;
  tags?: string[];
  link?: string;
}

export const experiences: Experience[] = [
  {
    date: "2024.09",
    title: "Enrolled at Nanjing University",
    description:
      "Started dual degree program in Software Engineering & Business Administration.",
    tags: ["#nj", "#software-engineering", "#business"],
  },
  {
    date: "2025",
    title: "Campus Recycling Tracker (LC_project)",
    description:
      "Built an AI-powered recycling tracking system with visual recognition, batch management, and anti-cheating mechanisms for campus sustainability.",
    tags: ["#python", "#fastapi", "#ai"],
    link: "https://github.com/zsy0222/LC_project",
  },
  {
    date: "2026",
    title: "Hybrid Slicing for Fault Localization",
    description:
      "Research on a two-phase hybrid slice framework using assertions as decision points — combining dynamic backward tracing with static forward path validation.",
    tags: ["#research", "#fault-localization", "#program-slicing"],
  },
  {
    date: "2026.07",
    title: "Personal Portfolio Website",
    description:
      "Designed and built a minimalist portfolio with Next.js, React, and Tailwind CSS.",
    tags: ["#nextjs", "#react", "#tailwind"],
  },
  {
    date: "Future",
    title: "Exploring Next Steps",
    description:
      "Quantitative analysis, AI product management, and algorithm research — building at the intersection of technology and strategy.",
    tags: ["#quantitative", "#ai-pm", "#algorithm"],
  },
];
