import { coachingLandingPath, devLandingPath, type Locale } from "./i18n";
import type { SchedulingPlacement } from "./click-telemetry";

export type CoachingLaneSection = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  moreLabel: string;
  moreHref: string;
  schedulingPlacement: Extract<SchedulingPlacement, "lane-coaching">;
};

export type CoachingTimelineStep = {
  id: string;
  stepNum: string;
  title: string;
  description: string;
};

export type CoachingToolBadge = {
  id: string;
  label: string;
};

export type CoachingFaqItem = {
  id: string;
  question: string;
  answer: string;
  link?: {
    href: string;
    label: string;
  };
};

const sectionCopy: Record<
  Locale,
  Omit<CoachingLaneSection, "moreHref" | "schedulingPlacement">
> = {
  de: {
    eyebrow: "Coaching",
    title: "Vibe Coding — Programmieren mit KI",
    description:
      "1:1 an deinem Projekt — Cursor, Claude, Workflow den du wiederholen kannst. Kostenloses Erstgespräch (30 Min.), danach 60 € / 60 Min.",
    ctaLabel: "Coaching buchen",
    moreLabel: "Mehr zum Coaching →",
  },
  en: {
    eyebrow: "Coaching",
    title: "Vibe Coding — coding with AI",
    description:
      "1:1 on your project — Cursor, Claude, and a workflow you can repeat. Free 30-minute intro call, then 60 € / 60 min.",
    ctaLabel: "Book coaching",
    moreLabel: "More on coaching →",
  },
};

const timelineCopy: Record<Locale, CoachingTimelineStep[]> = {
  de: [
    {
      id: "intro",
      stepNum: "01",
      title: "Erstgespräch",
      description:
        "30 Min., kostenlos: Projekt, Stand, Ziele — ohne Verpflichtung.",
    },
    {
      id: "book",
      stepNum: "02",
      title: "Session buchen",
      description:
        "60 Min., 60 € — du bringst ein konkretes Problem oder Feature mit.",
    },
    {
      id: "live",
      stepNum: "03",
      title: "Live am Projekt",
      description:
        "Code, Fehler, Prompts — wir lösen es gemeinsam in Cursor.",
    },
    {
      id: "unblocked",
      stepNum: "04",
      title: "Entsperrt raus",
      description:
        "Funktionierender Fortschritt plus Muster für die nächste Session.",
    },
  ],
  en: [
    {
      id: "intro",
      stepNum: "01",
      title: "Intro call",
      description:
        "30 min, free: your project, where you are, your goals — no obligation.",
    },
    {
      id: "book",
      stepNum: "02",
      title: "Book a session",
      description:
        "60 min, 60 € — bring a concrete problem or feature to work on.",
    },
    {
      id: "live",
      stepNum: "03",
      title: "Live on your project",
      description:
        "Code, errors, prompts — we solve it together in Cursor.",
    },
    {
      id: "unblocked",
      stepNum: "04",
      title: "Leave unblocked",
      description:
        "Working progress plus a pattern you can repeat in the next session.",
    },
  ],
};

export function coachingLaneSection(locale: Locale): CoachingLaneSection {
  return {
    ...sectionCopy[locale],
    moreHref: coachingLandingPath(locale),
    schedulingPlacement: "lane-coaching",
  };
}

export function coachingLaneTimeline(locale: Locale): CoachingTimelineStep[] {
  return timelineCopy[locale];
}

export function coachingLaneTools(locale: Locale): CoachingToolBadge[] {
  const audience =
    locale === "de" ? "Für Gründer & Engineers" : "For founders & engineers";
  return [
    { id: "cursor", label: "Cursor" },
    { id: "claude", label: "Claude" },
    { id: "audience", label: audience },
  ];
}

const faqCopy: Record<Locale, CoachingFaqItem[]> = {
  de: [
    {
      id: "prior-code",
      question: "Muss ich schon programmieren können?",
      answer:
        "Nein. Wir starten da, wo du stehst — Einsteiger und Engineers sind willkommen.",
    },
    {
      id: "coaching-vs-freelance",
      question: "Coaching oder Freelance?",
      answer: "Coaching: du baust, ich coache. Freelance: ich implementiere für euch — ",
      link: {
        href: "", // filled in coachingLaneFaq
        label: "zur Freelance-Seite",
      },
    },
  ],
  en: [
    {
      id: "prior-code",
      question: "Do I need to know how to code already?",
      answer:
        "No. We start where you are — beginners and engineers are both welcome.",
    },
    {
      id: "coaching-vs-freelance",
      question: "Coaching or freelance?",
      answer: "Coaching: you build, I coach. Freelance: I implement for you — ",
      link: {
        href: "",
        label: "see the freelance page",
      },
    },
  ],
};

export function coachingLaneFaq(locale: Locale): CoachingFaqItem[] {
  return faqCopy[locale].map((item) =>
    item.link
      ? { ...item, link: { ...item.link, href: devLandingPath(locale) } }
      : item,
  );
}
