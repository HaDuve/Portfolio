/** Normalizes app paths for comparisons (always trailing slash). */
export function normalizeContentPath(path: string): string {
  if (!path.startsWith("/")) return path;
  return path.endsWith("/") ? path : `${path}/`;
}

/** True when pathname is a locale home (`/de/` or `/en/`). */
export function isLocaleHomePath(pathname: string): boolean {
  const path = normalizeContentPath(pathname);
  return /^\/(de|en)\/$/.test(path);
}
