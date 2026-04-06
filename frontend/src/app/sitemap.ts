import type { MetadataRoute } from "next";
import projectsData from "@/data/projects.json";
import type { Project } from "@/types/content";

export const dynamic = "force-static";

const BASE = "https://hannesduve.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = projectsData as Project[];
  const imageUrls = projects
    .map((p) => (p.imageUrl ? new URL(p.imageUrl, BASE).href : null))
    .filter(Boolean) as string[];

  const now = new Date();

  const homeImages = imageUrls.length ? imageUrls : undefined;

  return [
    {
      url: `${BASE}/de/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      images: homeImages,
    },
    {
      url: `${BASE}/en/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      images: homeImages,
    },
    {
      url: `${BASE}/de/app-entwickeln-freelancer/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/en/freelance-app-development/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/de/impressum/`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${BASE}/en/impressum/`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${BASE}/de/datenschutz/`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${BASE}/en/privacy/`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
