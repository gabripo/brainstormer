import type { NextConfig } from "next";

const repoName = process.env.REPO_NAME || "";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "docs",
  basePath: repoName ? `/${repoName}` : "",
  assetPrefix: repoName ? `/${repoName}/` : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
