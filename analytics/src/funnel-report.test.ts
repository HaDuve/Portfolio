import { describe, it, expect } from "vitest";
import { buildFunnelReport, formatFunnelReport } from "./funnel-report.js";
import { FUNNEL_CONTENT_PATHS } from "./content-paths.js";
import type { PageViewCount } from "./access-log-parser.js";
import type { PathPlacementCount } from "./click-store.js";

describe("buildFunnelReport", () => {
  it("joins logged page views with scheduling clicks per path", () => {
    const views: PageViewCount = new Map();
    views.set("/de/", 100);
    views.set("/en/", 50);

    const clicks: PathPlacementCount[] = [
      { path: "/de/", placement: "hero", count: 2 },
      { path: "/de/", placement: "contact", count: 1 },
      { path: "/en/", placement: "hero", count: 4 },
    ];

    const rows = buildFunnelReport(views, clicks);
    const de = rows.find((r) => r.path === "/de/");
    const en = rows.find((r) => r.path === "/en/");

    expect(de).toMatchObject({ views: 100, clicks: 3, clickRate: 0.03 });
    expect(en).toMatchObject({ views: 50, clicks: 4, clickRate: 0.08 });
  });

  it("lists every allowlisted funnel path", () => {
    const rows = buildFunnelReport(new Map(), []);
    expect(rows.map((r) => r.path)).toEqual([...FUNNEL_CONTENT_PATHS]);
  });

  it("includes placement breakdown for home paths when requested", () => {
    const views = new Map([["/de/", 10]] as const);
    const clicks: PathPlacementCount[] = [
      { path: "/de/", placement: "hero", count: 2 },
      { path: "/de/", placement: "contact", count: 1 },
    ];

    const text = formatFunnelReport(
      buildFunnelReport(views, clicks, { placementBreakdown: true }),
      { placementBreakdown: true },
    );

    expect(text).toContain("/de/");
    expect(text).toContain("hero");
    expect(text).toContain("contact");
  });
});
