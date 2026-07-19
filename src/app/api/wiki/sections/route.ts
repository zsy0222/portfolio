import { db } from "@/db/config";
import { wikiSections, wikiPages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const sections = await db.select().from(wikiSections).orderBy(wikiSections.sortOrder);

  // Count pages per section
  const result = await Promise.all(
    sections.map(async (s) => {
      const pages = await db
        .select()
        .from(wikiPages)
        .where(eq(wikiPages.sectionId, s.id));
      return { ...s, pageCount: pages.length };
    })
  );

  return NextResponse.json(result);
}
