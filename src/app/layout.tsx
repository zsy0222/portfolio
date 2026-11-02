import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteShell from "@/components/SiteShell";
import BackToTop from "@/components/BackToTop";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Chenmu — Personal Digital World",
  description:
    "Software Engineering & Business Administration student at Nanjing University. A mind that builds, a world that remembers.",
  metadataBase: new URL("https://chenmuqingtongyan.vercel.app"),
  openGraph: {
    title: "Chenmu — Personal Digital World",
    description:
      "Software Engineering & Business Administration student at Nanjing University. A mind that builds, a world that remembers.",
    type: "website",
    locale: "en_US",
    url: "https://chenmuqingtongyan.vercel.app",
    siteName: "Chenmu",
  },
  twitter: {
    card: "summary",
    title: "Chenmu — Personal Digital World",
    description:
      "Software Engineering & Business Administration student at Nanjing University.",
  },
  alternates: {
    types: {
      "application/rss+xml": "https://chenmuqingtongyan.vercel.app/feed.xml",
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0ecf2" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1525" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://giscus.app" />
      </head>
      <body className="min-h-full bg-bg text-lead leading-[1.6]">
        <a href="#main-content" className="skip-link">
          Skip to Content
        </a>
        <SiteShell>{children}</SiteShell>
        <BackToTop />
        <Analytics />
      </body>
    </html>
  );
}
