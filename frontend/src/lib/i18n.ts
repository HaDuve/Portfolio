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
  de: {
    title:
      "App entwickeln & Full-Stack — Freelancer Hannes Duve (DACH)",
    description:
      "App entwickeln, Webapps und Backends bauen: Senior-Freelancer (Next.js, React Native/Expo, Node, Cloud). App beauftragen — remote für KMU in DE, AT & CH.",
  },
  en: {
    title:
      "Freelance app & full-stack developer — Hannes Duve (DACH & EU)",
    description:
      "Hire a freelance app developer for web apps, mobile (React Native/Expo), and backends — Next.js, Node, cloud. Remote for SMEs in Germany, Austria, Switzerland, and beyond.",
  },
} as const;

/** Second line inside the hero `<h1>` — complements the name with target keywords. */
export const heroH1Subtitle = {
  de: "App entwickeln, Web & Mobile — Freelancer für KMU im DACH-Raum",
  en: "App development, web & mobile — freelance for SMEs (DACH & EU)",
} as const;
