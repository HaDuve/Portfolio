import { describe, it, expect } from "vitest";
import { hubHeaderNavItems, hubTiles } from "./homeHub";

describe("hubHeaderNavItems", () => {
  it("routes DE visitors to the same landing pages as hub tiles", () => {
    const nav = hubHeaderNavItems("de");
    const tiles = hubTiles("de");
    expect(nav).toHaveLength(2);
    expect(nav.map((item) => item.href)).toEqual(tiles.map((t) => t.href));
  });

  it("routes EN visitors to the same landing pages as hub tiles", () => {
    const nav = hubHeaderNavItems("en");
    const tiles = hubTiles("en");
    expect(nav).toHaveLength(2);
    expect(nav.map((item) => item.href)).toEqual(tiles.map((t) => t.href));
  });

  it("uses hub tile eyebrow labels for short header nav copy", () => {
    for (const locale of ["de", "en"] as const) {
      const nav = hubHeaderNavItems(locale);
      const tiles = hubTiles(locale);
      expect(nav.map((item) => item.label)).toEqual(
        tiles.map((t) => t.eyebrow),
      );
    }
  });
});

describe("hubTiles — dev tile", () => {
  it("links DE visitors to the app-dev landing page", () => {
    const [dev] = hubTiles("de");
    expect(dev.href).toBe("/de/app-entwickeln-freelancer/");
  });

  it("links EN visitors to the app-dev landing page", () => {
    const [dev] = hubTiles("en");
    expect(dev.href).toBe("/en/freelance-app-development/");
  });
});

describe("hubTiles — coaching tile", () => {
  it("links DE visitors to the coaching landing page", () => {
    const [, coaching] = hubTiles("de");
    expect(coaching.href).toBe("/de/programmieren-lernen-mit-ki/");
  });

  it("links EN visitors to the coaching landing page", () => {
    const [, coaching] = hubTiles("en");
    expect(coaching.href).toBe("/en/vibe-coding-coach/");
  });
});

describe("hubTiles — copy", () => {
  it("uses CONTEXT.md headlines for DE hub tiles", () => {
    const [dev, coaching] = hubTiles("de");
    expect(dev.headline).toBe("App & Web entwickeln lassen");
    expect(coaching.headline).toBe("Mit KI programmieren lernen");
  });

  it("uses CONTEXT.md headlines for EN hub tiles", () => {
    const [dev, coaching] = hubTiles("en");
    expect(dev.headline).toBe("App & web development");
    expect(coaching.headline).toBe("Learn to build with AI");
  });
});
