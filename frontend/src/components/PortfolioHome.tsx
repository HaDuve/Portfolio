"use client";

import Link from "next/link";
import { useLayoutEffect, useState, useSyncExternalStore } from "react";
import { Hero } from "@/components/Hero";
import { CredibilityStrip } from "@/components/CredibilityStrip";
import { FreelanceLane } from "@/components/FreelanceLane";
import { CoachingLane } from "@/components/CoachingLane";
import { SchedulingLink } from "@/components/SchedulingLink";
import { siteChromeCopy } from "@/lib/siteChromeCopy";
import { skillsCompactTags, type SkillsCategory } from "@/lib/skillsCompactTags";
import { IntroSequence } from "@/components/IntroSequence";
import { LenisProvider } from "@/components/LenisProvider";
import { SectionHeading } from "@/components/SectionHeading";
import type { Profile, Project } from "@/types/content";
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
  categories: SkillsCategory[];
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
  const chrome = siteChromeCopy(locale);
  const skillTags = skillsCompactTags(skillsData.categories);

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
            <FreelanceLane
              locale={locale}
              schedulingUrl={profile.schedulingUrl}
              projects={projects}
            />

            <div className="mt-24">
              <CoachingLane
                locale={locale}
                schedulingUrl={profile.schedulingUrl}
              />
            </div>

            <section id="skills" className="mt-24 scroll-mt-28">
              <SectionHeading
                eyebrow={chrome.skills.eyebrow}
                title={chrome.skills.title}
                description={chrome.skills.description}
              />
              <ul className="mt-5 flex flex-wrap gap-2">
                {skillTags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-[0.8125rem] text-foreground"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </section>

            <section id="contact" className="mt-28 scroll-mt-28">
              <SectionHeading
                eyebrow={chrome.contact.eyebrow}
                title={chrome.contact.title}
                description={chrome.contact.description}
              />
              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                <article className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <p className="font-mono text-xs font-medium uppercase tracking-widest text-accent">
                    {chrome.contact.freelanceEyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-xl tracking-tight text-foreground">
                    {chrome.contact.freelanceLaneTitle}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted">
                    {chrome.contact.freelanceDescription}
                  </p>
                  <SchedulingLink
                    href={profile.schedulingUrl}
                    placement={chrome.contact.freelanceCta.placement}
                    locale={locale}
                    className="mt-6 inline-flex w-fit rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-stone-950"
                  >
                    {chrome.contact.freelanceCta.label}
                  </SchedulingLink>
                </article>
                <article className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <p className="font-mono text-xs font-medium uppercase tracking-widest text-accent">
                    {chrome.contact.coachingEyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-xl tracking-tight text-foreground">
                    {chrome.contact.coachingLaneTitle}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted">
                    {chrome.contact.coachingDescription}
                  </p>
                  <SchedulingLink
                    href={profile.schedulingUrl}
                    placement={chrome.contact.coachingCta.placement}
                    locale={locale}
                    className="mt-6 inline-flex w-fit rounded-full border border-border bg-transparent px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:bg-accent/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {chrome.contact.coachingCta.label}
                  </SchedulingLink>
                </article>
              </div>
              <div className="mt-8">
                <p className="font-mono text-xs font-medium uppercase tracking-widest text-accent">
                  {chrome.contact.socialEyebrow}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.social.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:border-accent/40 hover:bg-accent/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
                {locale === "en"
                  ? "Next.js, static export, Caddy."
                  : "Next.js, statischer Export, Caddy."}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs text-muted">
                <Link
                  href={impressumPath(locale)}
                  className="underline-offset-4 transition hover:text-foreground hover:underline"
                >
                  {locale === "en" ? "Imprint" : "Impressum"}
                </Link>
                <span aria-hidden className="text-border">
                  ·
                </span>
                <Link
                  href={datenschutzPath(locale)}
                  className="underline-offset-4 transition hover:text-foreground hover:underline"
                >
                  {locale === "en" ? "Privacy" : "Datenschutz"}
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
