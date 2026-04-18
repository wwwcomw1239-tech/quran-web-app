import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

// Detect if building for Cloudflare Pages (no basePath needed)
const isCloudflarePages = process.env.CF_PAGES === '1';

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  ranges: [
    {
      urlPattern: /^https:\/\/server\.mp3quran\.net\/.*/i,
      handler: "CacheFirst" as const,
      options: {
        cacheName: "quran-audio",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /^https:\/\/archive\.org\/.*/i,
      handler: "CacheFirst" as const,
      options: {
        cacheName: "books-pdfs",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
      handler: "CacheFirst" as const,
      options: {
        cacheName: "google-fonts",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache YouTube thumbnails aggressively (used heavily in Videos/Shorts/Kids tabs)
    {
      urlPattern: /^https:\/\/i\.ytimg\.com\/.*/i,
      handler: "CacheFirst" as const,
      options: {
        cacheName: "youtube-thumbs",
        expiration: {
          maxEntries: 500,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache the app-generated static assets (JS/CSS) for a year
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: "CacheFirst" as const,
      options: {
        cacheName: "next-static",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
});

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
  // Empty turbopack config to acknowledge webpack config from PWA plugin
  turbopack: {},
};

export default withPWA(nextConfig);
