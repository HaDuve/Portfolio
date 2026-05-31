import { describe, it, expect } from "vitest";
import {
  INTRO_SEQUENCE_MAX_MS,
  MOTION_CUT_ORDER,
  ACTIVE_MOTION_CUTS,
  introSequenceDurationMs,
  resolveMotionFeatures,
} from "./motionBudget";

describe("motionBudget", () => {
  it("documents the cut order when performance budget breaks", () => {
    expect(MOTION_CUT_ORDER).toEqual(["introSequence", "smoothScroll"]);
  });

  it("keeps IntroSequence under the ~800ms budget", () => {
    expect(introSequenceDurationMs()).toBeLessThanOrEqual(INTRO_SEQUENCE_MAX_MS);
  });

  it("disables all motion when prefers-reduced-motion is set", () => {
    expect(resolveMotionFeatures(true)).toEqual({
      smoothScroll: false,
      introSequence: false,
      scrollReveals: false,
    });
  });

  it("enables motion features by default when motion is allowed", () => {
    expect(resolveMotionFeatures(false, {})).toEqual({
      smoothScroll: true,
      introSequence: true,
      scrollReveals: true,
    });
  });

  it("keeps smooth scroll and scroll reveals enabled together when uncut", () => {
    const motion = resolveMotionFeatures(false, {});
    expect(motion.smoothScroll && motion.scrollReveals).toBe(true);
  });

  it("applies documented cut order before disabling smooth scroll", () => {
    expect(resolveMotionFeatures(false, { introSequence: true })).toEqual({
      smoothScroll: true,
      introSequence: false,
      scrollReveals: true,
    });

    expect(
      resolveMotionFeatures(false, { introSequence: true, smoothScroll: true }),
    ).toEqual({
      smoothScroll: false,
      introSequence: false,
      scrollReveals: true,
    });
  });

  it("disables IntroSequence after local Lighthouse miss (2026-05-31)", () => {
    expect(ACTIVE_MOTION_CUTS.introSequence).toBe(true);
    expect(resolveMotionFeatures(false).introSequence).toBe(false);
  });
});
