import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  sassOptions: {
    loadPaths: [path.resolve("./src/styles")],
  },
};

export default nextConfig;