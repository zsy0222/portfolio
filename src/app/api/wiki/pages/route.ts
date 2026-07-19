export const runtime = "nodejs";
import { db } from "@/db/config";
import { wikiPages, wikiSections } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (!process.env.TURSO_DB_URL) return NextResponse.json([]);

  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");

  const conditions = [eq(wikiPages.isDraft, false)];
  if (section) {
    conditions.push(eq(wikiSections.slug, section));
  }

  const pages = await db
    .select({
      id: wikiPages.id,
      slug: wikiPages.slug,
      title: wikiPages.title,
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
    .where(and(...conditions))
    .orderBy(wikiPages.createdAt);

  return NextResponse.json(pages);
}
