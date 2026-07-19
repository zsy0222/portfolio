import { db } from "@/db/config";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (!process.env.TURSO_DB_URL) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const { password } = await request.json();

  const result = await db
    .select({ value: siteSettings.value })
    .from(siteSettings)
    .where(eq(siteSettings.key, "wiki_password"))
    .limit(1);

  const stored = result[0]?.value;

  if (stored && password === stored) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false }, { status: 401 });
}
