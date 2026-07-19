export const runtime = "nodejs";
import { db } from "@/db/config";
import { wikiSections, wikiPages, blogPosts, projects } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  if (!process.env.TURSO_DB_URL) {
    return NextResponse.json({ wikiSections: 0, wikiPages: 0, blogPosts: 0, projects: 0 });
  }

  try {
    const [sectionCount, pageCount, blogCount, projectCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(wikiSections),
      db.select({ count: sql<number>`count(*)` }).from(wikiPages).where(eq(wikiPages.isDraft, false)),
      db.select({ count: sql<number>`count(*)` }).from(blogPosts).where(eq(blogPosts.isDraft, false)),
      db.select({ count: sql<number>`count(*)` }).from(projects),
    ]);

    return NextResponse.json({
      wikiSections: sectionCount[0]?.count ?? 0,
      wikiPages: pageCount[0]?.count ?? 0,
      blogPosts: blogCount[0]?.count ?? 0,
      projects: projectCount[0]?.count ?? 0,
    });
  } catch (e: unknown) {
    const err = e as Error;
    return NextResponse.json({ error: err.message, cause: (err as { cause?: { message?: string } }).cause?.message }, { status: 500 });
  }
}
