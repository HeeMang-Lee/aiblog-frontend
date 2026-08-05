import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import "./globals.css";
// IBM Plex Sans KR is self-hosted: Google's css2 endpoint (what next/font/google
// uses) serves this family without its Hangul ranges, so the Korean chunks are
// vendored under public/fonts/plex-kr and declared here by unicode-range.
import "./fonts/plex-kr.css";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  // 같은 글이 여러 주소로 잡히면 색인이 갈린다. 각 페이지가 자기 주소를
  // 정본으로 선언한다.
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    // 카드 이미지를 크게 띄운다. opengraph-image 가 1200x630 을 만든다.
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // 검색 결과에 본문 미리보기와 이미지를 제한 없이 쓰게 한다.
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
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
