/** Home page and Landing Page paths counted in the Lead funnel (CONTEXT.md). */
export const FUNNEL_CONTENT_PATHS = [
  "/de/",
  "/en/",
  "/de/app-entwickeln-freelancer/",
  "/en/freelance-app-development/",
  "/de/programmieren-lernen-mit-ki/",
  "/en/vibe-coding-coach/",
] as const;

export type FunnelContentPath = (typeof FUNNEL_CONTENT_PATHS)[number];

const ALLOWED = new Set<string>(FUNNEL_CONTENT_PATHS);

export function isFunnelContentPath(path: string): path is FunnelContentPath {
  return ALLOWED.has(path);
}

/** Maps request URI to a canonical funnel path, or null if not a content page. */
export function canonicalFunnelPath(uri: string): FunnelContentPath | null {
  const raw = uri.split("?")[0]?.split("#")[0] ?? "";
  if (!raw.startsWith("/")) return null;
  const withSlash = raw.endsWith("/") ? raw : `${raw}/`;
  return isFunnelContentPath(withSlash) ? withSlash : null;
}
