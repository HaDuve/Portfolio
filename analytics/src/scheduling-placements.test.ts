import { describe, it, expect } from "vitest";
import {
  offeringIntentFromPlacement,
  SCHEDULING_PLACEMENTS,
} from "./scheduling-placements.js";

describe("SCHEDULING_PLACEMENTS", () => {
  it("includes mobile menu placements for offering-aware chrome", () => {
    expect(SCHEDULING_PLACEMENTS).toContain("mobile-freelance");
    expect(SCHEDULING_PLACEMENTS).toContain("mobile-coaching");
  });
});

describe("offeringIntentFromPlacement", () => {
  it("maps mobile menu placements to offering intent", () => {
    expect(offeringIntentFromPlacement("mobile-freelance")).toBe("freelance");
    expect(offeringIntentFromPlacement("mobile-coaching")).toBe("coaching");
  });
});
