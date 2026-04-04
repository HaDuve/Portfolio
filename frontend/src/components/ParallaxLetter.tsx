"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type Props = {
  letter: string;
  /** Outer frame: aspect + overflow hidden (must include `relative`) */
  frameClassName: string;
  /** Larger type in featured cards */
  isFeatured?: boolean;
};

const charClassDefault =
  "font-display font-normal text-stone-400/90 dark:text-stone-600 text-5xl sm:text-6xl";
const charClassFeatured =
  "font-display font-normal text-stone-400/90 dark:text-stone-600 text-6xl sm:text-8xl";

export function ParallaxLetter({
  letter,
  frameClassName,
  isFeatured = false,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-17.5%", "17.5%"]);

  const charClass = isFeatured ? charClassFeatured : charClassDefault;

  if (reduce) {
    return (
      <div className={frameClassName}>
        <div className="flex h-full items-center justify-center">
          <span className={charClass} aria-hidden>
            {letter}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={frameClassName}>
      <motion.div
        style={{ y }}
        className="absolute inset-0 flex h-[130%] w-full -top-[15%] items-center justify-center will-change-transform"
      >
        <span className={charClass} aria-hidden>
          {letter}
        </span>
      </motion.div>
    </div>
  );
}
