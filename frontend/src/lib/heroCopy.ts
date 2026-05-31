import type { SchedulingPlacement } from "./click-telemetry";
import type { Locale } from "./i18n";

export type HeroCopy = {
  eyebrow: string;
  headline: string;
  subhead: string;
  ctaFreelance: string;
  ctaCoaching: string;
  ctaFreelancePlacement: SchedulingPlacement;
  ctaCoachingPlacement: SchedulingPlacement;
};

const copy: Record<Locale, HeroCopy> = {
  de: {
    eyebrow: "Senior Freelancer · Bremen · Coaching",
    headline: "Software, die hält, was sie verspricht.",
    subhead:
      "Ich baue stabile Apps, Websites und Server für dein Unternehmen — oder zeige dir 1:1, wie du selbst mit Cursor oder Claude baust. Hohe Qualität, direkt und persönlich.",
    ctaFreelance: "Projekt anfragen",
    ctaCoaching: "Coaching buchen",
    ctaFreelancePlacement: "hero-freelance",
    ctaCoachingPlacement: "hero-coaching",
  },
  en: {
    eyebrow: "Senior freelancer · Bremen · Coaching",
    headline: "Software that delivers on its promise.",
    subhead:
      "I build stable apps, websites, and servers for your business — or show you 1:1 how to build with Cursor or Claude yourself. High quality, direct and personal.",
    ctaFreelance: "Request a project",
    ctaCoaching: "Book coaching",
    ctaFreelancePlacement: "hero-freelance",
    ctaCoachingPlacement: "hero-coaching",
  },
};

export function heroCopy(locale: Locale): HeroCopy {
  return copy[locale];
}
