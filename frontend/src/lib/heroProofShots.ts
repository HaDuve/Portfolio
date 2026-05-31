import type { Locale } from "./i18n";

export type HeroProofShot = {
  variant: "phone" | "browser";
  src: string;
  alt: string;
  width: number;
  height: number;
};

const shots: Record<Locale, HeroProofShot[]> = {
  de: [
    {
      variant: "phone",
      src: "/assets/Frame%20294.png",
      alt: "Budget for Nomads: Tagesübersicht und Ausgabenliste",
      width: 390,
      height: 844,
    },
    {
      variant: "browser",
      src: "/assets/Wikifolio.jpg",
      alt: "Screenshot der wikifolio App",
      width: 800,
      height: 600,
    },
  ],
  en: [
    {
      variant: "phone",
      src: "/assets/Frame%20294.png",
      alt: "Budget for Nomads: daily overview and expense list",
      width: 390,
      height: 844,
    },
    {
      variant: "browser",
      src: "/assets/Wikifolio.jpg",
      alt: "Screenshot of the wikifolio app",
      width: 800,
      height: 600,
    },
  ],
};

export function heroProofShots(locale: Locale): HeroProofShot[] {
  return shots[locale];
}
