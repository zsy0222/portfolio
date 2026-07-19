export const runtime = "nodejs";
import { hasDb, tursoQuery, firstValue } from "@/lib/turso";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (!hasDb()) return NextResponse.json({ ok: false }, { status: 503 });

  try {
    const { password } = await request.json();
    const r = await tursoQuery(
      "SELECT value FROM site_settings WHERE key = ? LIMIT 1",
      [{ type: "text", value: "wiki_password" }]
    );
    const stored = firstValue(r);
    return NextResponse.json({ ok: stored === password });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
