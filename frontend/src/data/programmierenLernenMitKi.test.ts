import { describe, it, expect } from "vitest";
import {
  coachingSections,
  coachingFaq,
  coachingMeta,
} from "./programmierenLernenMitKi";

const REQUIRED_SECTION_KEYS = [
  "h1",
  "lead",
  "toolsTitle",
  "tools",
  "fit",
  "processTitle",
  "processSteps",
  "price",
  "ctaTitle",
  "ctaBody",
] as const;

describe("coachingSections shape", () => {
  for (const locale of ["de", "en"] as const) {
    it(`${locale} section has all required fields`, () => {
      const section = coachingSections[locale];
      for (const key of REQUIRED_SECTION_KEYS) {
        expect(section).toHaveProperty(key);
      }
    });

    it(`${locale} processSteps is a non-empty array`, () => {
      expect(coachingSections[locale].processSteps.length).toBeGreaterThan(0);
    });
  }
});

describe("coachingFaq shape", () => {
  for (const locale of ["de", "en"] as const) {
    it(`${locale} FAQ has at least one item with question and answer`, () => {
      const items = coachingFaq[locale];
      expect(items.length).toBeGreaterThan(0);
      expect(items[0]).toHaveProperty("question");
      expect(items[0]).toHaveProperty("answer");
    });
  }
});

describe("coachingMeta shape", () => {
  for (const locale of ["de", "en"] as const) {
    it(`${locale} meta has title and description`, () => {
      expect(coachingMeta[locale]).toHaveProperty("title");
      expect(coachingMeta[locale]).toHaveProperty("description");
    });
  }
});
