import type { Locale } from "./i18n";

export type CredibilityItemId =
  | "wikifolio"
  | "budget-for-nomads"
  | "github"
  | "location"
  | "senior";

export type CredibilityItem = {
  id: CredibilityItemId;
  label: string;
  href?: string;
};

const BUDGET_FOR_NOMADS_URL =
  "https://apps.apple.com/app/budget-for-nomads/id6446042796";
const GITHUB_URL = "https://github.com/HaDuve";

function wikifolioUrl(locale: Locale): string {
  return locale === "de"
    ? "https://apps.apple.com/de/app/wikifolio/id6476974452"
    : "https://apps.apple.com/app/wikifolio/id6476974452";
}

const items: Record<Locale, CredibilityItem[]> = {
  de: [
    {
      id: "wikifolio",
      label: "wikifolio · live im App Store",
      href: wikifolioUrl("de"),
    },
    {
      id: "budget-for-nomads",
      label: "Budget for Nomads · App Store",
      href: BUDGET_FOR_NOMADS_URL,
    },
    { id: "github", label: "GitHub", href: GITHUB_URL },
    { id: "location", label: "Bremen · DACH" },
    { id: "senior", label: "Senior Freelancer" },
  ],
  en: [
    {
      id: "wikifolio",
      label: "wikifolio · shipped",
      href: wikifolioUrl("en"),
    },
    {
      id: "budget-for-nomads",
      label: "Budget for Nomads · App Store",
      href: BUDGET_FOR_NOMADS_URL,
    },
    { id: "github", label: "GitHub", href: GITHUB_URL },
    { id: "location", label: "Bremen · DACH" },
    { id: "senior", label: "Senior freelancer" },
  ],
};

export function credibilityStripItems(locale: Locale): CredibilityItem[] {
  return items[locale];
}
