import { describe, it, expect } from "vitest";
import projectsData from "@/data/projects.json";
import { normalizeProjects } from "@/lib/normalizeProjects";
import { FREELANCE_LANE_PROJECT_SLUGS } from "./freelanceLaneSlugs";
import { freelanceLaneFeaturedProjects } from "./freelanceLaneFeatured";
import type { Locale } from "./i18n";
import type { RawProject } from "@/types/content";

const projects = normalizeProjects(projectsData as RawProject[]);

describe("freelanceLaneFeaturedProjects", () => {
  it.each<Locale>(["de", "en"])(
    "returns Budget for Nomads and wikifolio for %s",
    (locale) => {
      const cards = freelanceLaneFeaturedProjects(locale, projects);
      expect(cards).toHaveLength(2);
      expect(cards.map((p) => p.id)).toEqual([...FREELANCE_LANE_PROJECT_SLUGS]);
    },
  );

  it("links Budget for Nomads to App Store and GitHub from project data", () => {
    const bfn = freelanceLaneFeaturedProjects("de", projects).find(
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

  it("links wikifolio to the App Store by label", () => {
    for (const locale of ["de", "en"] as const) {
      const wiki = freelanceLaneFeaturedProjects(locale, projects).find(
        (p) => p.id === "wikifolio",
      );
      const appStore = wiki?.links.find((l) => l.label === "App Store");
      expect(appStore?.href).toMatch(/apps\.apple\.com/);
    }
  });

  it("provides localized copy without empty fields", () => {
    for (const locale of ["de", "en"] as const) {
      for (const project of freelanceLaneFeaturedProjects(locale, projects)) {
        expect(project.title.trim().length).toBeGreaterThan(0);
        expect(project.description.trim().length).toBeGreaterThan(0);
        expect(project.meta.trim().length).toBeGreaterThan(0);
        expect(project.imageAlt.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
