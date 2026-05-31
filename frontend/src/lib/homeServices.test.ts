import { describe, it, expect } from "vitest";
import { homeServiceCards, type HomeServiceCard } from "./homeServices";
import type { Locale } from "./i18n";

const BANNED_ANTI_VIBE_PHRASES = [
  /kein Vibe Coding/i,
  /not vibe coding/i,
  /weggeworfen/i,
];

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
    "avoids anti–vibe-coding framing in %s service copy",
    (locale) => {
      const copy = homeServiceCards(locale)
        .map((c) => `${c.title} ${c.description}`)
        .join(" ");
      for (const phrase of BANNED_ANTI_VIBE_PHRASES) {
        expect(copy).not.toMatch(phrase);
      }
    },
  );

  it("uses plain-German service titles in DE", () => {
    const titles = homeServiceCards("de").map((c) => c.title);
    expect(titles).toEqual([
      "Websites & Webapps",
      "Mobile Apps",
      "Server & Cloud",
      "Qualität & Betrieb",
    ]);
  });

  it("uses stable card ids across locales", () => {
    const ids = (cards: HomeServiceCard[]) => cards.map((c) => c.id);
    expect(ids(homeServiceCards("de"))).toEqual(ids(homeServiceCards("en")));
  });
});
