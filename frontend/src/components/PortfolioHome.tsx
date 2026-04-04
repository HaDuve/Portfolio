"use client";

import { useState, useSyncExternalStore } from "react";
import { Hero } from "@/components/Hero";
import { IntroSequence } from "@/components/IntroSequence";
import { LenisProvider } from "@/components/LenisProvider";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeadingReveal } from "@/components/SectionHeadingReveal";
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
    <LenisProvider enabled={introDone}>
      <div id="top" className="relative flex flex-1 flex-col">
        {/* Do not animate opacity on this wrapper: it breaks whileInView / Reveal on descendants (cards stay opacity:0). The intro overlay covers the page instead. */}
        <div
          className={`flex flex-1 flex-col ${introDone ? "" : "pointer-events-none"}`}
          aria-hidden={!introDone}
        >
          <Hero profile={profile} />

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-16 sm:px-6 sm:pt-20">
            <section id="projects" className="scroll-mt-28">
              <SectionHeadingReveal
                eyebrow="Work"
                title="Projects"
                description="Selected builds — shipping, maintainable systems across web and mobile."
              />
              <Reveal>
                <div className="mt-12 space-y-10">
                  {featured ? (
                    <ProjectCard
                      project={featured}
                      variant="featured"
                      index={0}
                    />
                  ) : null}
                  <div className="grid gap-8 sm:grid-cols-2">
                    {rest.map((project, i) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={featured ? i + 1 : i}
                      />
                    ))}
                  </div>
                </div>
              </Reveal>
            </section>

            <section id="skills" className="scroll-mt-28">
              <SectionHeadingReveal
                eyebrow="Stack"
                title="Skills"
                description="Grouped by areas of expertise."
              />
              <div className="mt-10 space-y-10 border-t border-border pt-10">
                {skillsData.categories.map((cat) => (
                  <Reveal key={cat.name} delay={0.05}>
                    <div>
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
                  </Reveal>
                ))}
              </div>
            </section>

            <Reveal className="mt-28 block" delay={0.08}>
              <section id="contact" className="scroll-mt-28">
                <SectionHeadingReveal
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
            </Reveal>
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
