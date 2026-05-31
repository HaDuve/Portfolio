import { describe, it, expect } from "vitest";
import {
  createLenisOptionsForMotion,
  lenisUsesMotionFrameLoop,
} from "./lenisMotionIntegration";

describe("lenisMotionIntegration", () => {
  it("drives Lenis from Motion's frame loop so whileInView stays in sync", () => {
    expect(lenisUsesMotionFrameLoop()).toBe(true);
  });

  it("disables Lenis autoRaf when Motion owns the animation frame", () => {
    expect(createLenisOptionsForMotion()).toEqual({ autoRaf: false });
  });
});
