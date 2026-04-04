"use client";

import { useState, useSyncExternalStore } from "react";
import { Hero } from "@/components/Hero";
import { IntroSequence } from "@/components/IntroSequence";
import { LenisProvider } from "@/components/LenisProvider";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import type { Profile, Project } from "@/types/content";

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type SkillsData = {
  categories: { name: string; items: string[] }[];
};

type Props = {
  profile: Profile;
  projects: Project[];
  skillsData: SkillsData;
};

export function PortfolioHome({ profile, projects, skillsData }: Props) {
  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  const [introFinished, setIntroFinished] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );

  const introDone = prefersReducedMotion || introFinished;
  const showIntro = !prefersReducedMotion && !introFinished;

  return (
    <LenisProvider enabled={false}>
      <div id="top" className="relative flex flex-1 flex-col">
        {/* Intro overlay covers the page; do not fade this wrapper (opacity breaks nested scroll observers). */}
        <div
          className={`flex flex-1 flex-col ${introDone ? "" : "pointer-events-none"}`}
          aria-hidden={!introDone}
        >
          <Hero profile={profile} />

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-16 sm:px-6 sm:pt-20">
            <section id="projects" className="scroll-mt-28">
              <SectionHeading
                eyebrow="Work"
                title="Projects"
                description="Selected builds — shipping, maintainable systems across web and mobile."
              />
              <div className="mt-12 space-y-10">
                {featured ? (
                  <ProjectCard project={featured} variant="featured" />
                ) : null}
                <div className="grid gap-8 sm:grid-cols-2">
                  {rest.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            </section>

            <section id="skills" className="scroll-mt-28">
              <SectionHeading
                eyebrow="Stack"
                title="Skills"
                description="Grouped by areas of expertise."
              />
              <div className="mt-10 space-y-10 border-t border-border pt-10">
                {skillsData.categories.map((cat) => (
                  <div key={cat.name}>
                    <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
                      {cat.name}
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
                eyebrow="Hello"
                title="Contact"
                description="Email is best for project inquiries and collaborations."
              />
              <div className="mt-10 flex flex-col gap-8 rounded-2xl border border-border bg-card p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted">
                    Email
                  </p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="mt-2 block text-xl font-medium text-accent underline-offset-4 transition hover:underline sm:text-2xl"
                  >
                    {profile.email}
                  </a>
                </div>
                <div className="flex flex-wrap gap-3">
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
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <p className="font-mono text-xs text-muted">
                © {new Date().getFullYear()} {profile.name}. Next.js, static
                export, Caddy.
              </p>
            </div>
          </footer>
        </div>

        {showIntro ? (
          <IntroSequence
            fullName={profile.name}
            onComplete={() => setIntroFinished(true)}
          />
        ) : null}
      </div>
    </LenisProvider>
  );
}
