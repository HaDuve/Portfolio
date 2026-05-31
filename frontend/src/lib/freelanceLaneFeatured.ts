import type { Locale } from "./i18n";

export type FreelanceFeaturedProjectId = "budget-for-nomads" | "wikifolio";

export type FeaturedProjectLink = {
  label: string;
  href: string;
};

export type FreelanceFeaturedProject = {
  id: FreelanceFeaturedProjectId;
  title: string;
  meta: string;
  description: string;
  tags: string[];
  links: FeaturedProjectLink[];
  imageSrc: string;
  imageAlt: string;
};

const BUDGET_APP_STORE =
  "https://apps.apple.com/app/budget-for-nomads/id6446042796";
const BUDGET_GITHUB = "https://github.com/HaDuve/TravelCostNative";

function wikifolioAppStore(locale: Locale): string {
  return locale === "de"
    ? "https://apps.apple.com/de/app/wikifolio/id6476974452"
    : "https://apps.apple.com/app/wikifolio/id6476974452";
}

const projects: Record<Locale, FreelanceFeaturedProject[]> = {
  de: [
    {
      id: "budget-for-nomads",
      title: "Budget for Nomads",
      meta: "App · 2022–2024 · Konzept & Umsetzung",
      description:
        "React-Native-App für reisebasiertes Budgeting: Ausgaben pro Trip, Multi-Währung, offline mit Sync — End-to-End von einer Hand.",
      tags: ["Expo", "React Native", "TypeScript", "Firebase"],
      links: [
        { label: "App Store", href: BUDGET_APP_STORE },
        { label: "GitHub", href: BUDGET_GITHUB },
      ],
      imageSrc: "/assets/Frame%20295.png",
      imageAlt: "Budget for Nomads — Reisebudget im Überblick",
    },
    {
      id: "wikifolio",
      title: "wikifolio",
      meta: "2024–2025 · Mobile App Developer",
      description:
        "Cross-Platform-App: Trading- und Community-Produkt mit nativem Rich-Text-Editor, Charts, Deep Linking und CI/CD für Releases.",
      tags: ["React Native", "TypeScript", "Maestro"],
      links: [{ label: "App Store", href: wikifolioAppStore("de") }],
      imageSrc: "/assets/Wikifolio.jpg",
      imageAlt: "wikifolio — Trading- und Community-App",
    },
  ],
  en: [
    {
      id: "budget-for-nomads",
      title: "Budget for Nomads",
      meta: "App · 2022–2024 · design & build",
      description:
        "React Native travel budgeting app: per-trip spending, multi-currency, offline with sync — built end to end.",
      tags: ["Expo", "React Native", "TypeScript", "Firebase"],
      links: [
        { label: "App Store", href: BUDGET_APP_STORE },
        { label: "GitHub", href: BUDGET_GITHUB },
      ],
      imageSrc: "/assets/Frame%20295.png",
      imageAlt: "Budget for Nomads — trip budget overview",
    },
    {
      id: "wikifolio",
      title: "wikifolio",
      meta: "2024–2025 · mobile app developer",
      description:
        "Cross-platform app: trading and community product with a native rich-text editor, charts, deep linking, and CI/CD for releases.",
      tags: ["React Native", "TypeScript", "Maestro"],
      links: [{ label: "App Store", href: wikifolioAppStore("en") }],
      imageSrc: "/assets/Wikifolio.jpg",
      imageAlt: "wikifolio — trading and community app",
    },
  ],
};

export function freelanceLaneFeaturedProjects(
  locale: Locale,
): FreelanceFeaturedProject[] {
  return projects[locale];
}
