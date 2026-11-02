import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { creativeWorks, getWorkBySlug } from "@/data/world";
import LabDetail from "@/components/world/LabDetail";

export function generateStaticParams() {
  return creativeWorks.map((work) => ({ slug: work.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const work = getWorkBySlug((await params).slug);
  return work ? { title: `${work.title.zh} — Chenmu`, description: work.summary.zh, alternates: { canonical: `/lab/${work.slug}` } } : {};
}
export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const work = getWorkBySlug((await params).slug);
  if (!work) notFound();
  return <LabDetail work={work} />;
}
