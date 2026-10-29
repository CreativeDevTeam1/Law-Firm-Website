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
};

export default nextConfig;
