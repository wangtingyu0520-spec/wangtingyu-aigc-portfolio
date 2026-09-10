import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "王婷玉｜AIGC 视频创作者",
  description: "王婷玉的 AIGC 视频作品集：短剧、漫剧、商业内容与静态视觉。",
  openGraph: {
    title: "王婷玉｜AIGC 视频创作者",
    description: "短剧、漫剧、商业内容与静态视觉作品集。",
    images: [{ url: "/og.png", width: 1762, height: 926, alt: "Wang Ting Yu — AIGC Video Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "王婷玉｜AIGC 视频创作者",
    description: "短剧、漫剧、商业内容与静态视觉作品集。",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
