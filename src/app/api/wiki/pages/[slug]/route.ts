import { db } from "@/db/config";
import { wikiPages, wikiSections } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const results = await db
    .select({
      id: wikiPages.id,
      slug: wikiPages.slug,
      title: wikiPages.title,
      content: wikiPages.content,
      sectionId: wikiPages.sectionId,
      tags: wikiPages.tags,
      isDraft: wikiPages.isDraft,
      viewCount: wikiPages.viewCount,
      createdAt: wikiPages.createdAt,
      updatedAt: wikiPages.updatedAt,
      sectionName: wikiSections.name,
      sectionSlug: wikiSections.slug,
    })
    .from(wikiPages)
    .leftJoin(wikiSections, eq(wikiPages.sectionId, wikiSections.id))
    .where(and(eq(wikiPages.slug, slug), eq(wikiPages.isDraft, false)))
    .limit(1);

  if (results.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(results[0]);
}
