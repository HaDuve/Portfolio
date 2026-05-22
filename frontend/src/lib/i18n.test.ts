import { describe, it, expect } from "vitest";
import { getAlternateLocalePath, devLandingPath } from "./i18n";

describe("getAlternateLocalePath — coaching page pair", () => {
  it("maps DE coaching slug to EN", () => {
    expect(
      getAlternateLocalePath("/de/programmieren-lernen-mit-ki/", "en"),
    ).toBe("/en/vibe-coding-coach/");
  });

  it("maps EN coaching slug to DE", () => {
    expect(
      getAlternateLocalePath("/en/vibe-coding-coach/", "de"),
    ).toBe("/de/programmieren-lernen-mit-ki/");
  });
});

describe("getAlternateLocalePath — app dev page pair", () => {
  it("maps DE app dev slug to EN", () => {
    expect(
      getAlternateLocalePath("/de/app-entwickeln-freelancer/", "en"),
    ).toBe("/en/freelance-app-development/");
  });

  it("maps EN app dev slug to DE", () => {
    expect(
      getAlternateLocalePath("/en/freelance-app-development/", "de"),
    ).toBe("/de/app-entwickeln-freelancer/");
  });
});

describe("getAlternateLocalePath — legal pages", () => {
  it("maps DE datenschutz to EN privacy", () => {
    expect(getAlternateLocalePath("/de/datenschutz/", "en")).toBe(
      "/en/privacy/",
    );
  });

  it("maps EN privacy to DE datenschutz", () => {
    expect(getAlternateLocalePath("/en/privacy/", "de")).toBe(
      "/de/datenschutz/",
    );
  });
});

describe("getAlternateLocalePath — root paths", () => {
  it("maps /de/ root to /en/", () => {
    expect(getAlternateLocalePath("/de/", "en")).toBe("/en/");
  });

  it("maps /en/ root to /de/", () => {
    expect(getAlternateLocalePath("/en/", "de")).toBe("/de/");
  });
});

describe("getAlternateLocalePath — unknown slug", () => {
  it("passes unknown slug through to target locale", () => {
    expect(getAlternateLocalePath("/de/unbekannte-seite/", "en")).toBe(
      "/en/unbekannte-seite/",
    );
  });
});

describe("getAlternateLocalePath — no leading locale", () => {
  it("falls back to target locale root when path has no locale prefix", () => {
    expect(getAlternateLocalePath("/some-path/", "de")).toBe("/de/");
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
