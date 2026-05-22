import type { FaqItem } from "./appEntwickelnFreelancer";

export const coachingMeta = {
  de: {
    title: "Programmieren lernen mit KI — Vibe Coding Coach (DE)",
    description:
      "Lerne Programmieren mit KI-Unterstützung: Cursor, Claude und Vibe Coding für Einsteiger. 1:1 Coaching — 60 € / 60 Min., kostenloses Erstgespräch.",
  },
  en: {
    title: "Learn to code with AI — Vibe Coding Coach",
    description:
      "Learn to code with AI tools: Cursor, Claude, and Vibe Coding for non-technical founders and beginners. 1:1 coaching — 60 € / 60 min, free intro call.",
  },
} as const;

export const coachingSections = {
  de: {
    h1: "Programmieren lernen mit KI — Vibe Coding Coaching",
    lead:
      "Du willst mit Cursor und Claude eigene Projekte umsetzen — aber steckst fest oder weißt nicht, wie du anfangen sollst? Im 1:1 Coaching arbeiten wir an deinem konkreten Projekt: Nach jeder Session verlässt du die Sitzung entsperrt und mit einem Workflow, den du selbst wiederholen kannst.",
    toolsTitle: "Werkzeuge & Ansatz",
    tools:
      "Wir arbeiten mit Cursor als KI-Editor und Claude als Underlying Model. Kein Setup-Stress: Ich führe dich durch die Einrichtung, wenn nötig. Der Fokus liegt auf deinem Projekt — nicht auf abstrakter Theorie.",
    fit:
      "Besonders sinnvoll für nicht-technische oder semi-technische Gründer und Einsteiger, die eigene Ideen umsetzen wollen, und für Software-Engineers, die KI systematisch in ihren Workflow integrieren wollen.",
    alsoFit:
      "Auch passend für Software-Engineers, die KI-gestütztes Coding (Vibe Coding) als Workflow etablieren und ihren Output mit AI-Tools skalieren wollen.",
    processTitle: "Ablauf",
    processSteps: [
      "Kostenloses 30-Min.-Erstgespräch: Dein Projekt, dein Stand, deine Ziele",
      "Buchung einer 60-Min.-Session (60 €) — du bringst dein konkretes Problem mit",
      "Wir arbeiten live zusammen: Code, Fehler, Workflow — direkt an deinem Projekt",
      "Du verlässt die Session entsperrt und mit einem Muster, das du wiederholen kannst",
    ],
    price: "60 € / 60 Min.",
    ctaTitle: "Kostenloses Erstgespräch buchen",
    ctaBody:
      "Buche ein kostenloses 30-Minuten-Gespräch — wir schauen gemeinsam, ob Coaching das Richtige für dich ist und was dein nächster Schritt wäre.",
  },
  en: {
    h1: "Learn to code with AI — Vibe Coding Coaching",
    lead:
      "You want to build your own projects with Cursor and Claude — but you're stuck or don't know where to start. In 1:1 coaching we work on your specific project: after every session you leave unblocked and with a repeatable workflow.",
    toolsTitle: "Tools & approach",
    tools:
      "We work with Cursor as the AI editor and Claude as the underlying model. No setup frustration: I'll walk you through configuration if needed. The focus is always on your project — not abstract theory.",
    fit:
      "A great fit for non-technical and semi-technical founders and beginners who want to ship their own ideas, and for software engineers who want to integrate AI systematically into their workflow.",
    alsoFit:
      "Also a fit for software engineers who want to establish AI-assisted coding (Vibe Coding) as a workflow and scale their output with AI tools.",
    processTitle: "Process",
    processSteps: [
      "Free 30-minute intro call: your project, your current level, your goals",
      "Book a 60-minute session (60 €) — bring your specific problem",
      "We work live together: code, errors, workflow — directly on your project",
      "You leave unblocked and with a pattern you can repeat on your own",
    ],
    price: "60 € / 60 min",
    ctaTitle: "Book a free intro call",
    ctaBody:
      "Book a free 30-minute intro call — we'll see if coaching is the right fit for you and what your next step would be.",
  },
} as const;

export const coachingFaq: { de: FaqItem[]; en: FaqItem[] } = {
  de: [
    {
      question: "Muss ich schon programmieren können?",
      answer:
        "Nein. Vibe Coding ist explizit für Einsteiger und nicht-technische Menschen gemacht. Wir starten da, wo du gerade stehst — ob du noch nie eine Zeile Code geschrieben hast oder schon ein bisschen Erfahrung mitbringst.",
    },
    {
      question: "Was bringt mir eine einzelne Session?",
      answer:
        "Du kommst mit einem konkreten Problem oder Ziel — wir lösen es live zusammen. Du verlässt die Session mit einem funktionierenden Stück Code und einem Workflow-Muster, das du beim nächsten Mal selbst anwenden kannst.",
    },
    {
      question: "Welche Tools brauche ich?",
      answer:
        "Cursor (kostenlose Version reicht für den Einstieg) und einen Claude-Account. Beides richten wir im Erstgespräch oder zu Beginn der Session gemeinsam ein — kein Vorwissen nötig.",
    },
    {
      question: "Was ist Vibe Coding?",
      answer:
        "Vibe Coding bedeutet, mit KI-Tools wie Cursor und Claude in natürlicher Sprache zu programmieren: Du beschreibst, was du willst, und die KI schreibt den Code. Du steuerst, prüfst und lernst dabei — ohne alles auswendig können zu müssen.",
    },
    {
      question: "Wie buche ich eine Session?",
      answer:
        "Über den Calendly-Link buchst du ein kostenloses 30-Minuten-Erstgespräch. Danach entscheiden wir gemeinsam, ob und wie wir weitermachen.",
    },
    {
      question: "Was kostet eine Session?",
      answer:
        "60 € für 60 Minuten. Das Erstgespräch (30 Min.) ist kostenlos und unverbindlich.",
    },
  ],
  en: [
    {
      question: "Do I need to know how to code already?",
      answer:
        "No. Vibe Coding is explicitly designed for beginners and non-technical people. We start where you are — whether you've never written a line of code or have a little experience.",
    },
    {
      question: "What will I get out of a single session?",
      answer:
        "You bring a concrete problem or goal — we solve it live together. You leave with a working piece of code and a workflow pattern you can apply on your own next time.",
    },
    {
      question: "What tools do I need?",
      answer:
        "Cursor (the free plan is enough to get started) and a Claude account. We set both up together during the intro call or at the start of the session — no prior knowledge required.",
    },
    {
      question: "What is Vibe Coding?",
      answer:
        "Vibe Coding means programming with AI tools like Cursor and Claude using natural language: you describe what you want, the AI writes the code. You guide, review, and learn — without having to memorise syntax.",
    },
    {
      question: "How do I book a session?",
      answer:
        "Use the Calendly link to book a free 30-minute intro call. Afterwards we decide together whether and how to continue.",
    },
    {
      question: "How much does a session cost?",
      answer:
        "60 € for 60 minutes. The intro call (30 min) is free and non-binding.",
    },
  ],
};
