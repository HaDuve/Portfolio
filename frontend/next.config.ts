import type { NextConfig } from "next";

/** Static export for Caddy file_server. See https://nextjs.org/docs/app/guides/static-exports */
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
