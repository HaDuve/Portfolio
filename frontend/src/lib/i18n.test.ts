import { describe, it, expect } from "vitest";
import { getAlternateLocalePath, devLandingPath } from "./i18n";

describe("getAlternateLocalePath — coaching page pair", () => {
  it("maps DE coaching slug to EN", () => {
    expect(
      getAlternateLocalePath("/de/programmieren-lernen-mit-ki/", "en"),
    ).toBe("/en/vibe-coding-coach/");
  });
});

describe("devLandingPath", () => {
  it("returns DE slug for de locale", () => {
    expect(devLandingPath("de")).toBe("/de/app-entwickeln-freelancer/");
  });

  it("returns EN slug for en locale", () => {
    expect(devLandingPath("en")).toBe("/en/freelance-app-development/");
  });
});
