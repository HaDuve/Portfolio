import type { Locale } from "./i18n";

export type OfferingTierId = "micro-mvp" | "mvp" | "ongoing";

export type OfferingTier = {
  id: OfferingTierId;
  label: string;
  price: string;
  timeframe: string;
};

export type OfferingLadder = {
  hourlyRate: string;
  tiers: OfferingTier[];
  typeShiftNote: string;
};

const ladder: Record<Locale, OfferingLadder> = {
  de: {
    hourlyRate: "60 €/h",
    tiers: [
      {
        id: "micro-mvp",
        label: "Micro-MVP / Prototyp",
        price: "ab 1.200 €",
        timeframe: "~1–2 Wochen",
      },
      {
        id: "mvp",
        label: "MVP / produktionsreif",
        price: "ab 4.800 €",
        timeframe: "~4–8 Wochen",
      },
      {
        id: "ongoing",
        label: "Laufende Entwicklung",
        price: "ab 1.200 €/Monat",
        timeframe: "Retainer · 60 €/h",
      },
    ],
    typeShiftNote:
      "App, Website oder Server — der Umfang verschiebt die Schätzung.",
  },
  en: {
    hourlyRate: "60 €/h",
    tiers: [
      {
        id: "micro-mvp",
        label: "Micro-MVP / prototype",
        price: "from €1,200",
        timeframe: "~1–2 weeks",
      },
      {
        id: "mvp",
        label: "MVP / launch-ready",
        price: "from €4,800",
        timeframe: "~4–8 weeks",
      },
      {
        id: "ongoing",
        label: "Ongoing development",
        price: "from €1,200/month",
        timeframe: "Retainer · 60 €/h",
      },
    ],
    typeShiftNote:
      "App, website, or server — scope shifts the estimate.",
  },
};

export function offeringLadder(locale: Locale): OfferingLadder {
  return ladder[locale];
}
