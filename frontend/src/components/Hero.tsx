"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import type { Profile } from "@/types/content";
import { HeroFan } from "./HeroFan";

const ease = [0.16, 1, 0.3, 1] as const;

type Props = { profile: Profile; introDone: boolean };

export function Hero({ profile, introDone }: Props) {
  const reduce = useReducedMotion();
  const showContent = reduce || introDone;
  const sectionRef = useRef<HTMLElement>(null);

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

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(240px,420px)] lg:gap-14 xl:gap-16">
          <motion.div
            className="min-w-0 max-w-3xl"
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
              className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent"
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease },
                },
              }}
            >
              Portfolio
            </motion.p>
            <motion.h1
              className="font-display mt-5 text-[clamp(2.5rem,6vw,4rem)] font-normal leading-[1.05] tracking-tight text-foreground"
              variants={{
                hidden: { opacity: 0, y: 22 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.55, ease },
                },
              }}
            >
              {profile.name}
            </motion.h1>
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
              {profile.tagline}
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
              {profile.bio}
            </motion.p>
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
              {profile.location}
            </motion.p>
          </motion.div>

          <motion.div
            className="flex min-w-0 justify-center lg:justify-end lg:pt-2"
            initial={reduce ? false : "hidden"}
            animate={showContent ? "visible" : "hidden"}
            variants={{
              hidden: {
                opacity: 0,
                y: 28,
                scale: 0.88,
                rotate: -22,
                filter: "blur(8px)",
              },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 0.85,
                  ease,
                  delay: reduce ? 0 : 0.36,
                },
              },
            }}
            style={{ transformOrigin: "50% 50%" }}
          >
            <HeroFan sectionRef={sectionRef} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
