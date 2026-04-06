"use client";

import Link from "next/link";
import { useLayoutEffect, useState, useSyncExternalStore } from "react";
import { Hero } from "@/components/Hero";
import { IntroSequence } from "@/components/IntroSequence";
import { LenisProvider } from "@/components/LenisProvider";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import type { Profile, Project } from "@/types/content";
import {
  datenschutzPath,
  impressumPath,
  localePath,
  type Locale,
} from "@/lib/i18n";

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** After the intro finishes, do not show it again for this many ms (per-tab “session” feel via localStorage). */
const INTRO_BLOCK_MS = 10 * 60 * 1000;
const INTRO_STORAGE_KEY = "portfolioIntroBlockedUntil";

function readIntroBlockedUntil(): number | null {
  try {
    const raw = localStorage.getItem(INTRO_STORAGE_KEY);
    if (!raw) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

function writeIntroBlockedUntil(): void {
  try {
    localStorage.setItem(
      INTRO_STORAGE_KEY,
      String(Date.now() + INTRO_BLOCK_MS),
    );
  } catch {
    /* quota / private mode */
  }
}

type SkillsData = {
  categories: { nameDe: string; nameEn: string; items: string[] }[];
};

type Props = {
  locale: Locale;
  profile: Profile;
  projects: Project[];
  skillsData: SkillsData;
};

export function PortfolioHome({
  locale,
  profile,
  projects,
  skillsData,
}: Props) {
  const showEnglish = locale === "en";
  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  const [introPhase, setIntroPhase] = useState<"playing" | "fading" | "done">(
    "playing",
  );
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const until = readIntroBlockedUntil();
    if (until !== null && Date.now() < until) {
      queueMicrotask(() => {
        setIntroPhase("done");
      });
    }
  }, [prefersReducedMotion]);

  /** Hero motion: unblock when intro fade starts (not only when DOM unmounts). */
  const introDone = prefersReducedMotion || introPhase !== "playing";
  const showIntro = !prefersReducedMotion && introPhase !== "done";

  return (
    <LenisProvider enabled={false}>
      <div id="top" className="relative flex flex-1 flex-col">
        <div
          className={`flex flex-1 flex-col ${introPhase === "playing" && !prefersReducedMotion ? "pointer-events-none" : ""}`}
          aria-hidden={introPhase === "playing" && !prefersReducedMotion}
        >
          <Hero profile={profile} introDone={introDone} locale={locale} />

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-16 sm:px-6 sm:pt-20">
            <section id="leistungen" className="scroll-mt-28">
              <SectionHeading
                eyebrow={showEnglish ? "Services" : "Angebot"}
                title={showEnglish ? "Services" : "Leistungen"}
                description={
                  showEnglish
                    ? "Web, mobile, and full-stack: from MVP to production-ready delivery."
                    : "Web, Mobile und Full-Stack: von MVP bis produktionsreif."
                }
              />
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
                {showEnglish ? (
                  <>
                    More on{" "}
                    <Link
                      href={localePath(locale, "app-entwickeln-freelancer")}
                      className="font-medium text-accent underline-offset-4 hover:underline"
                    >
                      freelance app development & how to engage
                    </Link>{" "}
                    (process, stack, and FAQs).
                  </>
                ) : (
                  <>
                    Mehr zu{" "}
                    <Link
                      href={localePath(locale, "app-entwickeln-freelancer")}
                      className="font-medium text-accent underline-offset-4 hover:underline"
                    >
                      App entwickeln und als Freelancer beauftragen
                    </Link>{" "}
                    (Ablauf, Stack und häufige Fragen).
                  </>
                )}
              </p>
              {profile.ratesDe && profile.ratesEn ? (
                <div className="mt-8 max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <p className="font-mono text-xs uppercase tracking-widest text-muted">
                    {showEnglish ? "Rates" : "Preise"}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                    {showEnglish ? profile.ratesEn : profile.ratesDe}
                  </p>
                </div>
              ) : null}
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="font-display text-xl font-normal text-foreground">
                    {showEnglish ? "Web & web apps" : "Web & Webapps"}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                    {showEnglish
                      ? "I build Next.js applications with APIs, authentication, and payments where needed, with SEO-friendly rendering and sensible metadata. Typical work includes SaaS products, internal tools, and marketing sites with a clear path from visitor to lead or signup — structured so your team can extend and operate the codebase after handover."
                      : "Next.js, APIs, Auth, Payments, SEO-technisch sauber — z. B. SaaS, interne Tools, Landingpages mit klarer Conversion-Strecke."}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="font-display text-xl font-normal text-foreground">
                    {showEnglish ? "Mobile apps" : "Mobile Apps"}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                    {showEnglish
                      ? "React Native and Expo: App Store and Play releases, push notifications, and pragmatic offline behaviour where it matters. I set up analytics hooks you can own, and EAS-based build and submission flows so releases stay predictable as the product grows."
                      : "React Native / Expo: App Store Builds, Push, Offline-First wo sinnvoll, Analytics und saubere Release-Pipelines (EAS)."}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="font-display text-xl font-normal text-foreground">
                    Backend & Cloud
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                    {showEnglish
                      ? "Node.js, PostgreSQL, Prisma, Supabase, AWS (Lambda, S3, CDK), and Stripe — chosen to match your budget and in-house skills. I design APIs and data models for clarity and migration safety, not maximum complexity on day one."
                      : "Node, PostgreSQL, Prisma, Supabase, AWS (Lambda, S3, CDK), Stripe — je nach Budget und Team passend skalierbar."}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="font-display text-xl font-normal text-foreground">
                    {showEnglish
                      ? "Quality & operations"
                      : "Qualität & Betrieb"}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                    {showEnglish
                      ? "Automated tests where they add confidence (Jest, Playwright, Maestro on mobile), CI/CD pipelines, performance basics, and pragmatic security hygiene — so you ship once and can keep shipping without firefighting every release."
                      : "Tests (Jest, Playwright, Maestro), CI/CD, Performance und pragmatische Security-Basics — damit ihr nicht nur launcht, sondern wartet."}
                  </p>
                </div>
              </div>
            </section>

            <section id="app-entwickeln" className="mt-24 scroll-mt-28">
              <SectionHeading
                eyebrow={showEnglish ? "App development" : "App entwickeln"}
                title={
                  showEnglish
                    ? "Hire a freelance app developer"
                    : "App entwickeln lassen (Freelancer)"
                }
                description={
                  showEnglish
                    ? "From idea to shipped app: scope, stack, delivery, and a clear handover."
                    : "Von Idee bis Go-Live: Scope, Stack, Umsetzung und saubere Übergabe."
                }
              />
              <div className="mt-10 max-w-3xl space-y-4 text-base leading-relaxed text-stone-600 dark:text-stone-400">
                {showEnglish ? (
                  <>
                    <p>
                      If you are thinking “I want an app”, the fastest path is
                      usually a short discovery: users, core flows, platforms,
                      and what the backend needs to do. From that we define an
                      MVP that is realistic in budget and timeline.
                    </p>
                    <p>
                      Typical setup: React Native/Expo for iOS and Android, a
                      Next.js web app or marketing site where it helps, and a
                      lean backend (Node + Postgres/Supabase) for auth, data and
                      integrations. One coherent stack keeps maintenance
                      predictable.
                    </p>
                    <p>
                      If you want to commission a freelancer for an app project,
                      this page collects the process, FAQs, and concrete next
                      steps.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Wenn du denkst „Ich will eine App“: Der schnellste Weg ist
                      fast immer ein kurzes Discovery — Nutzer, Kern-Flows,
                      Plattformen (iOS/Android) und was das Backend leisten muss.
                      Daraus entsteht ein MVP, das in Budget und Timeline
                      realistisch bleibt.
                    </p>
                    <p>
                      Typisch: React Native/Expo für iOS und Android, optional
                      eine Next.js Web-App oder Website, plus ein schlankes
                      Backend (Node + Postgres/Supabase) für Auth, Daten und
                      Integrationen. Ein konsistenter Stack macht Wartung
                      planbar.
                    </p>
                    <p>
                      Wenn du einen App-Auftrag vergeben und einen Freelancer
                      beauftragen willst, findest du hier Ablauf, FAQs und die
                      nächsten Schritte.
                    </p>
                  </>
                )}
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <Link
                  href={localePath(locale, "app-entwickeln-freelancer")}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-accent/40 hover:bg-accent/5"
                >
                  <p className="font-mono text-xs uppercase tracking-widest text-muted">
                    {showEnglish ? "Landing" : "Landing"}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {showEnglish
                      ? "Process, stack, and engagement"
                      : "Ablauf, Stack und Zusammenarbeit"}
                  </p>
                </Link>
                <Link
                  href={localePath(locale, "app-entwickeln-freelancer/#faq")}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-accent/40 hover:bg-accent/5"
                >
                  <p className="font-mono text-xs uppercase tracking-widest text-muted">
                    FAQ
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {showEnglish
                      ? "How to get an app built"
                      : "Wie lasse ich eine App machen?"}
                  </p>
                </Link>
                <Link
                  href={localePath(locale, "#contact")}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-accent/40 hover:bg-accent/5"
                >
                  <p className="font-mono text-xs uppercase tracking-widest text-muted">
                    {showEnglish ? "Next step" : "Nächster Schritt"}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {showEnglish ? "Request a quote" : "Projekt anfragen"}
                  </p>
                </Link>
              </div>
            </section>

            <section id="zusammenarbeit" className="mt-24 scroll-mt-28">
              <SectionHeading
                eyebrow={showEnglish ? "SMEs & teams" : "KMU & Teams"}
                title={showEnglish ? "How we work" : "Zusammenarbeit"}
                description={
                  showEnglish
                    ? "Senior-level delivery without a permanent headcount — flexible engagement models that match your roadmap and budget."
                    : "Senior-Level ohne Festanstellung — flexibel für eure Roadmap."
                }
              />
              <div className="mt-10 max-w-3xl space-y-4 text-base leading-relaxed text-stone-600 dark:text-stone-400">
                {showEnglish ? (
                  <>
                    <p>
                      Many small and mid-sized companies need experienced
                      engineering but do not want a permanent hire or a long
                      onboarding period. As a freelancer I bring senior-level
                      work on architecture, code quality, and communication, and
                      I stay plannable across project phases or a retainer when
                      that fits you better.
                    </p>
                    <p>
                      A typical collaboration: discovery → agreed scope and
                      milestones → implementation with regular reviews →
                      handover and documentation. Remote-first, time zones that
                      work for DACH, and meetings in German or English —
                      whichever your team prefers for each session.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Viele kleine und mittlere Unternehmen brauchen erfahrene
                      Entwicklung, wollen aber keine dauerhafte Vollbesetzung
                      oder lange Einarbeitung. Als Freelancer liefere ich
                      Fachniveau (Architektur, Codequalität, Kommunikation) und
                      bleibe über Projektphasen oder Retainer strukturiert
                      einplanbar.
                    </p>
                    <p>
                      Typisch: Discovery → Scope & Milestones → Umsetzung mit
                      Reviews → Übergabe & Dokumentation. Remote-first,
                      DACH-nahe Zeitzonen, Meetings auf Deutsch oder Englisch.
                    </p>
                  </>
                )}
              </div>
            </section>

            <section id="ablauf" className="mt-24 scroll-mt-28">
              <SectionHeading
                eyebrow={showEnglish ? "Process" : "Prozess"}
                title={showEnglish ? "Process" : "Ablauf"}
                description={
                  showEnglish
                    ? "Transparent steps so you always know what happens next — no black-box delivery."
                    : "Transparent — damit ihr wisst, was als Nächstes passiert."
                }
              />
              <ol className="mt-10 space-y-6 border-l border-border pl-6">
                <li className="relative">
                  <span className="font-mono text-xs uppercase tracking-widest text-accent">
                    1
                  </span>
                  <h3 className="mt-1 font-display text-lg text-foreground">
                    {showEnglish ? "Short intro call" : "Kurzes Erstgespräch"}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                    {showEnglish ? (
                      <>
                        Goals, stack, timeline, and budget — via video or{" "}
                        <a
                          href={profile.schedulingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-accent underline-offset-4 hover:underline"
                        >
                          book a 30-minute slot
                        </a>
                        .
                      </>
                    ) : (
                      <>
                        Ziel, Stack, Timeline, Budgetrahmen — per Video oder{" "}
                        <a
                          href={profile.schedulingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-accent underline-offset-4 hover:underline"
                        >
                          Termin buchen
                        </a>
                        .
                      </>
                    )}
                  </p>
                </li>
                <li>
                  <span className="font-mono text-xs uppercase tracking-widest text-accent">
                    2
                  </span>
                  <h3 className="mt-1 font-display text-lg text-foreground">
                    {showEnglish ? "Proposal & scope" : "Angebot & Scope"}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                    {showEnglish
                      ? "Clear deliverables, milestones, and communication cadence — aligned expectations on both sides before build work starts in earnest."
                      : "Klare Deliverables, Meilensteine und Kommunikationsrhythmus — keine Überraschungen bei den Kernannahmen."}
                  </p>
                </li>
                <li>
                  <span className="font-mono text-xs uppercase tracking-widest text-accent">
                    3
                  </span>
                  <h3 className="mt-1 font-display text-lg text-foreground">
                    {showEnglish ? "Build & reviews" : "Umsetzung & Reviews"}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                    {showEnglish
                      ? "Iterative delivery with demos, optional internal code review with your team, and a clean handover when you go live."
                      : "Iterativ mit demos, Code-Reviews intern bei euch optional, bis Go-Live und Übergabe."}
                  </p>
                </li>
              </ol>
            </section>

            <section id="projects" className="mt-24 scroll-mt-28">
              <SectionHeading
                eyebrow={showEnglish ? "Work" : "Referenzen"}
                title={showEnglish ? "Projects" : "Projekte"}
                description={
                  showEnglish
                    ? "Selected work — shipping, maintainable systems for web and mobile."
                    : "Ausgewählte Arbeiten — lieferfähige, wartbare Systeme für Web und Mobile."
                }
              />
              <div className="mt-12 space-y-10">
                {featured ? (
                  <ProjectCard
                    project={featured}
                    locale={locale}
                    variant="featured"
                  />
                ) : null}
                <div className="grid gap-8 sm:grid-cols-2">
                  {rest.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section id="skills" className="mt-24 scroll-mt-28">
              <SectionHeading
                eyebrow="Stack"
                title="Skills"
                description={
                  showEnglish
                    ? "Grouped by focus area."
                    : "Gruppiert nach Schwerpunkten."
                }
              />
              <div className="mt-10 space-y-10 border-t border-border pt-10">
                {skillsData.categories.map((cat) => (
                  <div key={cat.nameDe}>
                    <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
                      {showEnglish ? cat.nameEn : cat.nameDe}
                    </h3>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {cat.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground shadow-sm"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section id="contact" className="mt-28 scroll-mt-28">
              <SectionHeading
                eyebrow={showEnglish ? "Contact" : "Kontakt"}
                title={showEnglish ? "Start a project" : "Projekt anfragen"}
                description={
                  showEnglish
                    ? "Email or pick a time directly. I will reply with concrete next steps. English enquiries are welcome end to end when you prefer."
                    : "E-Mail oder direkt einen Termin wählen. Ich melde mich mit nächsten Schritten."
                }
              />
              <div className="mt-10 flex flex-col gap-8 rounded-2xl border border-border bg-card p-8 shadow-sm sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted">
                    {showEnglish ? "Email" : "E-Mail"}
                  </p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="mt-2 block text-xl font-medium text-accent underline-offset-4 transition hover:underline sm:text-2xl"
                  >
                    {profile.email}
                  </a>
                </div>
                {profile.phone ? (
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-muted">
                      {showEnglish ? "Phone" : "Telefon"}
                    </p>
                    <a
                      href={`tel:${profile.phone.replace(/\s/g, "")}`}
                      className="mt-2 block text-lg font-medium text-foreground"
                    >
                      {profile.phone}
                    </a>
                  </div>
                ) : null}
                {profile.addressDe || profile.addressEn ? (
                  <div className="sm:max-w-xs">
                    <p className="font-mono text-xs uppercase tracking-widest text-muted">
                      {showEnglish ? "Location" : "Anschrift"}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                      {showEnglish
                        ? profile.addressEn ?? profile.addressDe
                        : profile.addressDe ?? profile.addressEn}
                    </p>
                  </div>
                ) : null}
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted">
                    {showEnglish ? "Schedule" : "Termin"}
                  </p>
                  <a
                    href={profile.schedulingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 dark:text-stone-950"
                  >
                    {showEnglish ? "Book a call" : "Gespräch buchen"}
                  </a>
                  <p className="mt-2 text-xs text-stone-500">
                    {showEnglish
                      ? "30-minute call (Calendly)"
                      : "30 Minuten (Calendly)"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 sm:w-full sm:justify-end">
                  {profile.social.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:border-accent/40 hover:bg-accent/5"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </section>
          </main>

          <footer className="border-t border-border py-10">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="font-mono text-xs text-muted">
                © {new Date().getFullYear()} {profile.name}.{" "}
                {showEnglish
                  ? "Next.js, static export, Caddy."
                  : "Next.js, statischer Export, Caddy."}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs text-muted">
                <Link
                  href={impressumPath(locale)}
                  className="underline-offset-4 transition hover:text-foreground hover:underline"
                >
                  {showEnglish ? "Imprint" : "Impressum"}
                </Link>
                <span aria-hidden className="text-border">
                  ·
                </span>
                <Link
                  href={datenschutzPath(locale)}
                  className="underline-offset-4 transition hover:text-foreground hover:underline"
                >
                  {showEnglish ? "Privacy" : "Datenschutz"}
                </Link>
              </div>
            </div>
          </footer>
        </div>

        {showIntro ? (
          <IntroSequence
            fullName={profile.name}
            onFadeStart={() => setIntroPhase("fading")}
            onComplete={() => {
              writeIntroBlockedUntil();
              setIntroPhase("done");
            }}
          />
        ) : null}
      </div>
    </LenisProvider>
  );
}
