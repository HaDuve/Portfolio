"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import Image from "next/image";
import type { Profile } from "@/types/content";
import { heroCopy } from "@/lib/heroCopy";
import {
  browserXFromSeparation,
  phoneXFromSeparation,
  proofShotSeparationTransition,
} from "@/lib/heroProofShotMotion";
import {
  createProofShotSwapController,
  DEFAULT_FRONT_PROOF_SHOT,
  isLgViewport,
  proofShotFrontFromPointer,
  type ProofShotSwapDeps,
} from "@/lib/heroProofShotSwap";
import { heroProofShots } from "@/lib/heroProofShots";
import { type Locale } from "@/lib/i18n";
import { SchedulingLink } from "./SchedulingLink";

const ease = [0.16, 1, 0.3, 1] as const;

type Props = { profile: Profile; introDone: boolean; locale: Locale };

function subscribeLgViewport(onStoreChange: () => void) {
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function useLgLayout() {
  return useSyncExternalStore(
    subscribeLgViewport,
    () => isLgViewport(),
    () => false,
  );
}

export function Hero({ profile, introDone, locale }: Props) {
  const copy = heroCopy(locale);
  const proofShots = heroProofShots(locale);
  const reduce = useReducedMotion();
  const isLgLayout = useLgLayout();
  const showContent = reduce || introDone;
  const [frontProofShot, setFrontProofShot] = useState(DEFAULT_FRONT_PROOF_SHOT);
  const frontRef = useRef(frontProofShot);
  const swapAbort = useRef<(() => void) | null>(null);
  const separation = useMotionValue(0);
  const phoneX = useTransform(separation, phoneXFromSeparation);
  const browserX = useTransform(separation, browserXFromSeparation);

  const animateSeparation = useCallback(
    async (to: number) => {
      swapAbort.current?.();
      const controls = animate(separation, to, proofShotSeparationTransition());
      swapAbort.current = () => controls.stop();
      try {
        await controls.finished;
      } catch {
        // Expected when a newer swap stops this tween.
      } finally {
        swapAbort.current = null;
      }
    },
    [separation],
  );

  const swapDepsRef = useRef<ProofShotSwapDeps>({
    getSeparation: () => separation.get(),
    animateSeparation,
    abortAnimation: () => swapAbort.current?.(),
    getFront: () => frontRef.current,
    setFront: (variant) => {
      frontRef.current = variant;
      setFrontProofShot(variant);
    },
    shouldAnimate: () => !reduce && isLgViewport(),
  });

  swapDepsRef.current = {
    getSeparation: () => separation.get(),
    animateSeparation,
    abortAnimation: () => swapAbort.current?.(),
    getFront: () => frontRef.current,
    setFront: (variant) => {
      frontRef.current = variant;
      setFrontProofShot(variant);
    },
    shouldAnimate: () => !reduce && isLgViewport(),
  };

  const swapControllerRef = useRef<ReturnType<
    typeof createProofShotSwapController
  > | null>(null);

  if (!swapControllerRef.current) {
    swapControllerRef.current = createProofShotSwapController({
      getSeparation: () => swapDepsRef.current.getSeparation(),
      animateSeparation: (to) => swapDepsRef.current.animateSeparation(to),
      abortAnimation: () => swapDepsRef.current.abortAnimation(),
      getFront: () => swapDepsRef.current.getFront(),
      setFront: (variant) => swapDepsRef.current.setFront(variant),
      shouldAnimate: () => swapDepsRef.current.shouldAnimate(),
    });
  }

  const requestFront = useCallback((next: typeof frontProofShot) => {
    void swapControllerRef.current?.requestFront(next);
  }, []);

  useEffect(() => {
    return () => swapAbort.current?.();
  }, []);

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

        <div
          className="relative mx-auto w-full max-w-[420px] lg:mx-0 lg:min-h-[300px] lg:justify-self-end"
          onPointerLeave={() => requestFront(DEFAULT_FRONT_PROOF_SHOT)}
          onPointerMove={(e) => {
            if (!isLgViewport()) return;
            requestFront(
              proofShotFrontFromPointer(
                e.clientX,
                e.currentTarget.getBoundingClientRect(),
              ),
            );
          }}
        >
          {proofShots.map((shot) => (
            <motion.figure
              key={shot.variant}
              tabIndex={0}
              style={{
                x: shot.variant === "phone" ? phoneX : browserX,
                ...(isLgLayout ? { y: "-50%" } : {}),
              }}
              onPointerEnter={() => requestFront(shot.variant)}
              onFocus={() => requestFront(shot.variant)}
              className={
                shot.variant === "phone"
                  ? `relative mx-auto w-[min(70%,220px)] overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-lg sm:w-[min(55%,240px)] lg:absolute lg:-right-4 lg:top-1/2 lg:w-[min(68%,260px)] ${frontProofShot === shot.variant ? "z-10 lg:shadow-lg" : "z-0"}`
                  : `relative mt-4 w-full overflow-hidden rounded-xl border border-border bg-card shadow-md lg:absolute lg:left-0 lg:top-1/2 lg:mt-0 lg:w-full ${frontProofShot === shot.variant ? "z-10 lg:shadow-lg" : "z-0"}`
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
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
