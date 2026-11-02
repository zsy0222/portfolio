import { parseWorldSearchType, searchPublicWorld } from "@/lib/world-search";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = params.get("q") ?? "";
  if (query.length > 160) {
    return Response.json({ error: "Query must be 160 characters or fewer." }, { status: 400 });
  }
  try {
    const result = searchPublicWorld(query, parseWorldSearchType(params.get("type")), params.get("lang") === "en" ? "en" : "zh");
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Search is temporarily unavailable." }, { status: 503 });
  }
}
