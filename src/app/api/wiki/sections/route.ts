export const runtime = "nodejs";
import { hasDb, tursoQuery, allRows } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET() {
  if (!hasDb()) return NextResponse.json([]);

  try {
    const sections = await tursoQuery("SELECT * FROM wiki_sections ORDER BY sort_order");
    const secs = allRows(sections);

    // Count pages per section
    const result = await Promise.all(
      secs.map(async (s) => {
        const r = await tursoQuery("SELECT count(*) as c FROM wiki_pages WHERE section_id = ?", [
          { type: "integer", value: s.id },
        ]);
        const rows = r.results[0]?.response?.result?.rows ?? [];
        const pageCount = Number(rows[0]?.[0]?.value) || 0;
        return { ...s, pageCount };
      })
    );

    return NextResponse.json(result);
  } catch {
    return NextResponse.json([]);
  }
}
