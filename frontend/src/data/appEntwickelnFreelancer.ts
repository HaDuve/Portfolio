export type FaqItem = { question: string; answer: string };

export const appEntwickelnFreelancerMeta = {
  de: {
    title: "App entwickeln & Freelancer beauftragen (DACH)",
    description:
      "App entwickeln und als Freelancer beauftragen: Senior Full-Stack & Mobile (Next.js, Expo). Website, Backend, App — remote für KMU in DE, AT & CH.",
  },
  en: {
    title: "Freelance app development & hire a developer (DACH)",
    description:
      "Hire a freelance app developer: senior full-stack & mobile (Next.js, Expo). Website, backend, and apps — remote for SMEs in Germany, Austria, and Switzerland.",
  },
} as const;

export const appEntwickelnFreelancerFaq: {
  de: FaqItem[];
  en: FaqItem[];
} = {
  de: [
    {
      question: "Wie lasse ich eine App machen — was ist der erste Schritt?",
      answer:
        "Kurzes Erstgespräch zu Ziel, Nutzerkreis, Budgetrahmen und Timeline. Danach klären wir Scope (MVP vs. spätere Phasen), Technologie (z. B. React Native/Expo für Mobile) und wie Website, Backend und App zusammenspielen sollen. Anschließend gibt es ein schriftliches Angebot mit Meilensteinen.",
    },
    {
      question: "Ich will eine App — brauche ich zuerst eine Website?",
      answer:
        "Nicht zwingend. Viele Projekte starten mit der App oder mit einer Web-App; manchmal gehört eine Marketing-Website dazu. Entscheidend ist, welche Oberfläche eure Nutzer zuerst sehen und wo ihr Leads oder Support bündelt — das stimmen wir im Gespräch ab.",
    },
    {
      question: "Kann ich Website, Backend und App aus einer Hand beauftragen?",
      answer:
        "Ja. Typisch sind Next.js für Web, Node/PostgreSQL oder Supabase für Backend und APIs, React Native/Expo für iOS/Android — ein durchgängiger Stack erleichtert Auth, Datenmodell und Betrieb.",
    },
    {
      question: "Was kostet es, eine App entwickeln zu lassen?",
      answer:
        "Kosten hängen stark von Umfang, Plattformen (nur iOS vs. iOS+Android), Backend, Schnittstellen und Wartung ab. Nach dem Erstgespräch gibt es eine klare Scope-Einschätzung und ein Angebot — ohne pauschale Versprechen, die nicht zu eurem Projekt passen.",
    },
    {
      question: "Freelancer oder Agentur für App-Entwicklung?",
      answer:
        "Ein Freelancer lohnt sich, wenn ihr direkt mit der Person arbeiten wollt, die auch implementiert — weniger Schnittstellen, schnellere Entscheidungen. Agenturen sind sinnvoll, wenn ihr dauerhaft ein großes Team oder sehr spezialisierte Disziplinen braucht. Ich positioniere mich bewusst als Senior-Freelancer für KMU.",
    },
    {
      question: "Arbeitest du nur remote?",
      answer:
        "Überwiegend remote, Zeiten für DACH und EU sind unkompliziert. Bei Bedarf können Workshops oder Termine vor Ort besprochen werden — Fokus bleibt auf effizienter Zusammenarbeit.",
    },
    {
      question: "Wie beauftrage ich dich konkret?",
      answer:
        "Per E-Mail oder über einen Termin im Kalender. Wir klären Anforderungen, ich liefere Angebot und Zeitplan; nach Freigabe startet die Umsetzung mit festen Review-Terminen bis zur Übergabe.",
    },
    {
      question: "Welche Technologien nutzt du für App und Backend?",
      answer:
        "Mobile: React Native mit Expo; Web: Next.js; Backend: Node.js, PostgreSQL, Prisma oder Supabase, je nach Projekt AWS (Lambda, S3) und Stripe für Zahlungen — immer passend zu Budget und internen Skills bei euch.",
    },
  ],
  en: [
    {
      question: "How do I get an app built — what is the first step?",
      answer:
        "A short intro call on goals, audience, budget range, and timeline. Then we align scope (MVP vs. later phases), technology (for example React Native/Expo for mobile), and how website, backend, and app should fit together. You receive a written proposal with milestones.",
    },
    {
      question: "I want an app — do I need a website first?",
      answer:
        "Not necessarily. Many projects start with the app or a web app; sometimes a marketing site is added. What matters is which surface your users see first and where you route leads or support — we decide that together.",
    },
    {
      question: "Can I commission website, backend, and app from one person?",
      answer:
        "Yes. Typical stacks are Next.js for the web, Node/PostgreSQL or Supabase for APIs and data, and React Native/Expo for iOS/Android — one coherent stack helps with auth, data models, and operations.",
    },
    {
      question: "What does it cost to develop an app?",
      answer:
        "Cost depends on scope, platforms (iOS only vs. iOS+Android), backend, integrations, and maintenance. After the intro call you get a clear scope estimate and proposal — no one-size-fits-all numbers that would mislead you.",
    },
    {
      question: "Freelancer or agency for app development?",
      answer:
        "A freelancer fits when you want to work directly with the person who builds the product — fewer handoffs, faster decisions. Agencies help when you need a large permanent team or many specialised roles. I work as a senior freelancer for SMEs.",
    },
    {
      question: "Do you work remote only?",
      answer:
        "Mostly remote, with straightforward time zones for DACH and EU. On-site workshops or meetings can be arranged if needed — the focus is efficient collaboration.",
    },
    {
      question: "How do I hire you in practice?",
      answer:
        "By email or by booking a calendar slot. We clarify requirements, I send a proposal and timeline; after approval, delivery runs with fixed review checkpoints until handover.",
    },
    {
      question: "Which technologies do you use for app and backend?",
      answer:
        "Mobile: React Native with Expo; web: Next.js; backend: Node.js, PostgreSQL, Prisma or Supabase, plus AWS (Lambda, S3) and Stripe where appropriate — always matched to your budget and in-house skills.",
    },
  ],
};

/** Long-form copy for the landing page (people-first; avoid duplicate FAQ text in prose). */
export const appEntwickelnSections = {
  de: {
    h1: "App entwickeln & als Freelancer beauftragen",
    lead:
      "Wenn ihr eine App bauen, ein Backend betreiben oder eine Website mit echtem Nutzen wollt: Ich begleite KMU im DACH-Raum als Senior-Freelancer — von der Idee bis zu stabilem Betrieb, ohne unnötige Agentur-Infrastruktur.",
    stack:
      "Typische Aufträge: React Native/Expo für iOS und Android, Next.js für Web-Apps und Marketing-Sites, Node.js mit PostgreSQL oder Supabase für APIs und Daten, AWS oder ähnliche Cloud-Dienste wenn Skalierung und Kosten es rechtfertigen. So lassen sich Website, App und Backend konsistent halten und später von eurem Team weiterentwickeln.",
    fit:
      "Besonders sinnvoll, wenn ihr einen App-Auftrag klar scoped habt oder ihn gemeinsam scharf bekommen wollt, wenn Remote-Zusammenarbeit für euch Routine ist, und wenn ihr Wert auf lesbaren Code, Tests und Übergabe legt.",
    processTitle: "Ablauf",
    processSteps: [
      "Erstgespräch (Ziele, Risiken, grober Budgetrahmen)",
      "Angebot mit Meilensteinen und klaren Deliverables",
      "Umsetzung mit Reviews — ihr seid im Loop",
      "Go-Live, Monitoring-Basics und Dokumentation für euer Team",
    ],
    ctaTitle: "Projekt anfragen",
    ctaBody:
      "Schreibt eine kurze Mail oder bucht direkt ein 30-Minuten-Gespräch — dann klären wir, ob ich für euren App-Auftrag der richtige Freelancer bin.",
  },
  en: {
    h1: "Freelance app development & how to engage",
    lead:
      "If you want to build an app, run a backend, or ship a website with real product value, I work with SMEs across the DACH region as a senior freelancer — from discovery to stable operations without unnecessary agency overhead.",
    stack:
      "Typical work: React Native/Expo for iOS and Android, Next.js for web apps and marketing sites, Node.js with PostgreSQL or Supabase for APIs and data, and AWS or similar cloud services when scale and cost justify it. That keeps website, app, and backend aligned and maintainable by your team later.",
    fit:
      "A strong fit when you want a clearly scoped app engagement (or help defining one), are comfortable with remote collaboration, and care about readable code, tests, and handover.",
    processTitle: "Process",
    processSteps: [
      "Intro call (goals, risks, rough budget)",
      "Proposal with milestones and clear deliverables",
      "Delivery with reviews — you stay in the loop",
      "Go-live, basic monitoring, and documentation for your team",
    ],
    ctaTitle: "Start a conversation",
    ctaBody:
      "Send a short email or book a 30-minute slot — then we see if I am the right freelance developer for your project.",
  },
} as const;
