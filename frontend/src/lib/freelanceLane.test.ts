import { describe, it, expect } from "vitest";
import { freelanceLaneSection } from "./freelanceLane";
import { devLandingPath } from "./i18n";
import type { Locale } from "./i18n";

describe("freelanceLaneSection", () => {
  it.each<Locale>(["de", "en"])(
    "exposes lane-freelance scheduling placement for %s",
    (locale) => {
      expect(freelanceLaneSection(locale).schedulingPlacement).toBe(
        "lane-freelance",
      );
    },
  );

  it("uses Projekt anfragen as the DE lane CTA label", () => {
    expect(freelanceLaneSection("de").ctaLabel).toBe("Projekt anfragen");
  });

  it("links the more arrow to the freelance landing page per locale", () => {
    for (const locale of ["de", "en"] as const) {
      const section = freelanceLaneSection(locale);
      expect(section.moreHref).toBe(devLandingPath(locale));
      expect(section.moreLabel).toMatch(/→/);
    }
  });

  it("provides section heading copy in both locales", () => {
    for (const locale of ["de", "en"] as const) {
      const { eyebrow, title, description } = freelanceLaneSection(locale);
      expect(eyebrow.trim().length).toBeGreaterThan(0);
      expect(title.trim().length).toBeGreaterThan(0);
      expect(description.trim().length).toBeGreaterThan(0);
    }
  });
});
