import type { NextConfig } from "next";

/** Static export for Caddy file_server. See https://nextjs.org/docs/app/guides/static-exports */
const nextConfig: NextConfig = {
  output: "export",
  /** Emit `out/de/index.html` (not `de.html`) so static hosts resolve `/de/` correctly. */
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
