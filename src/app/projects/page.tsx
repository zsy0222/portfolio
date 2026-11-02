import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ProjectArchive from "@/components/world/ProjectArchive";

export const metadata: Metadata = {
  title: "Projects & Engineering — Chenmu",
  description: "Six original projects in program analysis, quantitative finance, frontier technology, industry research and sustainable product development.",
};

export default function ProjectsPage() {
  return <><ProjectArchive /><Footer /></>;
}
