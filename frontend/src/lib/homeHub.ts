import { homeHubCopy, homeHubPaths } from "@/data/homeHub";
import type { Locale } from "./i18n";

export type HubTile = {
  eyebrow: string;
  headline: string;
  description: string;
  href: string;
};

export type HubHeaderNavItem = {
  label: string;
  href: string;
  ariaLabel: string;
};

export function hubTiles(locale: Locale): [HubTile, HubTile] {
  const copy = homeHubCopy[locale];
  const paths = homeHubPaths(locale);
  return [
    { ...copy.dev, href: paths.dev },
    { ...copy.coaching, href: paths.coaching },
  ];
}

function hubHeaderNavItem(tile: HubTile): HubHeaderNavItem {
  return {
    label: tile.eyebrow,
    href: tile.href,
    ariaLabel: `${tile.eyebrow}: ${tile.headline}`,
  };
}

export function hubHeaderNavItems(
  locale: Locale,
): [HubHeaderNavItem, HubHeaderNavItem] {
  const [dev, coaching] = hubTiles(locale);
  return [hubHeaderNavItem(dev), hubHeaderNavItem(coaching)];
}
