import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Notion serves uploaded files from S3 with expiring signatures, and covers
    // picked from its gallery come from Unsplash.
    remotePatterns: [
      { protocol: "https", hostname: "*.amazonaws.com" },
      { protocol: "https", hostname: "www.notion.so" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
