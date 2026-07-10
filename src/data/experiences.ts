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
      "Started dual degree in Software Engineering (Business Innovation Class) at Xingzhi College. GPA 4.57/5.0, ranked 1st of 42 in major.",
    tags: ["#nj", "#software-engineering", "#business", "#gpa-4.57"],
  },
  {
    date: "2025.09",
    title: "Online Teaching Volunteer",
    description:
      "Core volunteer for rural children education programs. Designed and taught math thinking and programming enlightenment courses. 30+ teaching hours, 83.2 total volunteer hours.",
    tags: ["#volunteer", "#teaching", "#programming-enlightenment"],
  },
  {
    date: "2025.10",
    title: "Student Career Development Association",
    description:
      "Joined the Industry Research Department. Contributed to industry research reports and enterprise research. Organized multiple university-level career sharing events.",
    tags: ["#career", "#industry-research", "#student-work"],
  },
  {
    date: "2025.11",
    title: "Military Training Advanced Individual",
    description:
      "Awarded \"Advanced Individual in Military Training\" by Nanjing University.",
    tags: ["#award", "#military-training"],
  },
  {
    date: "2025.12",
    title: "Business Case Analysis Competition — Top 10 Team",
    description:
      "Core member of the \"Top 10 Team\" at the 5th Business School Management Case Analysis Competition. Led industry data collection and logic framework construction.",
    tags: ["#competition", "#business-analysis", "#top-10"],
  },
  {
    date: "2026.01",
    title: "Research: LLM-assisted Formal Program Analysis",
    description:
      "Joined Prof. Wang Ke's early research project. Focus on LLM + formal program analysis intersection — using mathematical logic to predict code risks (array bounds, etc.) without running programs. Designed LLM-driven full-chain repair flow: problem reproduction → code slicing → patch generation → verification.",
    tags: ["#research", "#llm", "#program-analysis", "#tree-sitter"],
  },
  {
    date: "2026.01 - 02",
    title: "Nanxing Dream Plan — Wenzhou Team Captain",
    description:
      "Led the winter social practice team to visit Wenzhou Middle School for university recruitment talks. Covered 200+ high school students. Awarded \"Excellent Volunteer\".",
    tags: ["#social-practice", "#team-lead", "#excellent-volunteer"],
  },
  {
    date: "2026",
    title: "Hengyang Logistics Scholarship & Outstanding Student",
    description:
      "Awarded the Hengyang Logistics Scholarship and Outstanding Student of NJU Freshman College.",
    tags: ["#scholarship", "#outstanding-student"],
  },
  {
    date: "2026.07",
    title: "Personal Portfolio Website",
    description:
      "Designed and built a minimalist portfolio with Next.js, React, and Tailwind CSS — featuring dark mode, typing animation, and experience timeline.",
    tags: ["#nextjs", "#react", "#tailwind"],
  },
];
