export const runtime = "nodejs";

import { hasDb, tursoQuery, firstValue } from "@/lib/turso";
import { NextRequest, NextResponse } from "next/server";
import { issueStatusAccess, matchesReportCode, statusCookie, statusCookiePath, statusSessionSeconds } from "@/lib/status-access";

const headers = { "Cache-Control": "no-store" };

export async function POST(request: NextRequest) {
  if (!hasDb()) return NextResponse.json({ ok: false }, { status: 503, headers });

  try {
    const { password, scope } = await request.json();
    if ((scope === "status" || scope === "visitor-report") && matchesReportCode(password)) {
      const access = issueStatusAccess();
      if (!access) return NextResponse.json({ ok: false }, { status: 503, headers });
      const response = NextResponse.json({ ok: true, reportAccess: true }, { headers });
      response.cookies.set(statusCookie, access, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: statusCookiePath,
        maxAge: statusSessionSeconds,
      });
      return response;
    }
    if (scope === "visitor-report") return NextResponse.json({ ok: false }, { headers });
    const result = await tursoQuery(
      "SELECT value FROM site_settings WHERE key = ? LIMIT 1",
      [{ type: "text", value: "wiki_password" }]
    );
    const stored = firstValue(result);
    return NextResponse.json({ ok: stored !== "" && stored === password }, { headers });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503, headers });
  }
}
