import { describe, it, expect } from "vitest";
import { skillsCompactTags } from "./skillsCompactTags";

const sampleCategories = [
  {
    nameDe: "Mobile",
    nameEn: "Mobile",
    items: ["React Native", "Expo", "TypeScript"],
  },
  {
    nameDe: "Web",
    nameEn: "Web",
    items: ["TypeScript", "Next.js"],
  },
];

describe("skillsCompactTags", () => {
  it("flattens categories into a deduped tag list preserving first-seen order", () => {
    expect(skillsCompactTags(sampleCategories)).toEqual([
      "React Native",
      "Expo",
      "TypeScript",
      "Next.js",
    ]);
  });
});
