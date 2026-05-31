import type { Locale } from "./i18n";

export type HomeSeoCopy = {
  description: string;
  title: string;
};

/** Owner-validated primary head terms (issue #35, Google Keyword Planner). */
export const homePrimaryKeyword: { de: string; en: string } = {
  de: "App Entwickler",
  en: "App Developer",
};

const brandFirstMeta: Record<Locale, HomeSeoCopy> = {
  de: {
    title: "Hannes Duve · App & Full-Stack Freelancer (DACH)",
    description:
      "Senior-Freelancer für App, Web & Backend — Next.js, React Native/Expo, Node, Cloud. Remote für KMU in DE, AT & CH. Auch Vibe-Coding-Coaching.",
  },
  en: {
    title: "Hannes Duve · Freelance App & Full-Stack Developer (DACH & EU)",
    description:
      "Freelance app & full-stack developer — Next.js, React Native/Expo, Node, cloud. Remote for SMEs in DACH & EU. AI coding coaching too.",
  },
};

const keywordFirstMeta: Record<Locale, HomeSeoCopy> = {
  de: {
    title: `${homePrimaryKeyword.de} — Hannes Duve (DACH)`,
    description:
      "Senior App Entwickler (Freelancer) für Mobile, Web & Backend — Next.js, React Native/Expo, Node, Cloud. Transparente App-Entwicklung-Kosten ab 60 €/h. Remote für KMU in DE, AT & CH — oder Coaching, wenn du deine eigene App erstellen willst.",
  },
  en: {
    title: `${homePrimaryKeyword.en} — Hannes Duve (DACH & EU)`,
    description:
      "Freelance app developer for mobile, web & backend — Next.js, React Native/Expo, Node, cloud. Transparent pricing from €60/h. Remote for DACH & EU — or coaching if you want to build your own app.",
  },
};

export function homeSeoMeta(locale: Locale): HomeSeoCopy {
  if (homePrimaryKeyword) {
    return keywordFirstMeta[locale];
  }
  return brandFirstMeta[locale];
}
