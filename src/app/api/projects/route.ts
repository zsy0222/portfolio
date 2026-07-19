export const runtime = "nodejs";
import { hasDb, tursoQuery, allRows } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET() {
  if (!hasDb()) return NextResponse.json([]);

  try {
    const r = await tursoQuery("SELECT id, slug, title, description, tags, live_url as liveUrl, repo_url as repoUrl, sort_order as sortOrder, created_at as createdAt FROM projects ORDER BY sort_order");
    return NextResponse.json(allRows(r));
  } catch {
    return NextResponse.json([]);
  }
}
