import type { Metadata, Viewport } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Siyuan Zheng — Portfolio",
  description:
    "Software Engineering & Business Administration student at Nanjing University. Exploring quantitative analysis, AI product management, and algorithm design.",
  openGraph: {
    title: "Siyuan Zheng — Portfolio",
    description:
      "Software Engineering & Business Administration student at Nanjing University. Exploring quantitative analysis, AI product management, and algorithm design.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Siyuan Zheng — Portfolio",
    description:
      "Software Engineering & Business Administration student at Nanjing University.",
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
    <html lang="en" className="h-full antialiased" style={{ colorScheme: "light dark" }}>
      <body className="min-h-full bg-bg text-lead leading-[1.6]">
        <div id="top" className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
