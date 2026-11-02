import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { creativeWorks, getWorkBySlug } from "@/data/world";
import LabDetail from "@/components/world/LabDetail";

export function generateStaticParams() {
  return creativeWorks.filter((work) => work.sourceProjectId).map((work) => ({ slug: work.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const work = getWorkBySlug((await params).slug);
  return work?.sourceProjectId ? { title: `${work.title.en} — Chenmu`, description: work.summary.en, alternates: { canonical: `/lab/${work.slug}` } } : {};
}
export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const work = getWorkBySlug((await params).slug);
  if (!work?.sourceProjectId) notFound();
  return <LabDetail work={work} />;
}
