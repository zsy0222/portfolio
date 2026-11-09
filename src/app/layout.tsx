import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/components/studio-design.css";
import "@/components/material-details.css";
import "@/components/spatial-motion.css";
import "@/components/reference-design.css";
import "@/components/theme-system.css";
import "@/components/typography.css";
import { ProjectWindowsProvider } from "@/components/ProjectWindows";
import Sidebar from "@/components/Sidebar";
import MotionEffects from "@/components/MotionEffects";
import PageTransition from "@/components/PageTransition";
import BackToTop from "@/components/BackToTop";
import VisitAnalytics from "@/components/VisitAnalytics";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Chenmu — Siyuan Zheng",
  description:
    "Software Engineering & Business Administration student at Nanjing University. Exploring quantitative analysis, AI product management, and algorithm design.",
  metadataBase: new URL("https://chenmuqingtongyan.vercel.app"),
  openGraph: {
    title: "Chenmu — Siyuan Zheng",
    description:
      "Software Engineering & Business Administration student at Nanjing University. Exploring quantitative analysis, AI product management, and algorithm design.",
    type: "website",
    locale: "en_US",
    url: "https://chenmuqingtongyan.vercel.app",
    siteName: "Siyuan Zheng",
  },
  twitter: {
    card: "summary",
    title: "Chenmu — Siyuan Zheng",
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
  themeColor: "#141323",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var d=true;try{d=localStorage.getItem('theme')!=='light';}catch(e){}document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',d?'#141323':'#f8f5f1');})();` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://giscus.app" />
      </head>
      <body className="min-h-full bg-bg text-lead leading-[1.6]">
        <ProjectWindowsProvider>
        <a href="#main-content" className="skip-link">
          Skip to Content
        </a>
        <div id="top" className="site-shell">
          <Sidebar />
          <main id="main-content" tabIndex={-1} className="site-main">
            {children}
          </main>
        </div>
        <PageTransition />
        <MotionEffects />
        <BackToTop />
        </ProjectWindowsProvider>
        <Analytics />
        <VisitAnalytics enabled={process.env.VERCEL_ENV !== "preview"} />
      </body>
    </html>
  );
}
