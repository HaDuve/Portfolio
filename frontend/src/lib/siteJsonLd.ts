import profile from "@/data/profile.json";
import { coachingLandingPath, devLandingPath, type Locale } from "./i18n";
import { offeringLadder, type OfferingTierId } from "./offeringLadder";
import type { Profile } from "@/types/content";

export const SITE_JSON_LD_BASE = "https://hannesduve.com";

export type JsonLdGraphNode = Record<string, unknown>;

const TIER_BASE_PRICE_EUR: Record<OfferingTierId, number> = {
  "micro-mvp": 1200,
  mvp: 4800,
  ongoing: 1200,
};

const HOURLY_RATE_EUR = 60;
const COACHING_SESSION_EUR = 60;

function schemaLanguage(locale: Locale): string {
  return locale === "en" ? "en" : "de-DE";
}

function personJobTitle(locale: Locale): string {
  return locale === "en"
    ? "Freelance Senior Full-Stack and Mobile Developer"
    : "Freelance Senior Full-Stack- und Mobile-Entwickler";
}

function freelanceServiceCopy(locale: Locale) {
  const isEn = locale === "en";
  return {
    name: isEn ? "Freelance app development" : "Freelance App-Entwicklung",
    description: isEn
      ? "Websites, web applications, mobile apps, and full-stack systems for SMEs in the DACH region."
      : "Websites, Webanwendungen, Mobile Apps und Full-Stack-Systeme für KMU im DACH-Raum.",
    types: isEn
      ? [
          "Web development",
          "Mobile app development",
          "Backend development",
          "Full-stack development",
        ]
      : [
          "Webentwicklung",
          "Mobile App Entwicklung",
          "Backend-Entwicklung",
          "Full-Stack-Entwicklung",
        ],
  };
}

function coachingServiceCopy(locale: Locale) {
  const isEn = locale === "en";
  return {
    name: isEn ? "AI coding coaching" : "KI-Programmier-Coaching",
    description: isEn
      ? "1:1 coaching on your project with Cursor, Claude, and a repeatable workflow."
      : "1:1 Coaching an deinem Projekt mit Cursor, Claude und einem wiederholbaren Workflow.",
  };
}

function hourlyOffer(locale: Locale): JsonLdGraphNode {
  const ladder = offeringLadder(locale);
  return {
    "@type": "Offer",
    "@id": `${SITE_JSON_LD_BASE}/#offer-hourly`,
    name: ladder.hourlyRate,
    price: String(HOURLY_RATE_EUR),
    priceCurrency: "EUR",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: String(HOURLY_RATE_EUR),
      priceCurrency: "EUR",
      unitCode: "HUR",
      name: ladder.hourlyRate,
    },
  };
}

function tierOffer(
  locale: Locale,
  tierId: OfferingTierId,
  serviceId: string,
): JsonLdGraphNode {
  const tier = offeringLadder(locale).tiers.find((t) => t.id === tierId)!;
  const price = TIER_BASE_PRICE_EUR[tierId];
  const isMonthly = tierId === "ongoing";
  return {
    "@type": "Offer",
    "@id": `${SITE_JSON_LD_BASE}/#offer-${tierId}`,
    name: tier.label,
    price: String(price),
    priceCurrency: "EUR",
    itemOffered: { "@id": serviceId },
    priceSpecification: {
      "@type": isMonthly ? "UnitPriceSpecification" : "PriceSpecification",
      price: String(price),
      priceCurrency: "EUR",
      ...(isMonthly ? { unitCode: "MON", name: tier.price } : { minPrice: String(price), name: tier.price }),
    },
  };
}

function coachingSessionOffer(locale: Locale, serviceId: string): JsonLdGraphNode {
  const isEn = locale === "en";
  return {
    "@type": "Offer",
    "@id": `${SITE_JSON_LD_BASE}/#offer-coaching-session`,
    name: isEn ? "60 min coaching session" : "60-Min.-Coaching-Session",
    price: String(COACHING_SESSION_EUR),
    priceCurrency: "EUR",
    itemOffered: { "@id": serviceId },
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: String(COACHING_SESSION_EUR),
      priceCurrency: "EUR",
      unitCode: "MIN",
      referenceQuantity: {
        "@type": "QuantitativeValue",
        value: 60,
        unitCode: "MIN",
      },
      name: isEn ? "60 € / 60 min" : "60 € / 60 Min.",
    },
  };
}

export function buildSiteJsonLdGraph(locale: Locale): JsonLdGraphNode[] {
  const p = profile as Profile;
  const lang = schemaLanguage(locale);
  const freelanceId = `${SITE_JSON_LD_BASE}/#service-freelance`;
  const coachingId = `${SITE_JSON_LD_BASE}/#service-coaching`;
  const freelance = freelanceServiceCopy(locale);
  const coaching = coachingServiceCopy(locale);

  const websiteDesc =
    locale === "en"
      ? "Web and mobile apps (React Native/Expo) and full-stack development for SMEs in the DACH region."
      : "Web-Apps, Mobile Apps (React Native/Expo) und Full-Stack-Entwicklung für KMU im DACH-Raum.";

  return [
    {
      "@type": "Person",
      "@id": `${SITE_JSON_LD_BASE}/#person`,
      name: p.name,
      url: `${SITE_JSON_LD_BASE}/${locale}/`,
      image: `${SITE_JSON_LD_BASE}/profile.jpg`,
      jobTitle: personJobTitle(locale),
      knowsLanguage: ["de", "en"],
      sameAs: p.social.map((s) => s.href),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_JSON_LD_BASE}/#website`,
      url: `${SITE_JSON_LD_BASE}/${locale}/`,
      name: "Hannes Duve — Freelance Full-Stack & Mobile",
      description: websiteDesc,
      inLanguage: locale === "en" ? ["en", "de-DE"] : ["de-DE", "en"],
      publisher: { "@id": `${SITE_JSON_LD_BASE}/#person` },
    },
    {
      "@type": "Service",
      "@id": freelanceId,
      name: freelance.name,
      description: freelance.description,
      url: `${SITE_JSON_LD_BASE}${devLandingPath(locale)}`,
      inLanguage: lang,
      provider: { "@id": `${SITE_JSON_LD_BASE}/#person` },
      areaServed: [
        { "@type": "Country", name: "Germany" },
        { "@type": "Country", name: "Austria" },
        { "@type": "Country", name: "Switzerland" },
      ],
      serviceType: freelance.types,
      offers: [
        hourlyOffer(locale),
        tierOffer(locale, "micro-mvp", freelanceId),
        tierOffer(locale, "mvp", freelanceId),
        tierOffer(locale, "ongoing", freelanceId),
      ],
    },
    {
      "@type": "Service",
      "@id": coachingId,
      name: coaching.name,
      description: coaching.description,
      url: `${SITE_JSON_LD_BASE}${coachingLandingPath(locale)}`,
      inLanguage: lang,
      provider: { "@id": `${SITE_JSON_LD_BASE}/#person` },
      offers: [coachingSessionOffer(locale, coachingId)],
    },
  ];
}
