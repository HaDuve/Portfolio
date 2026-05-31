import { describe, it, expect } from "vitest";
import { heroProofShots } from "./heroProofShots";

describe("heroProofShots", () => {
  it.each(["de", "en"] as const)(
    "returns phone and browser shots from shipped projects in %s",
    (locale) => {
      const shots = heroProofShots(locale);
      expect(shots).toHaveLength(2);
      expect(shots[0].variant).toBe("phone");
      expect(shots[0].src).toBe("/assets/Frame%20294.png");
      expect(shots[1].variant).toBe("browser");
      expect(shots[1].src).toBe("/assets/Wikifolio.jpg");
    },
  );

  it("provides localized alt text for each shot", () => {
    const de = heroProofShots("de");
    const en = heroProofShots("en");
    expect(de[0].alt).toContain("Budget for Nomads");
    expect(de[1].alt).toContain("wikifolio");
    expect(en[0].alt).toContain("Budget for Nomads");
    expect(en[1].alt).toContain("wikifolio");
  });
});
