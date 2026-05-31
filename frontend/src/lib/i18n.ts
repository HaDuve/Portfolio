import { homeSeoMeta } from "./homeSeoMeta";

export const locales = ["de", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "de";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

const BASE = "https://hannesduve.com";

/** Alternate URL for hreflang / locale switcher (handles datenschutz ↔ privacy). */
export function getAlternateLocalePath(pathname: string, target: Locale): string {
  const parts = pathname.replace(/\/$/, "").split("/").filter(Boolean);
  const first = parts[0];
  if (!isLocale(first)) {
    return `/${target}/`;
  }
  const sub = parts.slice(1);
  // Coaching slug mapping: DE uses `/programmieren-lernen-mit-ki/`, EN uses `/vibe-coding-coach/`.
  if (sub[0] === "programmieren-lernen-mit-ki" && target === "en") {
    return "/en/vibe-coding-coach/";
  }
  if (sub[0] === "vibe-coding-coach" && target === "de") {
    return "/de/programmieren-lernen-mit-ki/";
  }
  // Landing slug mapping: DE uses `/app-entwickeln-freelancer/`, EN uses `/freelance-app-development/`.
  if (sub[0] === "app-entwickeln-freelancer" && target === "en") {
    return "/en/freelance-app-development/";
  }
  if (sub[0] === "freelance-app-development" && target === "de") {
    return "/de/app-entwickeln-freelancer/";
  }
  if (sub[0] === "datenschutz" && target === "en") {
    return "/en/privacy/";
  }
  if (sub[0] === "privacy" && target === "de") {
    return "/de/datenschutz/";
  }
  if (sub.length === 0) {
    return `/${target}/`;
  }
  return `/${target}/${sub.join("/")}/`;
}

/** Locale-aware path to the app-dev landing page. */
export function devLandingPath(locale: Locale): string {
  return locale === "en"
    ? "/en/freelance-app-development/"
    : "/de/app-entwickeln-freelancer/";
}

/** Locale-aware path to the AI coaching landing page. */
export function coachingLandingPath(locale: Locale): string {
  return locale === "en"
    ? "/en/vibe-coding-coach/"
    : "/de/programmieren-lernen-mit-ki/";
}

export function localePath(locale: Locale, subPath = ""): string {
  const p = subPath.replace(/^\//, "").replace(/\/$/, "");
  if (!p) {
    return `/${locale}/`;
  }
  return `/${locale}/${p}/`;
}

export function impressumPath(locale: Locale): string {
  return `/${locale}/impressum/`;
}

/** DE: /de/datenschutz/ · EN: /en/privacy/ */
export function datenschutzPath(locale: Locale): string {
  return locale === "en" ? "/en/privacy/" : "/de/datenschutz/";
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export const siteCopy = {
  de: homeSeoMeta("de"),
  en: homeSeoMeta("en"),
} as const;

