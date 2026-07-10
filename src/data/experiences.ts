export interface Experience {
  date: string;
  title: string;
  description: string;
  tags?: string[];
  link?: string;
}

export const experiences: Experience[] = [
  {
    date: "2025.09",
    title: "Enrolled at Nanjing University",
    description:
      "Started dual degree in Software Engineering (Business Innovation Class) at Xingzhi College.",
    tags: ["#nj", "#software-engineering", "#business"],
  },
  {
    date: "2025.09 - 2026.02",
    title: "Online Teaching Volunteer",
    description:
      "Core volunteer for rural children education programs (Shanyu Weilai & Nanyue Xuetang). Designed and taught math thinking and programming enlightenment courses.",
    tags: ["#volunteer", "#teaching", "#programming-enlightenment"],
  },
  {
    date: "2025.10",
    title: "Student Career Development Association",
    description:
      "Joined the Industry Research Department. Contributed to industry research reports and enterprise research. Awarded \"Backbone Star\".",
    tags: ["#career", "#industry-research", "#backbone-star"],
  },
  {
    date: "2025.11 - 12",
    title: "Awards & Competitions",
    description:
      "Awarded \"Advanced Individual in Military Training\". Core member of the \"Top 10 Team\" at the 5th Business School Management Case Analysis Competition.",
    tags: ["#military-training", "#business-analysis", "#top-10"],
  },
  {
    date: "2026.01 - 02",
    title: "Nanxing Dream Plan — Wenzhou Team Captain",
    description:
      "Led the winter social practice team to visit Wenzhou Middle School for university recruitment talks. Awarded \"Excellent Volunteer\".",
    tags: ["#social-practice", "#team-lead", "#excellent-volunteer"],
  },
  {
    date: "2026.03",
    title: "Research: LLM-assisted Formal Program Analysis",
    description:
      "Joined Prof. Wang Ke's early research project: \"LLM-assisted Formal Program Analysis: Letting AI Learn to Understand, Verify, and Improve Software\". Focus on program slicing and LLM-driven code repair flow.",
    tags: ["#research", "#llm", "#program-slicing", "#tree-sitter"],
    link: "https://github.com/zsy0222/program-slicing",
  },
  {
    date: "2026.05 - 06",
    title: "Scholarships & Honors",
    description:
      "Awarded Outstanding Student of NJU Freshman College and the Hengyang Logistics Scholarship at Xingzhi College.",
    tags: ["#outstanding-student", "#hengyang-scholarship"],
  },
  {
    date: "2026.06",
    title: "Campus Recycling Tracker (LC_project)",
    description:
      "Built an AI-powered recycling tracking system with visual recognition, batch management, and anti-cheating mechanisms for campus sustainability.",
    tags: ["#python", "#fastapi", "#ai", "#full-stack"],
    link: "https://github.com/zsy0222/LC_project",
  },
  {
    date: "2026.07",
    title: "Personal Portfolio Website",
    description:
      "Designed and built a minimalist portfolio with Next.js, React, and Tailwind CSS — featuring dark mode, typing animation, and experience timeline.",
    tags: ["#nextjs", "#react", "#tailwind"],
  },
];
