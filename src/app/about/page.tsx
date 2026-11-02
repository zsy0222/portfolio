import type { Metadata } from "next";
import { AboutArchive } from "@/components/world/ArchivePages";
export const metadata: Metadata = { title: "About Chenmu — Siyuan Zheng", description: "南京大学软件工程与商业创新方向学生。Software Engineering × Business Innovation at Nanjing University." };
export default function AboutPage() { return <AboutArchive />; }
