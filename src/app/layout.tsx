import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import "./globals.css";
// IBM Plex Sans KR is self-hosted: Google's css2 endpoint (what next/font/google
// uses) serves this family without its Hangul ranges, so the Korean chunks are
// vendored under public/fonts/plex-kr and declared here by unicode-range.
import "./fonts/plex-kr.css";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "이희망 기술 블로그",
    template: "%s | 이희망 기술 블로그",
  },
  description: "백엔드와 AI 협업에 대해 쓰는 개인 기술 블로그입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <body className={`${plexMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
