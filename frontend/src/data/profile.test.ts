import { describe, it, expect } from "vitest";
import profile from "./profile.json";

describe("profile.json", () => {
  it("does not retain the dropped day-rate fields (ADR-0005)", () => {
    expect(profile).not.toHaveProperty("ratesDe");
    expect(profile).not.toHaveProperty("ratesEn");
    expect(JSON.stringify(profile)).not.toMatch(/240\s*€/i);
  });
});
