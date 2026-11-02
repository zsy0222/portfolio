import type { Metadata } from "next";
import { LearningArchive } from "@/components/world/ArchivePages";
import { getAllPosts } from "@/lib/blog";
export const metadata: Metadata = { title: "Learning & Research | Chenmu", description: "软件工程、人工智能、形式化程序分析与商业创新的学习档案。A growing library of learning and research." };
export default function Page() { return <LearningArchive posts={getAllPosts()} />; }
