import { db } from "@/db/config";
import { projects } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await db.select().from(projects).orderBy(projects.sortOrder);
  return NextResponse.json(result);
}
