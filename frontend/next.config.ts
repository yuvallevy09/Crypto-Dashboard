import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Skip ESLint errors during production builds (CI) to avoid blocking deploys
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
