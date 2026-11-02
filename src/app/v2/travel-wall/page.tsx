import type { Metadata } from "next";
import TravelWallV2 from "@/components/TravelWallV2";

export const metadata: Metadata = {
  title: "Places I Carry · Travel Archive",
  description: "An illustrated travel archive of places, posters, and tickets. A personal collection of memories, connected to the room.",
};

export default function TravelWallV2Page() {
  return <TravelWallV2 />;
}
