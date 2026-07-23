export const revalidate = 3600;
export const runtime = "nodejs";
import { hasDb, tursoQuery, allRows } from "@/lib/turso";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!hasDb()) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { slug } = await params;

  try {
    const r = await tursoQuery(
      `SELECT wp.id, wp.slug, wp.title, wp.content,
              wp.section_id as sectionId, wp.tags,
              wp.is_draft as isDraft, wp.view_count as viewCount,
              wp.created_at as createdAt, wp.updated_at as updatedAt,
              ws.name as sectionName, ws.slug as sectionSlug
       FROM wiki_pages wp
       LEFT JOIN wiki_sections ws ON wp.section_id = ws.id
       WHERE wp.slug = ? AND wp.is_draft = 0
       LIMIT 1`,
      [{ type: "text", value: slug }]
    );
    const rows = allRows(r);
    if (rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
