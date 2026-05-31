import { describe, it, expect } from "vitest";
import {
  appEntwickelnFreelancerFaq,
  appEntwickelnSections,
} from "./appEntwickelnFreelancer";

function assertNoBannedWords(text: string) {
  const lower = text.toLowerCase();
  expect(lower).not.toContain("weggeworfen");
  for (const word of ["trägt", "tragen"] as const) {
    expect(lower).not.toMatch(new RegExp(`\\b${word}\\b`));
  }
}

function allFreelanceLandingStrings(locale: "de" | "en"): string[] {
  const section = appEntwickelnSections[locale];
  return [
    section.h1,
    section.lead,
    section.stack,
    section.fit,
    section.processTitle,
    ...section.processSteps,
    section.scopeTitle,
    ...section.scopeExamples.flatMap((ex) => [ex.title, ex.description]),
    section.ctaTitle,
    section.ctaBody,
    ...appEntwickelnFreelancerFaq[locale].flatMap((item) => [
      item.question,
      item.answer,
    ]),
  ];
}

describe("appEntwickelnSections scope examples", () => {
  for (const locale of ["de", "en"] as const) {
    it(`${locale} exposes at least three concrete scope examples`, () => {
      expect(appEntwickelnSections[locale].scopeExamples.length).toBeGreaterThanOrEqual(
        3,
      );
    });
  }
});

describe("appEntwickelnFreelancer voice", () => {
  for (const locale of ["de", "en"] as const) {
    it(`${locale} copy avoids banned wording`, () => {
      for (const text of allFreelanceLandingStrings(locale)) {
        assertNoBannedWords(text);
      }
    });
  }
});

describe("appEntwickelnFreelancerFaq depth", () => {
  for (const locale of ["de", "en"] as const) {
    it(`${locale} FAQ has at least six substantive Q&A pairs`, () => {
      expect(appEntwickelnFreelancerFaq[locale].length).toBeGreaterThanOrEqual(6);
    });
  }
});
