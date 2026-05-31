import { describe, it, expect } from "vitest";
import { buildSiteJsonLdGraph } from "./siteJsonLd";
import { buildFaqJsonLdPayload } from "./faqJsonLd";
import { coachingFaq } from "@/data/programmierenLernenMitKi";
import type { Locale } from "./i18n";

/** Structural checks aligned with schema.org / Rich Results expectations. */
function assertValidSiteGraph(locale: Locale) {
  const payload = {
    "@context": "https://schema.org",
    "@graph": buildSiteJsonLdGraph(locale),
  };
  const serialized = JSON.stringify(payload);
  expect(() => JSON.parse(serialized)).not.toThrow();
  expect(serialized).toContain('"@type":"Person"');
  expect(serialized).toContain('"@type":"Service"');
  expect(serialized).toContain('"priceCurrency":"EUR"');
  expect(serialized).not.toContain('"unitCode":"MIN"');
}

describe("JSON-LD structural validation", () => {
  it.each<Locale>(["de", "en"])(
    "emits a parseable site @graph without discouraged unit codes for %s",
    (locale) => {
      assertValidSiteGraph(locale);
    },
  );

  it.each<Locale>(["de", "en"])(
    "emits a parseable FAQPage payload for %s",
    (locale) => {
      const items = coachingFaq[locale].slice(0, 2);
      const payload = buildFaqJsonLdPayload(items, locale);
      const serialized = JSON.stringify(payload);
      expect(() => JSON.parse(serialized)).not.toThrow();
      expect(payload["@type"]).toBe("FAQPage");
      expect(payload.inLanguage).toBe(locale === "en" ? "en" : "de-DE");
    },
  );
});
