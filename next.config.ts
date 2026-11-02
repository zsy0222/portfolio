import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  async headers() {
    // The embedded comment frame loads the site's theme and Songti fonts.
    return ["/giscus-dark.css", "/giscus-light.css", "/fonts/songti/:path*"].map((source) => ({
      source,
      headers: [{ key: "Access-Control-Allow-Origin", value: "https://giscus.app" }],
    }));
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
