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
      "A two-phase hybrid slice framework using assertions as decision points for software fault localization — combining dynamic backward tracing with static forward path validation.",
    tags: ["#research", "#fault-localization", "#program-slicing"],
  },
];
