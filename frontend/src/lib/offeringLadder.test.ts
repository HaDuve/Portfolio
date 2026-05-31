import { describe, it, expect } from "vitest";
import { offeringLadder } from "./offeringLadder";
import type { Locale } from "./i18n";

describe("offeringLadder", () => {
  it.each<Locale>(["de", "en"])(
    "surfaces 60 €/h and three ab baselines for %s",
    (locale) => {
      const ladder = offeringLadder(locale);
      expect(ladder.hourlyRate).toMatch(/60\s*€\/h/);
      expect(ladder.tiers).toHaveLength(3);
      const prices = ladder.tiers.map((t) => t.price);
      expect(prices[0]).toMatch(/1[,.]?200/);
      expect(prices[1]).toMatch(/4[,.]?800/);
      expect(prices[2]).toMatch(/1[,.]?200/);
    },
  );

  it.each<Locale>(["de", "en"])(
    "includes a timeframe per tier and a type-shift note for %s",
    (locale) => {
      const ladder = offeringLadder(locale);
      for (const tier of ladder.tiers) {
        expect(tier.timeframe.trim().length).toBeGreaterThan(0);
      }
      expect(ladder.typeShiftNote.trim().length).toBeGreaterThan(0);
    },
  );

  it("does not mention the dropped day rate in DE or EN copy", () => {
    for (const locale of ["de", "en"] as const) {
      const serialized = JSON.stringify(offeringLadder(locale));
      expect(serialized).not.toMatch(/240\s*€/i);
      expect(serialized).not.toMatch(/Tag \(4\s*h\)/i);
      expect(serialized).not.toMatch(/day \(4\s*h\)/i);
    }
  });

  it("labels DE tiers with ab baselines and German timeframes", () => {
    const ladder = offeringLadder("de");
    expect(ladder.tiers[0].price).toMatch(/^ab\s/i);
    expect(ladder.tiers[1].price).toMatch(/^ab\s/i);
    expect(ladder.tiers[2].price).toMatch(/Monat/i);
    expect(ladder.typeShiftNote).toMatch(/App|Web|Server/i);
  });

  it("uses plain German for the DE MVP tier label", () => {
    const mvp = offeringLadder("de").tiers.find((t) => t.id === "mvp");
    expect(mvp?.label).toBe("MVP / produktionsreif");
    expect(mvp?.label).not.toMatch(/launch-ready/i);
  });
});
