import { describe, it, expect } from "vitest";
import { credibilityStripItems } from "./credibilityStrip";

describe("credibilityStripItems", () => {
  it.each(["de", "en"] as const)("returns five real proof items for %s", (locale) => {
    const items = credibilityStripItems(locale);
    expect(items).toHaveLength(5);
    expect(items.map((item) => item.id)).toEqual([
      "wikifolio",
      "budget-for-nomads",
      "github",
      "location",
      "senior",
    ]);
  });

  it("links shipped products and GitHub to real URLs", () => {
    const de = Object.fromEntries(
      credibilityStripItems("de").map((item) => [item.id, item]),
    );
    const en = Object.fromEntries(
      credibilityStripItems("en").map((item) => [item.id, item]),
    );

    expect(de["wikifolio"].href).toBe(
      "https://apps.apple.com/de/app/wikifolio/id6476974452",
    );
    expect(en["wikifolio"].href).toBe(
      "https://apps.apple.com/app/wikifolio/id6476974452",
    );
    expect(de["budget-for-nomads"].href).toBe(
      "https://apps.apple.com/app/budget-for-nomads/id6446042796",
    );
    expect(de["github"].href).toBe("https://github.com/HaDuve");
    expect(de["location"].href).toBeUndefined();
    expect(de["senior"].href).toBeUndefined();
  });

  it("uses factual senior label without unverified numeric claims", () => {
    for (const locale of ["de", "en"] as const) {
      const senior = credibilityStripItems(locale).find((i) => i.id === "senior");
      expect(senior?.label).toMatch(/Senior freelancer/i);
      expect(senior?.label).not.toMatch(/\d/);
    }
  });

  it("labels DE proof with App Store and DACH context", () => {
    const byId = Object.fromEntries(
      credibilityStripItems("de").map((item) => [item.id, item.label]),
    );
    expect(byId["wikifolio"]).toBe("wikifolio · live im App Store");
    expect(byId["budget-for-nomads"]).toMatch(/Budget for Nomads|App Store/i);
    expect(byId["location"]).toMatch(/Bremen|DACH/);
  });

  it("labels EN proof in plain English", () => {
    const byId = Object.fromEntries(
      credibilityStripItems("en").map((item) => [item.id, item.label]),
    );
    expect(byId["wikifolio"]).toBe("wikifolio · shipped");
    expect(byId["budget-for-nomads"]).toMatch(/Budget for Nomads|App Store/i);
    expect(byId["location"]).toMatch(/Bremen|DACH/);
  });
});
