import type { Metadata } from "next";
import GlobalSearch from "@/components/world/GlobalSearch";
import { parseWorldSearchType, searchPublicWorld } from "@/lib/world-search";

export const metadata: Metadata = {
  title: "Search · 搜索 — Chenmu",
  description: "Search Chenmu's projects, public writing and travel memories.",
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: {
  searchParams: Promise<{ q?: string | string[]; type?: string | string[] }>;
}) {
  const params = await searchParams;
  const query = (typeof params.q === "string" ? params.q : "").slice(0, 160);
  const type = parseWorldSearchType(typeof params.type === "string" ? params.type : undefined);
  let initialResponse;
  try {
    initialResponse = searchPublicWorld(query, type);
  } catch {
    // The client can retry; a transient index failure must not hide navigation.
  }
  return <GlobalSearch initialQuery={query} initialType={type} initialResponse={initialResponse} />;
}
