import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder photography; swap for the firm's own images.
    remotePatterns: [new URL("https://images.unsplash.com/**")],
  },
};

export default nextConfig;
