"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import type { Profile } from "@/types/content";
import { heroCopy } from "@/lib/heroCopy";
import { heroProofShots } from "@/lib/heroProofShots";
import { type Locale } from "@/lib/i18n";
import { SchedulingLink } from "./SchedulingLink";

const ease = [0.16, 1, 0.3, 1] as const;

type Props = { profile: Profile; introDone: boolean; locale: Locale };

export function Hero({ profile, introDone, locale }: Props) {
  const copy = heroCopy(locale);
  const proofShots = heroProofShots(locale);
  const reduce = useReducedMotion();
  const showContent = reduce || introDone;

  return (
    <section
      id="hero"
      className="relative scroll-mt-24 overflow-hidden border-b border-border"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_85%_15%,var(--accent-muted),transparent_65%)]"
        aria-hidden
      />
      <div className="grain pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto grid max-w-6xl items-end gap-12 px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-28 lg:grid-cols-[1fr_minmax(280px,420px)] lg:items-center lg:gap-16 lg:pt-36">
        <div className="min-w-0 max-w-[38rem]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {copy.eyebrow}
          </p>
          <h1 className="font-display mt-4 text-[clamp(2.5rem,5.5vw,3.75rem)] font-normal leading-[1.05] tracking-tight text-foreground">
            {copy.headline}
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
              className="mt-5 max-w-[34rem] text-[1.0625rem] leading-relaxed text-muted"
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease },
                },
              }}
            >
              {copy.subhead}
            </motion.p>
            <motion.div
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.48, ease },
                },
              }}
            >
              <SchedulingLink
                href={profile.schedulingUrl}
                placement={copy.ctaFreelancePlacement}
                locale={locale}
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 dark:text-stone-950"
              >
                {copy.ctaFreelance}
              </SchedulingLink>
              <SchedulingLink
                href={profile.schedulingUrl}
                placement={copy.ctaCoachingPlacement}
                locale={locale}
                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium transition hover:border-accent/40 hover:bg-accent/5"
              >
                {copy.ctaCoaching}
              </SchedulingLink>
            </motion.div>
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-[420px] lg:mx-0 lg:min-h-[300px] lg:justify-self-end">
          {proofShots.map((shot) => (
            <figure
              key={shot.variant}
              className={
                shot.variant === "phone"
                  ? "relative z-10 mx-auto w-[min(70%,220px)] overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-lg sm:w-[min(55%,240px)] lg:absolute lg:right-0 lg:top-1/2 lg:w-[min(68%,260px)] lg:-translate-y-1/2"
                  : "relative z-0 mt-4 w-full overflow-hidden rounded-xl border border-border bg-card shadow-md lg:absolute lg:left-0 lg:top-1/2 lg:mt-0 lg:w-full lg:-translate-x-6 lg:-translate-y-1/2"
              }
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                className="h-auto w-full object-cover"
                priority={shot.variant === "phone"}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
