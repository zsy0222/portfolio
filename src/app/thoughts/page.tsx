import type { Metadata } from "next";
import { ThoughtsArchive } from "@/components/world/ArchivePages";
import { getAllPosts } from "@/lib/blog";
export const metadata: Metadata = { title: "Thoughts & Dreams | Chenmu", description: "关于记忆、梦境、创造力和个人成长的思想档案。Notes on memory, dreams, creativity and growing up." };
export default function Page() { return <ThoughtsArchive posts={getAllPosts()} />; }
