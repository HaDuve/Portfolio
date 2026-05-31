import { describe, it, expect } from "vitest";
import {
  coachingSections,
  coachingFaq,
  coachingMeta,
} from "./programmierenLernenMitKi";

const REQUIRED_SECTION_KEYS = [
  "eyebrow",
  "h1",
  "lead",
  "toolsTitle",
  "tools",
  "fitTitle",
  "fit",
  "alsoFit",
  "scopeTitle",
  "scopeExamples",
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

    it(`${locale} scopeExamples has at least three items`, () => {
      expect(coachingSections[locale].scopeExamples.length).toBeGreaterThanOrEqual(
        3,
      );
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

  it("de title does not use redundant (DE) suffix", () => {
    expect(coachingMeta.de.title).not.toMatch(/\(DE\)/);
  });
});

describe("coachingSections audience copy", () => {
  it("de fit focuses on beginners; alsoFit covers engineers without repeating fit", () => {
    const { fit, alsoFit } = coachingSections.de;
    expect(fit).not.toMatch(/Software-Engineer/i);
    expect(alsoFit).toMatch(/Software-Engineer/i);
    expect(fit).not.toEqual(alsoFit);
  });

  it("en fit focuses on beginners; alsoFit covers engineers without repeating fit", () => {
    const { fit, alsoFit } = coachingSections.en;
    expect(fit).not.toMatch(/software engineer/i);
    expect(alsoFit).toMatch(/software engineer/i);
    expect(fit).not.toEqual(alsoFit);
  });
});
