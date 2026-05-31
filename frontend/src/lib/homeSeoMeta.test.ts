import { describe, expect, it } from "vitest";
import { homePrimaryKeyword, homeSeoMeta } from "./homeSeoMeta";

describe("homeSeoMeta", () => {
  it("leads home title with brand name until primary keyword is validated", () => {
    expect(homePrimaryKeyword).toBeNull();

    for (const locale of ["de", "en"] as const) {
      expect(homeSeoMeta(locale).title.startsWith("Hannes Duve")).toBe(true);
    }
  });

  it("keeps a non-empty description for each locale", () => {
    for (const locale of ["de", "en"] as const) {
      expect(homeSeoMeta(locale).description.trim().length).toBeGreaterThan(40);
    }
  });
});
