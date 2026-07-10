import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Siyuan Zheng — Portfolio",
  description:
    "Software Engineering & Business Administration student at Nanjing University. Exploring quantitative analysis, AI product management, and algorithm design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg text-lead leading-[1.6]">
        <div id="top" className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
