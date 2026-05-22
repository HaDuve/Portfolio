import { homeHubCopy, homeHubPaths } from "@/data/homeHub";
import type { Locale } from "./i18n";

export type HubTile = {
  eyebrow: string;
  headline: string;
  description: string;
  href: string;
};

export function hubTiles(locale: Locale): [HubTile, HubTile] {
  const copy = homeHubCopy[locale];
  const paths = homeHubPaths(locale);
  return [
    { ...copy.dev, href: paths.dev },
    { ...copy.coaching, href: paths.coaching },
  ];
}
