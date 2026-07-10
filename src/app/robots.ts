import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/wiki", "/status", "/wiki/ask"],
      },
    ],
    sitemap: "https://chenmuqingtongyan.vercel.app/sitemap.xml",
  };
}
