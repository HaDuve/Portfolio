import { describe, it, expect } from "vitest";
import { freelanceLaneFeaturedProjects } from "./freelanceLaneFeatured";
import type { Locale } from "./i18n";

describe("freelanceLaneFeaturedProjects", () => {
  it.each<Locale>(["de", "en"])(
    "returns Budget for Nomads and wikifolio for %s",
    (locale) => {
      const projects = freelanceLaneFeaturedProjects(locale);
      expect(projects).toHaveLength(2);
      expect(projects.map((p) => p.id)).toEqual([
        "budget-for-nomads",
        "wikifolio",
      ]);
    },
  );

  it("links Budget for Nomads to App Store and GitHub", () => {
    const bfn = freelanceLaneFeaturedProjects("de").find(
      (p) => p.id === "budget-for-nomads",
    );
    const labels = bfn?.links.map((l) => l.label) ?? [];
    const hrefs = bfn?.links.map((l) => l.href) ?? [];
    expect(labels).toContain("App Store");
    expect(labels).toContain("GitHub");
    expect(hrefs).toContain(
      "https://apps.apple.com/app/budget-for-nomads/id6446042796",
    );
    expect(hrefs).toContain("https://github.com/HaDuve/TravelCostNative");
  });

  it("links wikifolio to the App Store", () => {
    for (const locale of ["de", "en"] as const) {
      const wiki = freelanceLaneFeaturedProjects(locale).find(
        (p) => p.id === "wikifolio",
      );
      expect(wiki?.links.some((l) => l.label === "App Store")).toBe(true);
      expect(wiki?.links[0]?.href).toMatch(/apps\.apple\.com/);
    }
  });

  it("provides localized copy without empty fields", () => {
    for (const locale of ["de", "en"] as const) {
      for (const project of freelanceLaneFeaturedProjects(locale)) {
        expect(project.title.trim().length).toBeGreaterThan(0);
        expect(project.description.trim().length).toBeGreaterThan(0);
        expect(project.meta.trim().length).toBeGreaterThan(0);
        expect(project.imageAlt.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
