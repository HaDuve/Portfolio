import type { Locale } from "./i18n";

export type HomeSeoCopy = {
  description: string;
  title: string;
};

/** Set after owner validates volume/difficulty in a keyword tool (issue #35). */
export const homePrimaryKeyword: { de: string; en: string } | null = null;

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

function keywordFirstMeta(
  locale: Locale,
  keyword: { de: string; en: string },
): HomeSeoCopy {
  const head = keyword[locale];
  if (locale === "de") {
    return {
      title: `${head} — Hannes Duve (DACH)`,
      description: brandFirstMeta.de.description,
    };
  }
  return {
    title: `${head} — Hannes Duve (DACH & EU)`,
    description: brandFirstMeta.en.description,
  };
}

export function homeSeoMeta(locale: Locale): HomeSeoCopy {
  if (homePrimaryKeyword) {
    return keywordFirstMeta(locale, homePrimaryKeyword);
  }
  return brandFirstMeta[locale];
}
