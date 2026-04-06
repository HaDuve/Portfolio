"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import type { Profile } from "@/types/content";
import { heroH1Subtitle, type Locale } from "@/lib/i18n";
import { HeroFan } from "./HeroFan";

const ease = [0.16, 1, 0.3, 1] as const;

type Props = { profile: Profile; introDone: boolean; locale: Locale };

export function Hero({ profile, introDone, locale }: Props) {
  const showEnglish = locale === "en";
  const reduce = useReducedMotion();
  const showContent = reduce || introDone;
  const sectionRef = useRef<HTMLElement>(null);

  const tagline = showEnglish ? profile.taglineEn : profile.taglineDe;
  const bio = showEnglish ? profile.bioEn : profile.bioDe;
  const location = showEnglish ? profile.locationEn : profile.locationDe;
  const ctaPrimary = showEnglish ? "Book a call" : "Gespräch buchen";
  const ctaSecondary = showEnglish ? "Contact" : "Kontakt";
  const portrait = profile.portraitSrc ?? "/profile.jpg";

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative scroll-mt-24 overflow-hidden border-b border-border"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_-10%,var(--accent-muted),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-0 h-[min(70vw,28rem)] w-[min(70vw,28rem)] rounded-full bg-accent/10 blur-3xl dark:bg-accent/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-stone-400/15 blur-3xl dark:bg-stone-500/10"
        aria-hidden
      />
      <div className="grain pointer-events-none absolute inset-0" aria-hidden />

      <div
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-end overflow-hidden"
        aria-hidden
      >
        <HeroFan sectionRef={sectionRef} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl pb-24 pt-16 pl-4 pe-[clamp(1.25rem,min(38vw,22rem))] sm:pb-32 sm:pt-20 sm:pl-6 sm:pe-[clamp(1.25rem,min(34vw,28rem))]">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(200px,280px)_minmax(0,1fr)] lg:gap-14">
          <motion.div
            className="mx-auto flex w-full max-w-[280px] justify-center lg:mx-0 lg:max-w-none lg:justify-start"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={
              showContent
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 12 }
            }
            transition={{ duration: 0.45, ease }}
          >
            <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-border/60">
              <Image
                src={portrait}
                alt={profile.name}
                width={560}
                height={560}
                priority
                className="h-full w-full object-cover object-top"
                sizes="(max-width: 1024px) 280px, 280px"
              />
            </div>
          </motion.div>
          <div className="min-w-0 max-w-3xl rounded-xl border border-border bg-background p-6 sm:p-8">
            {/* Eyebrow + H1 stay out of opacity-0 motion so LCP can paint while the intro overlay runs. */}
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
              Portfolio
            </p>
            <h1 className="font-display mt-5 text-[clamp(2.5rem,6vw,4rem)] font-normal leading-[1.05] tracking-tight text-foreground">
              <span className="block">{profile.name}</span>
              <span className="mt-3 block max-w-4xl text-[clamp(1.05rem,2.8vw,1.65rem)] font-normal leading-snug tracking-normal text-stone-600 dark:text-stone-400">
                {heroH1Subtitle[locale]}
              </span>
            </h1>
            <motion.div
              initial={reduce ? false : "hidden"}
              animate={showContent ? "visible" : "hidden"}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: reduce ? 0 : 0.09,
                    delayChildren: reduce ? 0 : 0.06,
                  },
                },
              }}
            >
              <motion.p
                className="mt-5 max-w-xl text-lg leading-relaxed text-muted sm:text-xl"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease },
                  },
                }}
              >
                {tagline}
              </motion.p>
              <motion.p
                className="mt-6 max-w-2xl text-base leading-relaxed text-stone-600 dark:text-stone-400 sm:text-[1.05rem]"
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease },
                  },
                }}
              >
                {bio}
              </motion.p>
              <motion.div
                className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center"
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.48, ease },
                  },
                }}
              >
                <a
                  href={profile.schedulingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 dark:text-stone-950"
                >
                  {ctaPrimary}
                </a>
                <a
                  href={`/${locale}/#contact`}
                  className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium transition hover:border-accent/40 hover:bg-accent/5"
                >
                  {ctaSecondary}
                </a>
              </motion.div>
              <motion.p
                className="mt-6 font-mono text-xs uppercase tracking-widest text-muted"
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.45, ease },
                  },
                }}
              >
                {location}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
