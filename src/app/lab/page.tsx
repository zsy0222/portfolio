import { Suspense } from "react";
import type { Metadata } from "next";
import LabCatalog from "@/components/world/LabCatalog";

export const metadata: Metadata = {
  title: "Creative Lab — Chenmu",
  description: "Software, AI research, 3D worlds and visual storytelling. Explore Chenmu's projects and works in progress.",
};

export default function LabPage() {
  return <Suspense fallback={<div className="world-page"><p className="world-eyebrow">CREATIVE LAB</p><h1 className="world-title">Ideas, made into worlds.</h1><p role="status">正在整理展览 · Loading the collection…</p></div>}><LabCatalog /></Suspense>;
}
