import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hannes Duve — Freelance Full-Stack & Mobile",
    short_name: "Hannes Duve",
    description:
      "Web-Apps, Mobile Apps und Full-Stack für KMU im DACH-Raum — Next.js, Expo, Cloud.",
    start_url: "/de",
    display: "standalone",
    background_color: "#f5f5f4",
    theme_color: "#4f46e5",
    lang: "de",
  };
}
