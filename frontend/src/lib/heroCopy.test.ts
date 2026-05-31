import { describe, it, expect } from "vitest";
import { heroCopy } from "./heroCopy";

const BANNED_WORDS = ["weggeworfen", "trägt", "tragen"] as const;

function assertNoBannedWords(text: string) {
  for (const word of BANNED_WORDS) {
    expect(text.toLowerCase()).not.toContain(word);
  }
}

describe("heroCopy — DE", () => {
  it("uses the voice.md headline", () => {
    expect(heroCopy("de").headline).toBe(
      "Software, die hält, was sie verspricht.",
    );
  });

  it("uses the voice.md subhead and dual CTAs", () => {
    const hero = heroCopy("de");
    expect(hero.subhead).toBe(
      "Ich baue stabile Apps, Websites und Server für dein Unternehmen — oder zeige dir 1:1, wie du selbst mit Cursor oder Claude baust. Hohe Qualität, direkt und persönlich.",
    );
    expect(hero.ctaFreelance).toBe("Projekt anfragen");
    expect(hero.ctaCoaching).toBe("Coaching buchen");
  });

  it("avoids banned wording in all DE copy", () => {
    const hero = heroCopy("de");
    for (const text of [hero.headline, hero.subhead, hero.ctaFreelance, hero.ctaCoaching]) {
      assertNoBannedWords(text);
    }
  });
});

describe("heroCopy — EN", () => {
  it("mirrors DE voice with EN headline and subhead", () => {
    const hero = heroCopy("en");
    expect(hero.headline).toBe("Software that delivers on its promise.");
    expect(hero.subhead).toContain("Cursor or Claude");
    expect(hero.ctaFreelance).toBe("Request a project");
    expect(hero.ctaCoaching).toBe("Book coaching");
  });

  it("avoids banned wording in all EN copy", () => {
    const hero = heroCopy("en");
    for (const text of [hero.headline, hero.subhead, hero.ctaFreelance, hero.ctaCoaching]) {
      assertNoBannedWords(text);
    }
  });
});

describe("heroCopy — scheduling placements", () => {
  it.each(["de", "en"] as const)(
    "maps dual CTAs to offering-aware placements in %s",
    (locale) => {
      const hero = heroCopy(locale);
      expect(hero.ctaFreelancePlacement).toBe("hero-freelance");
      expect(hero.ctaCoachingPlacement).toBe("hero-coaching");
    },
  );
});
