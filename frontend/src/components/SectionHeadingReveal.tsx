"use client";

import { motion, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeadingReveal({ eyebrow, title, description }: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className="max-w-2xl">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
        <h2 className="font-display mt-3 text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-base leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-2xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.08, delayChildren: 0.04 },
        },
      }}
    >
      <motion.p
        className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent"
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
        }}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        className="font-display mt-3 text-3xl font-normal tracking-tight text-foreground sm:text-4xl"
        variants={{
          hidden: { opacity: 0, y: 22 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
        }}
      >
        {title}
      </motion.h2>
      {description ? (
        <motion.p
          className="mt-3 text-base leading-relaxed text-muted"
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
          }}
        >
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
