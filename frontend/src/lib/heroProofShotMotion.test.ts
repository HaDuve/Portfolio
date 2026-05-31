import { describe, expect, it } from "vitest";
import {
  browserXFromSeparation,
  phoneXFromSeparation,
  proofShotSeparationTransition,
  PROOF_SHOT_SEPARATION_PX,
} from "./heroProofShotMotion";

describe("proofShotSeparationTransition", () => {
  it("uses spring physics so horizontal travel eases in and out", () => {
    expect(proofShotSeparationTransition()).toMatchObject({
      type: "spring",
    });
    expect(proofShotSeparationTransition()).not.toHaveProperty("duration");
  });
});

describe("proof shot x offsets", () => {
  it("maps halfway separation to half the horizontal travel", () => {
    expect(phoneXFromSeparation(0.5)).toBe(PROOF_SHOT_SEPARATION_PX / 2);
    expect(browserXFromSeparation(0.5)).toBe(-48 - PROOF_SHOT_SEPARATION_PX / 2);
  });

  it("returns rest offsets at zero separation", () => {
    expect(phoneXFromSeparation(0)).toBe(0);
    expect(browserXFromSeparation(0)).toBe(-48);
  });

  it("returns peak spread offsets at full separation", () => {
    expect(phoneXFromSeparation(1)).toBe(PROOF_SHOT_SEPARATION_PX);
    expect(browserXFromSeparation(1)).toBe(-48 - PROOF_SHOT_SEPARATION_PX);
  });
});
