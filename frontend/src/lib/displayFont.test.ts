import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

const rootLayout = readFileSync(
  path.join(__dirname, "../app/layout.tsx"),
  "utf8",
);

const globalsCss = readFileSync(
  path.join(__dirname, "../app/globals.css"),
  "utf8",
);

describe("display font loading", () => {
  it("loads Instrument Serif via next/font without blocking Google Fonts imports", () => {
    expect(rootLayout).toContain('from "next/font/google"');
    expect(rootLayout).toContain("Instrument_Serif");
    expect(rootLayout).toContain("--font-display-serif");
    expect(rootLayout).not.toMatch(/fonts\.googleapis\.com|@import url\(/);
  });

  it("does not import Google Fonts from globals.css", () => {
    expect(globalsCss).not.toMatch(/fonts\.googleapis\.com|@import url\(/);
  });
});
