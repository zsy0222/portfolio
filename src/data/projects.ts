export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
}

export const projects: Project[] = [
  {
    id: "campus-recycling-tracker",
    title: "Campus Recycling Tracker",
    description:
      "AI-powered recycling tracking system with visual recognition, batch management, and anti-cheating mechanisms for campus sustainability.",
    tags: ["#python", "#fastapi", "#ai", "#html"],
    repoUrl: "https://github.com/zsy0222/LC_project",
  },
  {
    id: "hybrid-slicing",
    title: "Hybrid Slicing for Fault Localization",
    description:
      "A two-phase hybrid slice framework using assertions as decision points — combining dynamic backward tracing with static forward path validation. Built on Tree-sitter for code structure parsing.",
    tags: ["#research", "#fault-localization", "#program-slicing", "#tree-sitter"],
    repoUrl: "https://github.com/zsy0222/program-slicing",
  },
  {
    id: "travel-memoir",
    title: "Travel Memoir",
    description:
      "A full-stack web project that inspired research into AI-assisted code repair — discovered the challenge of debugging AI-generated code, leading to automated fix workflow design.",
    tags: ["#full-stack", "#ai-coding", "#web"],
  },
];
