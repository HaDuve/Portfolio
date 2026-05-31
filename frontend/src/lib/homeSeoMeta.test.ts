import { describe, expect, it } from "vitest";
import { homePrimaryKeyword, homeSeoMeta } from "./homeSeoMeta";

describe("homeSeoMeta", () => {
  it("leads home title with owner-validated primary keyword", () => {
    expect(homePrimaryKeyword.de).toBe("App Entwickler");
    expect(homePrimaryKeyword.en).toBe("App Developer");
    expect(homeSeoMeta("de").title).toBe("App Entwickler — Hannes Duve (DACH)");
    expect(homeSeoMeta("en").title).toBe(
      "App Developer — Hannes Duve (DACH & EU)",
    );
  });

  it("uses keyword-first titles, not interim brand-first pattern", () => {
    for (const locale of ["de", "en"] as const) {
      expect(homeSeoMeta(locale).title.startsWith("Hannes Duve ·")).toBe(
        false,
      );
    }
  });

  it("weaves validated secondary terms into DE meta description", () => {
    const description = homeSeoMeta("de").description.toLowerCase();
    expect(description).toMatch(/app entwickler/);
    expect(description).toMatch(/kosten/);
    expect(description).toMatch(/eigene app erstellen/);
  });

  it("keeps a non-empty description for each locale", () => {
    for (const locale of ["de", "en"] as const) {
      expect(homeSeoMeta(locale).description.trim().length).toBeGreaterThan(40);
    }
  });
});
