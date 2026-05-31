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

const WIKIFOLIO_URL =
  "https://apps.apple.com/de/app/wikifolio/id6476974452";
const BUDGET_FOR_NOMADS_URL =
  "https://apps.apple.com/app/budget-for-nomads/id6446042796";
const GITHUB_URL = "https://github.com/HaDuve";

const items: Record<Locale, CredibilityItem[]> = {
  de: [
    { id: "wikifolio", label: "wikifolio · shipped", href: WIKIFOLIO_URL },
    {
      id: "budget-for-nomads",
      label: "Budget for Nomads · App Store",
      href: BUDGET_FOR_NOMADS_URL,
    },
    { id: "github", label: "GitHub", href: GITHUB_URL },
    { id: "location", label: "Bremen · DACH" },
    { id: "senior", label: "Senior · 10+ Jahre" },
  ],
  en: [
    { id: "wikifolio", label: "wikifolio · shipped", href: WIKIFOLIO_URL },
    {
      id: "budget-for-nomads",
      label: "Budget for Nomads · App Store",
      href: BUDGET_FOR_NOMADS_URL,
    },
    { id: "github", label: "GitHub", href: GITHUB_URL },
    { id: "location", label: "Bremen · DACH" },
    { id: "senior", label: "Senior · 10+ years" },
  ],
};

export function credibilityStripItems(locale: Locale): CredibilityItem[] {
  return items[locale];
}
