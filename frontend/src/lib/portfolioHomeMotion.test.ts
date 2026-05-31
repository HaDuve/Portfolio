import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

const homeSource = readFileSync(
  path.join(__dirname, "../components/PortfolioHome.tsx"),
  "utf8",
);

describe("PortfolioHome motion guardrails", () => {
  it("enables Lenis from resolveMotionFeatures instead of hard-disabling it", () => {
    expect(homeSource).toMatch(/resolveMotionFeatures/);
    expect(homeSource).toMatch(/enabled=\{motion\.smoothScroll\}/);
    expect(homeSource).not.toMatch(/LenisProvider enabled=\{false\}/);
  });

  it("persists intro playback once per session via sessionStorage helpers", () => {
    expect(homeSource).toMatch(/readIntroPlayedThisSession/);
    expect(homeSource).toMatch(/markIntroPlayedThisSession/);
    expect(homeSource).not.toMatch(/portfolioIntroBlockedUntil/);
    expect(homeSource).not.toMatch(/localStorage/);
  });

  it("does not wire HeroFan or Embla on the home page", () => {
    expect(homeSource).not.toMatch(/HeroFan/);
    expect(homeSource).not.toMatch(/embla/i);
    expect(homeSource).not.toMatch(/ProjectMediaCarousel/);
  });

  it("uses scroll reveals for home section headings", () => {
    expect(homeSource).toMatch(/SectionHeadingReveal/);
  });
});
