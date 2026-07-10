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
      "Started dual degree in Software Engineering (Business Innovation Class) at Xingzhi College. Built a cross-disciplinary foundation spanning algorithms, data structures, microeconomics, and political economics — 9 courses scored 90+ in the first semester.",
    tags: ["#nj", "#software-engineering", "#business"],
  },
  {
    date: "2025.09 - 2026.02",
    title: "Online Teaching Volunteer",
    description:
      "Core volunteer across two rural education programs (Shanyu Weilai & Nanyue Xuetang). Designed and delivered original curricula for math thinking and programming enlightenment to village children during first semester and winter break.",
    tags: ["#volunteer", "#teaching", "#programming-enlightenment"],
  },
  {
    date: "2025.10",
    title: "Student Career Development Association",
    description:
      "Joined the Industry Research Department. Contributed to industry research reports, conducted enterprise research, and organized multiple university-level career sharing events. Awarded \"Backbone Star\" for outstanding contributions.",
    tags: ["#career", "#industry-research", "#backbone-star"],
  },
  {
    date: "2025.11 - 12",
    title: "Awards & Competitions",
    description:
      "Awarded \"Advanced Individual in Military Training\" by NJU. Led industry data collection and logic framework as core member of the \"Top 10 Team\" at the 5th Business School Management Case Analysis Competition, delivering a 10,000-word analysis report and live defense.",
    tags: ["#military-training", "#business-analysis", "#top-10"],
  },
  {
    date: "2026.01 - 02",
    title: "Nanxing Dream Plan — Wenzhou Team Captain",
    description:
      "Led the winter social practice team back to Wenzhou Middle School for university recruitment talks. Coordinated team logistics, delivered presentations, and shared academic experiences with prospective students. Awarded \"Excellent Volunteer\".",
    tags: ["#social-practice", "#team-lead", "#excellent-volunteer"],
  },
  {
    date: "2026.03",
    title: "Research: LLM-assisted Formal Program Analysis",
    description:
      "Joined Prof. Wang Ke's early research project: \"LLM-assisted Formal Program Analysis: Letting AI Learn to Understand, Verify, and Improve Software\". Investigating program slicing techniques to address AI-generated code correctness — exploring Chop slicing over traditional PDG backward slicing, and designing an LLM-driven repair flow: problem reproduction, code slicing, patch generation, and verification. Built on Tree-sitter for code structure parsing.",
    tags: ["#research", "#llm", "#program-slicing", "#tree-sitter"],
    link: "https://github.com/zsy0222/program-slicing",
  },
  {
    date: "2026.05 - 06",
    title: "Scholarships & Honors",
    description:
      "Awarded Outstanding Student of NJU Freshman College (May) and the Hengyang Logistics Scholarship at Xingzhi College (June) — recognizing academic excellence, comprehensive development, and volunteer commitment across the first year.",
    tags: ["#outstanding-student", "#hengyang-scholarship"],
  },
  {
    date: "2026.06",
    title: "Campus Recycling Tracker (LC_project)",
    description:
      "Built an AI-powered recycling tracking system for campus sustainability — featuring MobileNetV3 visual recognition for waste classification, batch management by location/date/category, GPS-based anti-cheating, and image deduplication via perceptual hashing. Full-stack with FastAPI backend and native HTML/CSS/JS SPA frontend.",
    tags: ["#python", "#fastapi", "#ai", "#full-stack"],
    link: "https://github.com/zsy0222/LC_project",
  },
  {
    date: "2026.07",
    title: "Personal Portfolio Website",
    description:
      "Designed and built a minimalist portfolio with Next.js, React, and Tailwind CSS v4 — featuring dark mode with localStorage persistence, typing animation on the hero title, experience timeline, WeChat click-to-copy, and a contact form. Deployed on Vercel.",
    tags: ["#nextjs", "#react", "#tailwind"],
  },
];
