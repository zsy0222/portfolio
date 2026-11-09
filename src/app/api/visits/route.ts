import { hasDb } from "@/lib/turso";
import { browserIdPattern, recordVisit } from "@/lib/visitor-stats";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (process.env.VERCEL_ENV === "preview") return new Response(null, { status: 404 });
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return new Response(null, { status: 403 });
  }
  const data = await request.json().catch(() => null);
  if (typeof data?.browserId !== "string" || !browserIdPattern.test(data.browserId)) {
    return new Response(null, { status: 400 });
  }
  if (!hasDb()) return new Response(null, { status: 503 });
  try {
    await recordVisit(data.browserId);
    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 503 });
  }
}
