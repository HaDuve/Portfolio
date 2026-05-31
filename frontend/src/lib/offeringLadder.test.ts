import { describe, it, expect } from "vitest";
import { offeringBaselineEur, offeringLadder } from "./offeringLadder";

describe("offeringBaselineEur", () => {
  it("anchors hourly and coaching session at 60 EUR", () => {
    expect(offeringBaselineEur.hourly).toBe(60);
    expect(offeringBaselineEur.coachingSession).toBe(60);
  });

  it("matches ladder tier display baselines from CONTEXT / ADR-0005", () => {
    expect(offeringBaselineEur.tiers["micro-mvp"]).toBe(1200);
    expect(offeringBaselineEur.tiers.mvp).toBe(4800);
    expect(offeringBaselineEur.tiers.ongoing).toBe(1200);
  });

  it("stays aligned with displayed hourly rate copy", () => {
    expect(offeringLadder("de").hourlyRate).toMatch(/60\s*€/);
    expect(offeringLadder("en").hourlyRate).toMatch(/60\s*€/);
  });
});
