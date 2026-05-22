import { coachingLandingPath, devLandingPath, type Locale } from "@/lib/i18n";

export const homeHubCopy = {
  de: {
    dev: {
      eyebrow: "Freelance",
      headline: "App & Web entwickeln lassen",
      description: "React Native, Next.js und Backend",
    },
    coaching: {
      eyebrow: "Coaching",
      headline: "Mit KI programmieren lernen",
      description: "1:1 Sessions mit Cursor und Claude",
    },
  },
  en: {
    dev: {
      eyebrow: "Freelance",
      headline: "App & web development",
      description: "React Native, Next.js, and backend",
    },
    coaching: {
      eyebrow: "Coaching",
      headline: "Learn to build with AI",
      description: "1:1 sessions with Cursor and Claude",
    },
  },
} as const;

export function homeHubPaths(locale: Locale) {
  return {
    dev: devLandingPath(locale),
    coaching: coachingLandingPath(locale),
  };
}
