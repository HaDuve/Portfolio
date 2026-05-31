import { describe, it, expect } from "vitest";
import { DESIGN_TOKENS } from "./designTokens";

const CANONICAL_TOKEN_KEYS = [
  "bg",
  "surface",
  "fg",
  "muted",
  "border",
  "accent",
] as const;

describe("designTokens", () => {
  it("exposes every canonical token for light and dark", () => {
    for (const mode of ["light", "dark"] as const) {
      for (const key of CANONICAL_TOKEN_KEYS) {
        expect(DESIGN_TOKENS[mode][key]).toBeDefined();
      }
    }
  });

  it("uses OKLch for all token values", () => {
    for (const palette of Object.values(DESIGN_TOKENS)) {
      for (const value of Object.values(palette)) {
        expect(value).toMatch(/^oklch\(/);
      }
    }
  });

  it("uses a single indigo accent (hue 275) in both modes", () => {
    expect(DESIGN_TOKENS.light.accent).toMatch(/275\)/);
    expect(DESIGN_TOKENS.dark.accent).toMatch(/275\)/);
  });
});
