import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

const heroSource = readFileSync(
  path.join(__dirname, "../components/Hero.tsx"),
  "utf8",
);
const stripSource = readFileSync(
  path.join(__dirname, "../components/CredibilityStrip.tsx"),
  "utf8",
);

describe("home hero responsive layout contract", () => {
  it("clips overflow at the hero section boundary", () => {
    expect(heroSource).toMatch(/id="hero"[\s\S]*overflow-hidden/);
  });

  it("constrains hero copy and media with min-w-0 and max-width caps", () => {
    expect(heroSource).toContain("min-w-0");
    expect(heroSource).toContain("max-w-6xl");
    expect(heroSource).toMatch(/max-w-\[38rem\]/);
    expect(heroSource).toMatch(/max-w-\[420px\]/);
  });

  it("sizes proof shots with min() so they shrink on narrow viewports", () => {
    expect(heroSource).toMatch(/w-\[min\(/);
  });

  it("wraps credibility strip items instead of forcing horizontal scroll", () => {
    expect(stripSource).toContain("flex-wrap");
    expect(stripSource).toContain("max-w-6xl");
  });
});
