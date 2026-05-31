import type { SchedulingPlacement } from "./click-telemetry";
import type { Locale } from "./i18n";

export type ChromeCta = {
  label: string;
  placement: SchedulingPlacement;
};

export type ContactChromeCopy = {
  eyebrow: string;
  title: string;
  description: string;
  freelanceEyebrow: string;
  freelanceLaneTitle: string;
  freelanceDescription: string;
  freelanceCta: ChromeCta;
  coachingEyebrow: string;
  coachingLaneTitle: string;
  coachingDescription: string;
  coachingCta: ChromeCta;
  socialEyebrow: string;
};

export type SkillsChromeCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

export type SiteChromeCopy = {
  headerCta: ChromeCta;
  mobileFreelanceCta: ChromeCta;
  mobileCoachingCta: ChromeCta;
  skills: SkillsChromeCopy;
  contact: ContactChromeCopy;
  menuToggleLabel: string;
  menuCloseLabel: string;
  mobileNavLabel: string;
  logoAriaLabel: string;
  moreFreelanceLabel: string;
  moreCoachingLabel: string;
};

const copy: Record<Locale, SiteChromeCopy> = {
  de: {
    headerCta: { label: "Gespräch buchen", placement: "header" },
    mobileFreelanceCta: {
      label: "Projekt anfragen",
      placement: "mobile-freelance",
    },
    mobileCoachingCta: {
      label: "Coaching buchen",
      placement: "mobile-coaching",
    },
    skills: {
      eyebrow: "Stack",
      title: "Was ich in Projekten einsetze",
      description:
        "Mobile-first Engineering — validierung für technische Entscheider, kein zweiter Pitch.",
    },
    contact: {
      eyebrow: "Kontakt",
      title: "Gespräch buchen",
      description:
        "30 Minuten, unverbindlich — Freelance oder Coaching. Ich melde mich mit nächsten Schritten.",
      freelanceEyebrow: "Freelance",
      freelanceLaneTitle: "Projekt anfragen",
      freelanceDescription:
        "App, Web oder Backend für euer KMU — Scope und Budget klären wir im Erstgespräch.",
      freelanceCta: {
        label: "Projekt anfragen",
        placement: "contact-freelance",
      },
      coachingEyebrow: "Coaching",
      coachingLaneTitle: "Coaching buchen",
      coachingDescription:
        "Vibe Coding mit Cursor oder Claude — kostenloses Kennenlernen, dann Sessions à 60 €.",
      coachingCta: { label: "Coaching buchen", placement: "contact-coaching" },
      socialEyebrow: "Links",
    },
    menuToggleLabel: "Menü",
    menuCloseLabel: "Menü schließen",
    mobileNavLabel: "Mobile Navigation",
    logoAriaLabel: "Startseite",
    moreFreelanceLabel: "Mehr · Freelance",
    moreCoachingLabel: "Mehr · Coaching",
  },
  en: {
    headerCta: { label: "Book a call", placement: "header" },
    mobileFreelanceCta: {
      label: "Request a project",
      placement: "mobile-freelance",
    },
    mobileCoachingCta: {
      label: "Book coaching",
      placement: "mobile-coaching",
    },
    skills: {
      eyebrow: "Stack",
      title: "What I use on projects",
      description:
        "Mobile-first engineering — validation for technical buyers, not a second pitch.",
    },
    contact: {
      eyebrow: "Contact",
      title: "Book a call",
      description:
        "30 minutes, no obligation — freelance or coaching. I will follow up with next steps.",
      freelanceEyebrow: "Freelance",
      freelanceLaneTitle: "Request a project",
      freelanceDescription:
        "App, web, or backend for your SME — we clarify scope and budget on the intro call.",
      freelanceCta: {
        label: "Request a project",
        placement: "contact-freelance",
      },
      coachingEyebrow: "Coaching",
      coachingLaneTitle: "Book coaching",
      coachingDescription:
        "Vibe coding with Cursor or Claude — free intro, then 60-minute sessions at €60.",
      coachingCta: { label: "Book coaching", placement: "contact-coaching" },
      socialEyebrow: "Links",
    },
    menuToggleLabel: "Menu",
    menuCloseLabel: "Close menu",
    mobileNavLabel: "Mobile navigation",
    logoAriaLabel: "Home",
    moreFreelanceLabel: "More · Freelance",
    moreCoachingLabel: "More · Coaching",
  },
};

export function siteChromeCopy(locale: Locale): SiteChromeCopy {
  return copy[locale];
}
