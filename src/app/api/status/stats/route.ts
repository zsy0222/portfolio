export const runtime = "nodejs";
import { createClient } from "@libsql/client";
import { NextResponse } from "next/server";

export async function GET() {
  if (!process.env.TURSO_DB_URL || !process.env.TURSO_AUTH_TOKEN) {
    return NextResponse.json({ error: "Env vars not set", dbUrl: !!process.env.TURSO_DB_URL, authToken: !!process.env.TURSO_AUTH_TOKEN });
  }

  try {
    const client = createClient({
      url: process.env.TURSO_DB_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    // Test 1: raw SELECT
    const r1 = await client.execute("SELECT 1 as test");
    // Test 2: list tables
    const r2 = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");

    return NextResponse.json({
      test: r1.rows,
      tables: r2.rows.map((r: { name: string }) => r.name),
      dbUrl: process.env.TURSO_DB_URL.replace(/token.*/, "..."),
    });
  } catch (e: unknown) {
    const err = e as Error;
    return NextResponse.json({
      error: err.message,
      code: (err as { code?: string }).code,
      cause: (err as { cause?: { message?: string; status?: number } }).cause?.message,
    }, { status: 500 });
  }
}
