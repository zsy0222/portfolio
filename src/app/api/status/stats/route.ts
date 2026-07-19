export const runtime = "nodejs";
import { NextResponse } from "next/server";

async function tursoQuery(sql: string, params: unknown[] = []) {
  const res = await fetch(`${process.env.TURSO_DB_URL}/v2/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TURSO_AUTH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        { type: "execute", stmt: params.length ? { sql, args: params.map((p) => ({ type: typeof p === "number" ? "integer" : "text", value: String(p) })) } : { sql } },
        { type: "close" },
      ],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Turso ${res.status}: ${text}`);
  }
  return res.json();
}

export async function GET() {
  if (!process.env.TURSO_DB_URL || !process.env.TURSO_AUTH_TOKEN) {
    return NextResponse.json({ error: "Env vars missing" }, { status: 500 });
  }

  try {
    // Test 1: raw SELECT
    const r1 = await tursoQuery("SELECT 1 as test");
    // Test 2: list tables
    const r2 = await tursoQuery("SELECT name FROM sqlite_master WHERE type='table'");

    return NextResponse.json({
      testRows: r1.results[0]?.response?.result?.rows,
      tableRows: r2.results[0]?.response?.result?.rows,
      raw: JSON.stringify(r2).substring(0, 500),
    });
  } catch (e: unknown) {
    const err = e as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
