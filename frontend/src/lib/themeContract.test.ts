import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { DESIGN_TOKENS } from "./designTokens";

const globalsCss = readFileSync(
  path.join(__dirname, "../app/globals.css"),
  "utf8",
);

describe("theme contract in globals.css", () => {
  it("defines canonical OKLch light tokens on :root", () => {
    for (const [name, value] of Object.entries(DESIGN_TOKENS.light)) {
      expect(globalsCss).toContain(`--${name}: ${value}`);
    }
  });

  it("defines canonical OKLch dark tokens on .dark", () => {
    for (const [name, value] of Object.entries(DESIGN_TOKENS.dark)) {
      expect(globalsCss).toContain(`--${name}: ${value}`);
    }
  });

  it("maps semantic colors through @theme to canonical tokens", () => {
    expect(globalsCss).toContain("--color-background: var(--bg)");
    expect(globalsCss).toContain("--color-foreground: var(--fg)");
    expect(globalsCss).toContain("--color-card: var(--surface)");
    expect(globalsCss).toContain("--color-accent: var(--accent)");
  });

  it("does not use legacy hex palette values", () => {
    expect(globalsCss).not.toMatch(/#f5f5f4|#0c0a09|#4f46e5|#a5b4fc/);
  });
});
