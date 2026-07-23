export const revalidate = 300;
export const runtime = "nodejs";
import { hasDb, tursoQuery, allRows } from "@/lib/turso";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (!hasDb()) return NextResponse.json([]);

  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");

  try {
    let sql = `
      SELECT wp.id, wp.slug, wp.title, wp.section_id as sectionId,
             wp.tags, wp.is_draft as isDraft, wp.view_count as viewCount,
             wp.created_at as createdAt, wp.updated_at as updatedAt,
             ws.name as sectionName, ws.slug as sectionSlug
      FROM wiki_pages wp
      LEFT JOIN wiki_sections ws ON wp.section_id = ws.id
      WHERE wp.is_draft = 0
    `;
    if (section) {
      sql += ` AND ws.slug = ?`;
      const r = await tursoQuery(sql + " ORDER BY wp.created_at", [{ type: "text", value: section }]);
      return NextResponse.json(allRows(r));
    }
    const r = await tursoQuery(sql + " ORDER BY wp.created_at");
    return NextResponse.json(allRows(r));
  } catch {
    return NextResponse.json([]);
  }
}
