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
        className="relative mx-auto aspect-square w-[min(92vw,300px)] max-w-[min(100%,400px)] sm:w-[min(80vw,360px)] lg:mx-0 lg:ml-auto lg:w-full"
        aria-hidden
      >
        <Image
          src={FAN_SRC}
          alt=""
          fill
          sizes="(max-width: 1024px) 92vw, 400px"
          className="object-contain object-center drop-shadow-[0_16px_48px_rgba(0,0,0,0.14)] dark:drop-shadow-[0_20px_56px_rgba(0,0,0,0.4)]"
          priority
        />
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto aspect-square w-[min(92vw,300px)] max-w-[min(100%,400px)] sm:w-[min(80vw,360px)] lg:mx-0 lg:ml-auto lg:w-full"
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
          sizes="(max-width: 1024px) 92vw, 400px"
          className="object-contain object-center drop-shadow-[0_16px_48px_rgba(0,0,0,0.14)] dark:drop-shadow-[0_20px_56px_rgba(0,0,0,0.4)]"
          priority
        />
      </motion.div>
    </div>
  );
}
