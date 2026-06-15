import type { NextConfig } from "next";

const isProductionBuild = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "docs",
  basePath: isProductionBuild ? "/brainstormer" : "",
  assetPrefix: isProductionBuild ? "/brainstormer/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
