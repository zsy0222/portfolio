export const revalidate = 3600;

import { projects } from "@/data/projects";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    projects.map((project, index) => ({
      id: index + 1,
      slug: project.id,
      title: project.title,
      description: project.description,
      status: project.status,
      role: project.role,
      highlights: project.highlights,
      tags: project.tags,
      liveUrl: project.liveUrl ?? null,
      repoUrl: project.repoUrl ?? null,
      availability: project.availability ?? null,
    })),
  );
}
