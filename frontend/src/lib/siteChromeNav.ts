import type { HomePageSectionId } from "./homeSections";
import { coachingLandingPath, devLandingPath, type Locale } from "./i18n";

export type SiteChromeNavItem = {
  id: HomePageSectionId;
  hash: HomePageSectionId;
  label: string;
};

const nav: Record<Locale, SiteChromeNavItem[]> = {
  de: [
    { id: "freelance", hash: "freelance", label: "Freelance" },
    { id: "coaching", hash: "coaching", label: "Coaching" },
    { id: "skills", hash: "skills", label: "Stack" },
    { id: "contact", hash: "contact", label: "Kontakt" },
  ],
  en: [
    { id: "freelance", hash: "freelance", label: "Freelance" },
    { id: "coaching", hash: "coaching", label: "Coaching" },
    { id: "skills", hash: "skills", label: "Stack" },
    { id: "contact", hash: "contact", label: "Contact" },
  ],
};

export function siteChromeNav(locale: Locale): SiteChromeNavItem[] {
  return nav[locale];
}

export type SiteChromeMoreLink = {
  href: string;
  label: string;
};

export function siteChromeMoreLinks(
  locale: Locale,
  labels: { freelance: string; coaching: string },
): SiteChromeMoreLink[] {
  return [
    { href: devLandingPath(locale), label: labels.freelance },
    { href: coachingLandingPath(locale), label: labels.coaching },
  ];
}
