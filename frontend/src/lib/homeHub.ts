import {
  coachingLandingPath,
  devLandingPath,
  type Locale,
} from "./i18n";

export type HubTile = {
  eyebrow: string;
  headline: string;
  description: string;
  href: string;
};

export function hubTiles(locale: Locale): [HubTile, HubTile] {
  if (locale === "en") {
    return [
      {
        eyebrow: "Freelance",
        headline: "App & web development",
        description: "React Native, Next.js, and backend",
        href: devLandingPath("en"),
      },
      {
        eyebrow: "Coaching",
        headline: "Learn to build with AI",
        description: "1:1 sessions with Cursor and Claude",
        href: coachingLandingPath("en"),
      },
    ];
  }

  return [
    {
      eyebrow: "Freelance",
      headline: "App & Web entwickeln lassen",
      description: "React Native, Next.js und Backend",
      href: devLandingPath("de"),
    },
    {
      eyebrow: "Coaching",
      headline: "Mit KI programmieren lernen",
      description: "1:1 Sessions mit Cursor und Claude",
      href: coachingLandingPath("de"),
    },
  ];
}
