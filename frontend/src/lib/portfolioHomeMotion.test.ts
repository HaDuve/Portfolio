import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { resolveMotionFeatures } from "./motionBudget";
import { lenisUsesMotionFrameLoop } from "./lenisMotionIntegration";

const homeSource = readFileSync(
  path.join(__dirname, "../components/PortfolioHome.tsx"),
  "utf8",
);
const lenisSource = readFileSync(
  path.join(__dirname, "../components/LenisProvider.tsx"),
  "utf8",
);

describe("PortfolioHome motion guardrails", () => {
  it("enables Lenis and scroll reveals together via resolveMotionFeatures", () => {
    const motion = resolveMotionFeatures(false, {});
    expect(motion.smoothScroll).toBe(true);
    expect(motion.scrollReveals).toBe(true);
    expect(lenisUsesMotionFrameLoop()).toBe(true);
  });

  it("wires Lenis through Motion frame integration for whileInView", () => {
    expect(lenisSource).toMatch(/frame\.update/);
    expect(lenisSource).toMatch(/ReactLenis/);
    expect(lenisSource).toMatch(/createLenisOptionsForMotion/);
  });

  it("gates section headings with motion.scrollReveals", () => {
    expect(homeSource).toMatch(/scrollReveal=\{motion\.scrollReveals\}/);
  });

  it("persists intro playback once per session via sessionStorage helpers", () => {
    expect(homeSource).toMatch(/readIntroPlayedThisSession/);
    expect(homeSource).toMatch(/markIntroPlayedThisSession/);
    expect(homeSource).not.toMatch(/portfolioIntroBlockedUntil/);
    expect(homeSource).not.toMatch(/localStorage/);
  });

  it("loads IntroSequence only when the intro will play", () => {
    expect(homeSource).toMatch(/dynamic\(/);
    expect(homeSource).toMatch(/IntroSequence/);
    expect(homeSource).toMatch(/showIntro/);
  });

  it("does not wire HeroFan or Embla on the home page", () => {
    expect(homeSource).not.toMatch(/HeroFan/);
    expect(homeSource).not.toMatch(/embla/i);
    expect(homeSource).not.toMatch(/ProjectMediaCarousel/);
  });
});
