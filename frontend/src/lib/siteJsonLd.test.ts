import { describe, it, expect } from "vitest";
import { buildSiteJsonLdGraph } from "./siteJsonLd";
import type { Locale } from "./i18n";

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
    "lists ladder baselines and coaching in EUR for %s",
    (locale) => {
      const graph = buildSiteJsonLdGraph(locale);
      const prices = offerPrices(graph);
      expect(prices).toContain(60);
      expect(prices.filter((p) => p === 1200).length).toBeGreaterThanOrEqual(2);
      expect(prices).toContain(4800);
      for (const offer of graph.flatMap((n) =>
        n["@type"] === "Service" ? (n.offers as { priceCurrency: string }[]) : [],
      )) {
        expect(offer.priceCurrency).toBe("EUR");
      }
    },
  );
});

describe("buildSiteJsonLdGraph — graph integrity", () => {
  it.each<Locale>(["de", "en"])("uses unique @id values for %s", (locale) => {
    const ids = buildSiteJsonLdGraph(locale)
      .map((n) => n["@id"])
      .filter(Boolean);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("does not emit a legacy single #service node", () => {
    const graph = buildSiteJsonLdGraph("de");
    expect(nodeById(graph, "https://hannesduve.com/#service")).toBeUndefined();
  });
});
