import type { Metadata } from "next";
import TravelWall from "@/components/TravelWall";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "旅行墙 · Places I carry — Chenmu",
  description: "旅行海报与纪念票根构成的个人旅行墙。从海岛到草原，把风景留在文字之外。",
  alternates: { canonical: "/blog/travel" },
};

export default function TravelPage() {
  return <><TravelWall /><Footer /></>;
}
