import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // pin the workspace root — multiple lockfiles exist on this machine
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
