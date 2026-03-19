import type { NextConfig } from "next";

// Detect if building for Cloudflare Pages (no basePath needed)
const isCloudflarePages = process.env.CF_PAGES === '1';

const nextConfig: NextConfig = {
  output: "export",
  // Only use basePath for GitHub Pages, not for Cloudflare Pages
  ...(isCloudflarePages ? {} : {
    basePath: "/quran-web-app",
    assetPrefix: "/quran-web-app/",
  }),
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  trailingSlash: true,
};

export default nextConfig;
