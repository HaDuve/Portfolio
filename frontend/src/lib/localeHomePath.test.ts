import { describe, it, expect } from "vitest";
import { isLocaleHomePath, normalizeContentPath } from "./localeHomePath";

describe("normalizeContentPath", () => {
  it("ensures trailing slash on locale paths", () => {
    expect(normalizeContentPath("/de")).toBe("/de/");
    expect(normalizeContentPath("/en/")).toBe("/en/");
  });
});

describe("isLocaleHomePath", () => {
  it("is true only for locale roots", () => {
    expect(isLocaleHomePath("/de/")).toBe(true);
    expect(isLocaleHomePath("/en")).toBe(true);
    expect(isLocaleHomePath("/de/app-entwickeln-freelancer/")).toBe(false);
    expect(isLocaleHomePath("/en/vibe-coding-coach/")).toBe(false);
  });
});
