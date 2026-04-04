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
  /** App screenshots: centered, 90% of frame height, contain (web uses full-bleed cover) */
  mediaKind?: "app" | "web";
};

const webImgClass =
  "object-cover transition duration-500 ease-out group-hover:scale-75";
const appImgClass =
  "object-contain object-center transition duration-500 ease-out group-hover:scale-75";

export function ParallaxMedia({
  imageUrl,
  alt,
  sizes,
  priority,
  frameClassName,
  mediaKind = "web",
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const yApp = useTransform(scrollYProgress, [0, 1], ["-7.5%", "7.5%"]);

  if (mediaKind === "app") {
    const appContent = (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[90%] w-full">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className={appImgClass}
            sizes={sizes}
            priority={priority}
          />
        </div>
      </div>
    );

    if (reduce) {
      return (
        <div ref={ref} className={frameClassName}>
          {appContent}
        </div>
      );
    }

    return (
      <div ref={ref} className={frameClassName}>
        <motion.div
          style={{ y: yApp }}
          className="absolute inset-0 will-change-transform"
        >
          {appContent}
        </motion.div>
      </div>
    );
  }

  if (reduce) {
    return (
      <div ref={ref} className={frameClassName}>
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className={webImgClass}
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
        className="absolute inset-0 h-[125%] w-full -top-[12.5%] will-change-transform"
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className={webImgClass}
          sizes={sizes}
          priority={priority}
        />
      </motion.div>
    </div>
  );
}
