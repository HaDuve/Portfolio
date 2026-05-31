import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

const laneSource = readFileSync(
  path.join(__dirname, "../components/CoachingLane.tsx"),
  "utf8",
);

describe("Coaching Lane responsive layout contract", () => {
  it("constrains timeline and FAQ cells with min-w-0", () => {
    expect(laneSource).toContain("min-w-0");
  });

  it("wraps tools and lane footer instead of forcing horizontal scroll", () => {
    expect(laneSource).toMatch(/flex flex-wrap/);
  });

  it("uses a responsive timeline grid that expands on md+ viewports", () => {
    expect(laneSource).toMatch(/md:grid-cols-4/);
    expect(laneSource).toMatch(/md:max-w-none/);
  });
});
