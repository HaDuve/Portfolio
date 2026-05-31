import { describe, it, expect } from "vitest";
import { DESIGN_TOKENS } from "./designTokens";

const LIGHT = {
  bg: "oklch(97.5% 0.003 85)",
  surface: "oklch(99% 0.002 85)",
  fg: "oklch(18% 0.012 50)",
  muted: "oklch(46% 0.014 70)",
  border: "oklch(88% 0.006 85)",
  accent: "oklch(52% 0.20 275)",
} as const;

const DARK = {
  bg: "oklch(16% 0.012 50)",
  surface: "oklch(20% 0.014 50)",
  fg: "oklch(96% 0.004 85)",
  muted: "oklch(66% 0.012 70)",
  border: "oklch(28% 0.012 50)",
  accent: "oklch(72% 0.14 275)",
} as const;

describe("designTokens", () => {
  it("defines the full light palette as OKLch from the design system", () => {
    expect(DESIGN_TOKENS.light).toEqual(LIGHT);
  });

  it("defines the full dark palette as OKLch from the design system", () => {
    expect(DESIGN_TOKENS.dark).toEqual(DARK);
  });
});
