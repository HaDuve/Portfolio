"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

type Props = {
  imageUrl: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** Outer frame: aspect + overflow hidden */
  frameClassName: string;
};

export function ParallaxMedia({
  imageUrl,
  alt,
  sizes,
  priority,
  frameClassName,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  if (reduce) {
    return (
      <div className={frameClassName}>
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
          sizes={sizes}
          priority={priority}
        />
      </div>
    );
  }

  return (
    <div ref={ref} className={frameClassName}>
      <motion.div
        style={{ y }}
        className="absolute inset-0 h-[120%] w-full -top-[10%] will-change-transform"
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
          sizes={sizes}
          priority={priority}
        />
      </motion.div>
    </div>
  );
}
