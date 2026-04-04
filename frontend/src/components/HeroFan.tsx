"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import type { RefObject } from "react";

/** Source: `assets/Fan_object.png` → copied to `public/fan-object.png` (alpha). */
const FAN_SRC = "/fan-object.png";

/** Pre-scale fan box; outer wrapper applies scale + light blur (background treatment). */
const FAN_BOX =
  "relative aspect-square w-[min(92vw,300px)] max-w-[min(100%,400px)] shrink-0";

/** Visual scale vs base box (~70% of prior 3× treatment). */
const FAN_SCALE = "scale-[2.1]";
/** Barely-there defocus so the fan stays background-like. */
const FAN_BLUR = "blur-[1px]";

type Props = {
  sectionRef: RefObject<HTMLElement | null>;
};

/** Degrees rotated while the hero section scrolls through the viewport (start → end). */
const ROTATION_RANGE = 420;

export function HeroFan({ sectionRef }: Props) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const rotateRaw = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [0, ROTATION_RANGE],
  );
  const rotate = useSpring(rotateRaw, {
    stiffness: reduce ? 500 : 55,
    damping: reduce ? 100 : 28,
    mass: reduce ? 0.1 : 0.85,
  });

  if (reduce) {
    return (
      <div
        className={`${FAN_BOX} origin-center ${FAN_SCALE} ${FAN_BLUR} opacity-90`}
        aria-hidden
      >
        <Image
          src={FAN_SRC}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, min(1200px, 90vw)"
          className="object-contain object-center drop-shadow-[0_16px_48px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_20px_56px_rgba(0,0,0,0.35)]"
          priority
        />
      </div>
    );
  }

  return (
    <div
      className={`${FAN_BOX} origin-center ${FAN_SCALE} ${FAN_BLUR} opacity-90`}
      aria-hidden
    >
      <motion.div
        className="relative h-full w-full will-change-transform"
        style={{ rotate }}
      >
        <Image
          src={FAN_SRC}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, min(1200px, 90vw)"
          className="object-contain object-center drop-shadow-[0_16px_48px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_20px_56px_rgba(0,0,0,0.35)]"
          priority
        />
      </motion.div>
    </div>
  );
}
