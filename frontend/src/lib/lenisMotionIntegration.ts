import type { LenisOptions } from "lenis";

/** Lenis raf runs via `motion/react` `frame.update` (see LenisProvider). */
export function lenisUsesMotionFrameLoop(): boolean {
  return true;
}

export function createLenisOptionsForMotion(): LenisOptions {
  return { autoRaf: false };
}
