import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

const stripSource = readFileSync(
  path.join(__dirname, "../components/OfferingLadderStrip.tsx"),
  "utf8",
);

const freelanceLaneSource = readFileSync(
  path.join(__dirname, "../components/FreelanceLane.tsx"),
  "utf8",
);

const landingSource = readFileSync(
  path.join(__dirname, "../components/ServiceLandingPage.tsx"),
  "utf8",
);

describe("OfferingLadderStrip", () => {
  it("renders tiers with min-w-0 and role note for overflow-safe layout", () => {
    expect(stripSource).toContain('role="note"');
    expect(stripSource).toContain("min-w-0");
    expect(stripSource).toMatch(/ladder\.tiers\.map/);
  });
});

describe("OfferingLadderStrip consumers", () => {
  it("FreelanceLane uses the shared strip instead of inline ladder markup", () => {
    expect(freelanceLaneSource).toContain("OfferingLadderStrip");
    expect(freelanceLaneSource).not.toMatch(/ladder\.tiers\.map/);
  });

  it("ServiceLandingPage uses the shared strip for freelance variant", () => {
    expect(landingSource).toContain("OfferingLadderStrip");
    expect(landingSource).not.toMatch(/ladder\.tiers\.map/);
  });
});
