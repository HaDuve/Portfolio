import { describe, it, expect } from "vitest";
import { buildSiteJsonLdGraph, collectSiteJsonLdIds } from "./siteJsonLd";
import type { Locale } from "./i18n";
import { offeringBaselineEur } from "./offeringLadder";

function nodeById(graph: ReturnType<typeof buildSiteJsonLdGraph>, id: string) {
  return graph.find((n) => n["@id"] === id);
}

function nodesByType(
  graph: ReturnType<typeof buildSiteJsonLdGraph>,
  type: string,
) {
  return graph.filter((n) => n["@type"] === type);
}

describe("buildSiteJsonLdGraph — Person", () => {
  it("uses a German jobTitle for DE", () => {
    const person = nodeById(buildSiteJsonLdGraph("de"), "https://hannesduve.com/#person");
    expect(person?.["@type"]).toBe("Person");
    expect(person?.name).toBe("Hannes Duve");
    expect(person?.jobTitle).toMatch(/Entwickler/);
  });

  it("uses an English jobTitle for EN", () => {
    const person = nodeById(buildSiteJsonLdGraph("en"), "https://hannesduve.com/#person");
    expect(person?.jobTitle).toMatch(/Developer/);
  });

  it.each<Locale>(["de", "en"])(
    "sets inLanguage on Person for %s",
    (locale) => {
      const person = nodeById(
        buildSiteJsonLdGraph(locale),
        "https://hannesduve.com/#person",
      );
      expect(person?.inLanguage).toBe(locale === "en" ? "en" : "de-DE");
    },
  );
});

describe("buildSiteJsonLdGraph — Service", () => {
  it.each<Locale>(["de", "en"])(
    "emits freelance and coaching services with inLanguage for %s",
    (locale) => {
      const graph = buildSiteJsonLdGraph(locale);
      const services = nodesByType(graph, "Service");
      expect(services).toHaveLength(2);
      const lang = locale === "en" ? "en" : "de-DE";
      for (const service of services) {
        expect(service.inLanguage).toBe(lang);
      }
      expect(
        nodeById(graph, "https://hannesduve.com/#service-freelance")?.name,
      ).toBeTruthy();
      expect(
        nodeById(graph, "https://hannesduve.com/#service-coaching")?.name,
      ).toBeTruthy();
    },
  );
});

describe("buildSiteJsonLdGraph — Offer", () => {
  function offerPrices(graph: ReturnType<typeof buildSiteJsonLdGraph>): number[] {
    const offers = graph.flatMap((n) =>
      n["@type"] === "Service" ? (n.offers as { price: string }[]) : [],
    );
    return offers.map((o) => Number(o.price));
  }

  it.each<Locale>(["de", "en"])(
    "uses offeringBaselineEur for all service offers in %s",
    (locale) => {
      const graph = buildSiteJsonLdGraph(locale);
      const prices = offerPrices(graph).sort((a, b) => a - b);
      const expected = [
        offeringBaselineEur.hourly,
        offeringBaselineEur.coachingSession,
        offeringBaselineEur.tiers["micro-mvp"],
        offeringBaselineEur.tiers.ongoing,
        offeringBaselineEur.tiers.mvp,
      ].sort((a, b) => a - b);
      expect(prices).toEqual(expected);
      for (const offer of graph.flatMap((n) =>
        n["@type"] === "Service" ? (n.offers as { priceCurrency: string }[]) : [],
      )) {
        expect(offer.priceCurrency).toBe("EUR");
      }
    },
  );

  it("uses PriceSpecification for coaching (no MIN unitCode)", () => {
    const coaching = nodeById(
      buildSiteJsonLdGraph("de"),
      "https://hannesduve.com/#service-coaching",
    );
    const offer = (coaching?.offers as { priceSpecification: Record<string, unknown> }[])[0];
    expect(offer.priceSpecification["@type"]).toBe("PriceSpecification");
    expect(offer.priceSpecification.unitCode).toBeUndefined();
    expect(offer.priceSpecification.price).toBe(
      String(offeringBaselineEur.coachingSession),
    );
  });
});

describe("buildSiteJsonLdGraph — graph integrity", () => {
  it.each<Locale>(["de", "en"])(
    "uses unique @id values including nested offers for %s",
    (locale) => {
      const ids = collectSiteJsonLdIds(buildSiteJsonLdGraph(locale));
      expect(new Set(ids).size).toBe(ids.length);
    },
  );

  it("does not emit a legacy single #service node", () => {
    const graph = buildSiteJsonLdGraph("de");
    expect(nodeById(graph, "https://hannesduve.com/#service")).toBeUndefined();
  });
});
