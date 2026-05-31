import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

const homeSource = readFileSync(
  path.join(__dirname, "../components/PortfolioHome.tsx"),
  "utf8",
);

describe("PortfolioHome dual-lane assembly", () => {
  it("does not render the retired HubBlock", () => {
    expect(homeSource).not.toMatch(/HubBlock/);
    expect(homeSource).not.toMatch(/id="hub"/);
  });

  it("does not render a separate projects grid (featured work lives in Freelance Lane)", () => {
    expect(homeSource).not.toMatch(/id="projects"/);
    expect(homeSource).not.toMatch(/ProjectCard/);
    expect(homeSource).not.toMatch(/projectsForHomeGrid/);
  });

  it("composes sections in ADR-0004 order inside main", () => {
    const mainStart = homeSource.indexOf("<main");
    const mainEnd = homeSource.indexOf("</main>");
    expect(mainStart).toBeGreaterThan(-1);
    expect(mainEnd).toBeGreaterThan(mainStart);
    const main = homeSource.slice(mainStart, mainEnd);

    const freelancePos = main.indexOf("<FreelanceLane");
    const coachingPos = main.indexOf("<CoachingLane");
    const skillsPos = main.indexOf('id="skills"');
    const contactPos = main.indexOf('id="contact"');

    expect(freelancePos).toBeGreaterThan(-1);
    expect(coachingPos).toBeGreaterThan(freelancePos);
    expect(skillsPos).toBeGreaterThan(coachingPos);
    expect(contactPos).toBeGreaterThan(skillsPos);
  });

  it("renders hero and credibility strip before main content", () => {
    const heroPos = homeSource.indexOf("<Hero");
    const stripPos = homeSource.indexOf("<CredibilityStrip");
    const mainPos = homeSource.indexOf("<main");
    expect(heroPos).toBeGreaterThan(-1);
    expect(stripPos).toBeGreaterThan(heroPos);
    expect(mainPos).toBeGreaterThan(stripPos);
  });
});
