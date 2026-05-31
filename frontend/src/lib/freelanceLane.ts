import { devLandingPath, type Locale } from "./i18n";
import type { SchedulingPlacement } from "./click-telemetry";

export type FreelanceLaneSection = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  moreLabel: string;
  moreHref: string;
  schedulingPlacement: Extract<SchedulingPlacement, "lane-freelance">;
};

const copy: Record<Locale, Omit<FreelanceLaneSection, "moreHref" | "schedulingPlacement">> = {
  de: {
    eyebrow: "Freelance",
    title: "App & Web entwickeln lassen",
    description:
      "Für KMU und Teams im DACH-Raum: von MVP bis produktionsreif — React Native, Next.js, Server, CI/CD.",
    ctaLabel: "Projekt anfragen",
    moreLabel: "Alle Projekte & FAQ →",
  },
  en: {
    eyebrow: "Freelance",
    title: "App & web development",
    description:
      "For SMEs and teams in the DACH region: from MVP to production-ready — React Native, Next.js, server, CI/CD.",
    ctaLabel: "Start a project",
    moreLabel: "All projects & FAQ →",
  },
};

export function freelanceLaneSection(locale: Locale): FreelanceLaneSection {
  return {
    ...copy[locale],
    moreHref: devLandingPath(locale),
    schedulingPlacement: "lane-freelance",
  };
}
