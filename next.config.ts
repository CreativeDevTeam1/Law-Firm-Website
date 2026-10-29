import type { NextConfig } from "next";
import { sanity } from "next-sanity/live/cache-life";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Cached content is kept until Sanity says it changed (<SanityLive />),
  // rather than refetched on a timer.
  cacheLife: { default: sanity },
  images: {
    // Images uploaded to the CMS (Sanity's image CDN).
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" }],
  },
  // /studio opens the Studio hosted on Sanity (deployed from ../studio-law-firm-website).
  async redirects() {
    return [
      { source: "/studio", destination: "https://law-firm-website.sanity.studio", permanent: false },
      { source: "/studio/:path*", destination: "https://law-firm-website.sanity.studio/:path*", permanent: false },
    ];
  },
};

export default nextConfig;
