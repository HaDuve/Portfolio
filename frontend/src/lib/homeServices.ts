import type { Locale } from "./i18n";

export type HomeServiceCard = {
  id: "web" | "mobile" | "backend" | "quality";
  title: string;
  description: string;
};

const cards: Record<Locale, HomeServiceCard[]> = {
  de: [
    {
      id: "web",
      title: "Websites & Webapps",
      description:
        "Next.js mit APIs, Auth und SEO — von MVP bis produktionsreif und wartbar.",
    },
    {
      id: "mobile",
      title: "Mobile Apps",
      description:
        "React Native und Expo für iOS und Android inklusive Store-Releases und EAS-Pipelines.",
    },
    {
      id: "backend",
      title: "Server & Cloud",
      description:
        "Node, PostgreSQL und AWS — stabil, wartbar und passend zu Budget und Team.",
    },
    {
      id: "quality",
      title: "Qualität & Betrieb",
      description:
        "Tests, CI/CD und pragmatische Security — verlässlicher Betrieb statt Quick Fixes.",
    },
  ],
  en: [
    {
      id: "web",
      title: "Websites & web apps",
      description:
        "Next.js apps with APIs, auth, and SEO — from MVP to production-ready and maintainable.",
    },
    {
      id: "mobile",
      title: "Mobile apps",
      description:
        "React Native and Expo for iOS and Android with store releases and EAS pipelines.",
    },
    {
      id: "backend",
      title: "Server & cloud",
      description:
        "Node.js, PostgreSQL, and AWS — stable, maintainable, shaped for your team and budget.",
    },
    {
      id: "quality",
      title: "Quality & operations",
      description:
        "Tests, CI/CD, and pragmatic security — reliable operations instead of quick fixes.",
    },
  ],
};

export function homeServiceCards(locale: Locale): HomeServiceCard[] {
  return cards[locale];
}
