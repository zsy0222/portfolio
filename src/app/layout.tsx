import type { Metadata, Viewport } from "next";
import "./globals.css";
import WorldNavigation from "@/components/world/WorldNavigation";
import WorldFooter from "@/components/world/WorldFooter";
import { WorldProvider } from "@/components/world/WorldProvider";
import "@/components/world/world.css";
import BackToTop from "@/components/BackToTop";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "CHENMU — Personal Digital World",
  description:
    "Chenmu 的个人数字世界：软件工程、AI 研究、3D 创作、旅行记忆与思想档案。A mind that builds, a world that remembers.",
  metadataBase: new URL("https://chenmuqingtongyan.vercel.app"),
  openGraph: {
    title: "CHENMU — Personal Digital World",
    description:
      "Software Engineering × Business Innovation. A mind that builds, a world that remembers.",
    type: "website",
    locale: "zh_CN",
    alternateLocale: "en_US",
    url: "https://chenmuqingtongyan.vercel.app",
    siteName: "CHENMU",
  },
  twitter: {
    card: "summary",
    title: "CHENMU — Personal Digital World",
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
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://giscus.app" />
      </head>
      <body className="min-h-full bg-bg text-lead leading-[1.6]">
        <a href="#main-content" className="skip-link">
          Skip to Content
        </a>
        <WorldProvider>
        <div id="top" className="min-h-screen">
          <WorldNavigation />
          <main id="main-content" tabIndex={-1} className="world-main min-w-0">
            {children}
          </main>
          <WorldFooter />
        </div>
        </WorldProvider>
        <BackToTop />
        <Analytics />
      </body>
    </html>
  );
}
