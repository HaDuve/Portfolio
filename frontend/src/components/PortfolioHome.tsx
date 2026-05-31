"use client";

import Link from "next/link";
import { useLayoutEffect, useState, useSyncExternalStore } from "react";
import { Hero } from "@/components/Hero";
import { CredibilityStrip } from "@/components/CredibilityStrip";
import { FreelanceLane } from "@/components/FreelanceLane";
import { CoachingLane } from "@/components/CoachingLane";
import { SchedulingLink } from "@/components/SchedulingLink";
import { HubBlock } from "@/components/HubBlock";
import { IntroSequence } from "@/components/IntroSequence";
import { LenisProvider } from "@/components/LenisProvider";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import type { Profile, Project } from "@/types/content";
import { projectsForHomeGrid } from "@/lib/homeProjectsGrid";
import {
  datenschutzPath,
  impressumPath,
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
  categories: {
    nameDe: string;
    nameEn: string;
    items: string[];
    introDe?: string;
    introEn?: string;
  }[];
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
  const gridProjects = projectsForHomeGrid(projects);
  const featured = gridProjects.find((p) => p.featured);
  const rest = gridProjects.filter((p) => !p.featured);

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
          <CredibilityStrip locale={locale} />

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-16 sm:px-6 sm:pt-20">
            <HubBlock locale={locale} />

            <div className="mt-24">
              <FreelanceLane
                locale={locale}
                schedulingUrl={profile.schedulingUrl}
                projects={projects}
              />
            </div>

            <div className="mt-24">
              <CoachingLane
                locale={locale}
                schedulingUrl={profile.schedulingUrl}
              />
            </div>

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
                    ? "Mobile-first: React Native & Expo, iOS/Android releases, plus web and backend."
                    : "Mobile-first: React Native & Expo, iOS/Android Release (App Store/Google Play), plus Web & Backend."
                }
              />
              <div className="mt-10 space-y-10 border-t border-border pt-10">
                {skillsData.categories.map((cat) => (
                  <div key={cat.nameDe}>
                    <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
                      {showEnglish ? cat.nameEn : cat.nameDe}
                    </h3>
                    {cat.introDe || cat.introEn ? (
                      <p className="mt-3 max-w-3xl text-sm text-muted">
                        {showEnglish ? cat.introEn : cat.introDe}
                      </p>
                    ) : null}
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
                    ? "Pick a time directly. I will reply with concrete next steps. English enquiries are welcome end to end when you prefer."
                    : "Direkt einen Termin wählen. Ich melde mich mit nächsten Schritten."
                }
              />
              <div className="mt-10 flex flex-col gap-8 rounded-2xl border border-border bg-card p-8 shadow-sm sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted">
                    {showEnglish ? "Schedule" : "Termin"}
                  </p>
                  <SchedulingLink
                    href={profile.schedulingUrl}
                    placement="contact-freelance"
                    locale={locale}
                    className="mt-2 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 dark:text-stone-950"
                  >
                    {showEnglish ? "Book a call" : "Gespräch buchen"}
                  </SchedulingLink>
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
