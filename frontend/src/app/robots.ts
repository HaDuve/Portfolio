import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE = "https://hannesduve.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
