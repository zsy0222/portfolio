import type { Metadata } from "next";
import { MemoriesIndex } from "@/components/world/ArchivePages";
export const metadata: Metadata = { title: "Travel Memories | Chenmu", description: "旅行记忆博物馆：真实影像、个人故事，与值得保留的瞬间。Original photographs and personal stories." };
export default function Page() { return <MemoriesIndex />; }
