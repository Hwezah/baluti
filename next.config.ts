import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder photography; swap for the firm's own images.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
