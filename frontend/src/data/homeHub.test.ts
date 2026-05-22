import { describe, it, expect } from "vitest";
import { homeHubCopy, homeHubPaths } from "./homeHub";

describe("homeHubPaths", () => {
  it("returns locale-aware dev and coaching landing URLs", () => {
    expect(homeHubPaths("de")).toEqual({
      dev: "/de/app-entwickeln-freelancer/",
      coaching: "/de/programmieren-lernen-mit-ki/",
    });
    expect(homeHubPaths("en")).toEqual({
      dev: "/en/freelance-app-development/",
      coaching: "/en/vibe-coding-coach/",
    });
  });
});

describe("homeHubCopy", () => {
  for (const locale of ["de", "en"] as const) {
    it(`${locale} has dev and coaching tile copy`, () => {
      const hub = homeHubCopy[locale];
      expect(hub.dev.headline.length).toBeGreaterThan(0);
      expect(hub.coaching.headline.length).toBeGreaterThan(0);
    });
  }
});
