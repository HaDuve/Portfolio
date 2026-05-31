import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const componentSource = readFileSync(
  path.join(__dirname, "../components/SectionHeadingMotion.tsx"),
  "utf8",
);

describe("SectionHeadingMotion", () => {
  it("uses static SectionHeading when scroll reveals are off", () => {
    expect(componentSource).toMatch(/if \(!scrollReveal\)/);
    expect(componentSource).toMatch(/<SectionHeading/);
  });

  it("uses SectionHeadingReveal when scroll reveals are on", () => {
    expect(componentSource).toMatch(/<SectionHeadingReveal/);
  });
});
