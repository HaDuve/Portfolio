import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

const componentsDir = path.join(__dirname, "../components");

const RETIRED_PROJECT_SHOWCASE = [
  "HeroFan.tsx",
  "ParallaxLetter.tsx",
  "ParallaxMedia.tsx",
  "ProjectMediaCarousel.tsx",
  "ProjectCard.tsx",
] as const;

describe("retired project showcase components", () => {
  it("removes orphaned parallax carousel modules after ProjectCard retirement", () => {
    for (const file of RETIRED_PROJECT_SHOWCASE) {
      expect(existsSync(path.join(componentsDir, file))).toBe(false);
    }
  });
});
