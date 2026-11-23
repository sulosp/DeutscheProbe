import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon.svg" }];
  },
};

export default nextConfig;
