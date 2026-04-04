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

const FAN_SRC = "/hero-fan.webp";

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
        className="relative mx-auto aspect-square w-[min(88vw,280px)] max-w-[340px] sm:w-[min(72vw,320px)] lg:mx-0 lg:ml-auto lg:w-full"
        aria-hidden
      >
        <Image
          src={FAN_SRC}
          alt=""
          fill
          sizes="(max-width: 1024px) 88vw, 340px"
          className="object-contain object-center drop-shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_12px_48px_rgba(0,0,0,0.35)]"
          priority
        />
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto aspect-square w-[min(88vw,280px)] max-w-[340px] sm:w-[min(72vw,320px)] lg:mx-0 lg:ml-auto lg:w-full"
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
          sizes="(max-width: 1024px) 88vw, 340px"
          className="object-contain object-center drop-shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_12px_48px_rgba(0,0,0,0.35)]"
          priority
        />
      </motion.div>
    </div>
  );
}
