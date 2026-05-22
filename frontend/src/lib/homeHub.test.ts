import { describe, it, expect } from "vitest";
import { hubTiles } from "./homeHub";

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
