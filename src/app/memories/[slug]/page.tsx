import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MemoryDetail } from "@/components/world/ArchivePages";
import { memories } from "@/data/memories";
export function generateStaticParams() { return memories.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const memory = memories.find((item) => item.slug === slug);
  return { title: memory ? `${memory.title.zh} / ${memory.title.en} | Chenmu` : "Memory not found", description: memory?.summary.zh };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const memory = memories.find((item) => item.slug === slug);
  if (!memory) notFound();
  return <MemoryDetail memory={memory} />;
}
