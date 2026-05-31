/** Performance guardrails from docs/design-system.md */

export const INTRO_SEQUENCE_MAX_MS = 800;

/** If mobile Lighthouse Performance < 90, disable in this order and re-measure. */
export const MOTION_CUT_ORDER = ["introSequence", "smoothScroll"] as const;

export type MotionCutId = (typeof MOTION_CUT_ORDER)[number];
export type MotionCuts = Partial<Record<MotionCutId, true>>;

/** Applied when mobile Lighthouse Performance < 90 after re-measurement. */
export const ACTIVE_MOTION_CUTS: MotionCuts = { introSequence: true };

/**
 * GSAP IntroSequence timeline (seconds). Total must stay ≤ INTRO_SEQUENCE_MAX_MS.
 * Fade overlaps split so onFadeStart unblocks LCP before the overlay finishes.
 */
export const INTRO_TIMELINE = {
  letterMeet: 0.22,
  letterMeetOverlap: 0.02,
  splitPause: 0.03,
  split: 0.28,
  fade: 0.22,
  fadeOverlapWithSplit: true,
} as const;

export function introSequenceDurationMs(): number {
  const { letterMeet, splitPause, split, fade, fadeOverlapWithSplit } =
    INTRO_TIMELINE;
  const activeSeconds =
    letterMeet + splitPause + split + (fadeOverlapWithSplit ? 0 : fade);
  return Math.round(activeSeconds * 1000);
}

export type MotionFeatures = {
  smoothScroll: boolean;
  introSequence: boolean;
  scrollReveals: boolean;
};

export function resolveMotionFeatures(
  prefersReducedMotion: boolean,
  cuts: MotionCuts = ACTIVE_MOTION_CUTS,
): MotionFeatures {
  if (prefersReducedMotion) {
    return {
      smoothScroll: false,
      introSequence: false,
      scrollReveals: false,
    };
  }

  return {
    smoothScroll: !cuts.smoothScroll,
    introSequence: !cuts.introSequence,
    scrollReveals: true,
  };
}
