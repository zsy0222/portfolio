import type { Metadata } from "next";
import WorldRoom from "@/components/world/WorldRoom";
export const metadata: Metadata = { title: "创作室 · My World — Chenmu", description: "Explore an interactive digital studio. Projects, research, memories and ideas have a place here." };
export default function WorldPage() { return <WorldRoom/>; }
