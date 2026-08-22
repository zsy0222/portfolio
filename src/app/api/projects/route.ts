export const revalidate = 3600;
export const runtime = "nodejs";
import { hasDb, tursoQuery, allRows } from "@/lib/turso";
import { projects as fallbackProjects } from "@/data/projects";
import { NextResponse } from "next/server";

function fallbackResponse() {
  return NextResponse.json(
    fallbackProjects.map((project, index) => ({
      id: index + 1,
      slug: project.id,
      title: project.title,
      description: project.description,
      tags: project.tags,
      liveUrl: project.liveUrl ?? null,
      repoUrl: project.repoUrl ?? null,
    })),
  );
}

export async function GET() {
  if (!hasDb()) return fallbackResponse();

  try {
    const r = await tursoQuery("SELECT id, slug, title, description, tags, live_url as liveUrl, repo_url as repoUrl, sort_order as sortOrder, created_at as createdAt FROM projects ORDER BY sort_order");
    const rows = allRows(r).map((row) => ({
      ...row,
      id: Number(row.id),
      tags: (() => {
        try {
          return JSON.parse(row.tags || "[]");
        } catch {
          return row.tags ? row.tags.split(",").map((tag) => tag.trim()) : [];
        }
      })(),
    }));
    return rows.length ? NextResponse.json(rows) : fallbackResponse();
  } catch {
    return fallbackResponse();
  }
}
