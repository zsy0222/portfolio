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
    id: "aurora-notes",
    title: "Aurora Notes",
    description:
      "A minimalist note app with local-first sync and keyboard-driven navigation.",
    tags: ["#react", "#local-first", "#design"],
  },
  {
    id: "trace",
    title: "Trace",
    description:
      "Interactive timeline visualizer for research projects, built on a custom graph engine.",
    tags: ["#typescript", "#dataviz", "#canvas"],
  },
  {
    id: "loom",
    title: "Loom",
    description:
      "An AI-assisted writing companion that turns rough notes into structured drafts.",
    tags: ["#llm", "#nextjs", "#ux"],
  },
  {
    id: "quiet-hours",
    title: "Quiet Hours",
    description:
      "A focus timer that respects your rhythm — ambient soundscapes and gentle nudges.",
    tags: ["#pwa", "#audio", "#minimal"],
  },
];
