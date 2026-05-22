import {
  FUNNEL_CONTENT_PATHS,
  type FunnelContentPath,
} from "./content-paths.js";
import type { PathPlacementCount } from "./click-store.js";
import type { PageViewCount } from "./access-log-parser.js";

export type FunnelRow = {
  path: FunnelContentPath;
  views: number;
  clicks: number;
  clickRate: number | null;
  placements?: { placement: string; count: number }[];
};

export type BuildFunnelReportOptions = {
  placementBreakdown?: boolean;
};

const HOME_PATHS = new Set<FunnelContentPath>(["/de/", "/en/"]);

export function buildFunnelReport(
  views: PageViewCount,
  clickCounts: PathPlacementCount[],
  options: BuildFunnelReportOptions = {},
): FunnelRow[] {
  const clicksByPath = rollupClicks(clickCounts);

  return FUNNEL_CONTENT_PATHS.map((path) => {
    const pathViews = views.get(path) ?? 0;
    const pathClicks = clicksByPath.get(path) ?? 0;
    const row: FunnelRow = {
      path,
      views: pathViews,
      clicks: pathClicks,
      clickRate: pathViews > 0 ? pathClicks / pathViews : null,
    };
    if (options.placementBreakdown && HOME_PATHS.has(path)) {
      row.placements = placementRowsForPath(path, clickCounts);
    }
    return row;
  });
}

export type FormatFunnelReportOptions = {
  placementBreakdown?: boolean;
};

export function formatFunnelReport(
  rows: FunnelRow[],
  options: FormatFunnelReportOptions = {},
): string {
  const lines: string[] = [
    "path\tviews\tclicks\tclick_rate",
  ];
  for (const row of rows) {
    const rate =
      row.clickRate === null ? "" : (row.clickRate * 100).toFixed(2) + "%";
    lines.push(
      `${row.path}\t${row.views}\t${row.clicks}\t${rate}`,
    );
    if (options.placementBreakdown && row.placements?.length) {
      for (const p of row.placements) {
        lines.push(`  ${p.placement}\t\t${p.count}\t`);
      }
    }
  }
  return lines.join("\n") + "\n";
}

function rollupClicks(clickCounts: PathPlacementCount[]): Map<string, number> {
  const byPath = new Map<string, number>();
  for (const row of clickCounts) {
    byPath.set(row.path, (byPath.get(row.path) ?? 0) + row.count);
  }
  return byPath;
}

function placementRowsForPath(
  path: string,
  clickCounts: PathPlacementCount[],
): { placement: string; count: number }[] {
  return clickCounts
    .filter((r) => r.path === path)
    .map((r) => ({ placement: r.placement, count: r.count }))
    .sort((a, b) => a.placement.localeCompare(b.placement));
}
