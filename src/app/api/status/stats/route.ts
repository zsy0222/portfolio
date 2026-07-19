export const runtime = "nodejs";
import { hasDb, tursoQuery, firstValue } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET() {
  if (!hasDb()) {
    return NextResponse.json({ wikiSections: 0, wikiPages: 0, blogPosts: 0, projects: 0 });
  }

  try {
    const [r1, r2, r3, r4] = await Promise.all([
      tursoQuery("SELECT count(*) as c FROM wiki_sections"),
      tursoQuery("SELECT count(*) as c FROM wiki_pages WHERE is_draft = 0"),
      tursoQuery("SELECT count(*) as c FROM blog_posts WHERE is_draft = 0"),
      tursoQuery("SELECT count(*) as c FROM projects"),
    ]);

    return NextResponse.json({
      wikiSections: Number(firstValue(r1)) || 0,
      wikiPages: Number(firstValue(r2)) || 0,
      blogPosts: Number(firstValue(r3)) || 0,
      projects: Number(firstValue(r4)) || 0,
    });
  } catch {
    return NextResponse.json({ wikiSections: 0, wikiPages: 0, blogPosts: 0, projects: 0 });
  }
}
