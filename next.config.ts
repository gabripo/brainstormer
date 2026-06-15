import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "docs",
  basePath: "/brainstormer",
  assetPrefix: "/brainstormer/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
