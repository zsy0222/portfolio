import { NextRequest, NextResponse } from "next/server";
import { hasStatusAccess, statusCookie } from "@/lib/status-access";
import { hasDb } from "@/lib/turso";
import { readVisitorStats } from "@/lib/visitor-stats";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };

export async function GET(request: NextRequest) {
  if (!hasStatusAccess(request.cookies.get(statusCookie)?.value)) {
    return NextResponse.json({ ok: false }, { status: 401, headers });
  }
  try {
    if (!hasDb()) throw new Error("Database unavailable");
    return NextResponse.json(await readVisitorStats(), { headers });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503, headers });
  }
}
