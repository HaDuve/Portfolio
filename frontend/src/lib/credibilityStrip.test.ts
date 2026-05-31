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
    const items = credibilityStripItems("de");
    const byId = Object.fromEntries(items.map((item) => [item.id, item]));

    expect(byId["wikifolio"].href).toBe(
      "https://apps.apple.com/de/app/wikifolio/id6476974452",
    );
    expect(byId["budget-for-nomads"].href).toBe(
      "https://apps.apple.com/app/budget-for-nomads/id6446042796",
    );
    expect(byId["github"].href).toBe("https://github.com/HaDuve");
    expect(byId["location"].href).toBeUndefined();
    expect(byId["senior"].href).toBeUndefined();
  });

  it("labels DE proof with App Store and DACH context", () => {
    const byId = Object.fromEntries(
      credibilityStripItems("de").map((item) => [item.id, item.label]),
    );
    expect(byId["wikifolio"]).toContain("wikifolio");
    expect(byId["budget-for-nomads"]).toMatch(/Budget for Nomads|App Store/i);
    expect(byId["location"]).toMatch(/Bremen|DACH/);
    expect(byId["senior"]).toMatch(/Senior|Jahre/);
  });

  it("labels EN proof in plain English", () => {
    const byId = Object.fromEntries(
      credibilityStripItems("en").map((item) => [item.id, item.label]),
    );
    expect(byId["wikifolio"]).toContain("wikifolio");
    expect(byId["budget-for-nomads"]).toMatch(/Budget for Nomads|App Store/i);
    expect(byId["location"]).toMatch(/Bremen|DACH/);
    expect(byId["senior"]).toMatch(/Senior|years/i);
  });
});
