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
      title: "Web & Webapps",
      description:
        "Next.js-Webapps mit APIs, Auth und SEO — von MVP bis produktionsreif.",
    },
    {
      id: "mobile",
      title: "Mobile Apps",
      description:
        "React Native und Expo für iOS und Android inklusive Store-Releases und EAS-Pipelines.",
    },
    {
      id: "backend",
      title: "Backend & Cloud",
      description:
        "Node, PostgreSQL, Prisma, Supabase und AWS — passend zu Budget und Team.",
    },
    {
      id: "quality",
      title: "Qualität & Betrieb",
      description:
        "Tests, CI/CD und pragmatische Security — echtes Engineering, kein Vibe Coding.",
    },
  ],
  en: [
    {
      id: "web",
      title: "Web & web apps",
      description:
        "Next.js apps with APIs, auth, and SEO-ready delivery from MVP to production.",
    },
    {
      id: "mobile",
      title: "Mobile apps",
      description:
        "React Native and Expo for iOS and Android with store releases and EAS pipelines.",
    },
    {
      id: "backend",
      title: "Backend & Cloud",
      description:
        "Node.js, PostgreSQL, Prisma, Supabase, and AWS — shaped for your team and budget.",
    },
    {
      id: "quality",
      title: "Quality & operations",
      description:
        "Tests, CI/CD, and pragmatic security — real engineering — not vibe coding.",
    },
  ],
};

export function homeServiceCards(locale: Locale): HomeServiceCard[] {
  return cards[locale];
}
