import { describe, it, expect } from "vitest";
import { homeServiceCards, type HomeServiceCard } from "./homeServices";
import type { Locale } from "./i18n";

const QUALITY_TONE_ANCHOR: Record<Locale, string> = {
  en: "real engineering — not vibe coding.",
  de: "echtes Engineering, kein Vibe Coding.",
};

function sentenceCount(text: string): number {
  const trimmed = text.trim();
  const matches = trimmed.match(/[.!?](?=\s|$)/g);
  return matches?.length ?? 0;
}

describe("homeServiceCards", () => {
  it("returns exactly four service cards", () => {
    expect(homeServiceCards("de")).toHaveLength(4);
    expect(homeServiceCards("en")).toHaveLength(4);
  });

  it.each<Locale>(["de", "en"])(
    "keeps each %s card description to one sentence",
    (locale) => {
      for (const card of homeServiceCards(locale)) {
        expect(card.description).not.toMatch(/\n/);
        expect(sentenceCount(card.description)).toBe(1);
      }
    },
  );

  it.each<Locale>(["de", "en"])(
    "anchors Quality & ops with the tone line in %s",
    (locale) => {
      const quality = homeServiceCards(locale).find((c) => c.id === "quality");
      expect(quality?.description).toContain(QUALITY_TONE_ANCHOR[locale]);
    },
  );

  it("uses stable card ids across locales", () => {
    const ids = (cards: HomeServiceCard[]) => cards.map((c) => c.id);
    expect(ids(homeServiceCards("de"))).toEqual(ids(homeServiceCards("en")));
  });
});
