import { describe, it, expect } from "vitest";
import {
  coachingLaneSection,
  coachingLaneTimeline,
  coachingLaneTools,
  coachingLaneFaq,
} from "./coachingLane";
import { coachingLandingPath, devLandingPath } from "./i18n";
import type { Locale } from "./i18n";

describe("coachingLaneSection", () => {
  it.each<Locale>(["de", "en"])(
    "exposes lane-coaching scheduling placement for %s",
    (locale) => {
      expect(coachingLaneSection(locale).schedulingPlacement).toBe(
        "lane-coaching",
      );
    },
  );
});

describe("coachingLaneTimeline", () => {
  it("lists four steps in order for DE", () => {
    const steps = coachingLaneTimeline("de");
    expect(steps).toHaveLength(4);
    expect(steps.map((s) => s.title)).toEqual([
      "Erstgespräch",
      "Session buchen",
      "Live am Projekt",
      "Entsperrt raus",
    ]);
  });

  it("shows intro is free and session price for DE", () => {
    const steps = coachingLaneTimeline("de");
    expect(steps[0].description).toMatch(/30 Min/i);
    expect(steps[0].description).toMatch(/kostenlos/i);
    expect(steps[1].description).toMatch(/60 Min/i);
    expect(steps[1].description).toMatch(/60 €/);
  });

  it("lists four steps in order for EN", () => {
    const steps = coachingLaneTimeline("en");
    expect(steps).toHaveLength(4);
    expect(steps.map((s) => s.title)).toEqual([
      "Intro call",
      "Book a session",
      "Live on your project",
      "Leave unblocked",
    ]);
  });
});

describe("coachingLaneTools", () => {
  it.each<Locale>(["de", "en"])("includes Cursor and Claude for %s", (locale) => {
    const labels = coachingLaneTools(locale).map((t) => t.label);
    expect(labels).toContain("Cursor");
    expect(labels).toContain("Claude");
  });
});

describe("coachingLaneFaq", () => {
  it("includes the two inline FAQ questions in DE", () => {
    const questions = coachingLaneFaq("de").map((item) => item.question);
    expect(questions).toContain("Muss ich schon programmieren können?");
    expect(questions).toContain("Coaching oder Freelance?");
  });

  it("links Coaching-or-Freelance FAQ to the freelance landing page", () => {
    for (const locale of ["de", "en"] as const) {
      const item = coachingLaneFaq(locale).find((f) => f.id === "coaching-vs-freelance");
      expect(item?.link?.href).toBe(devLandingPath(locale));
    }
  });

  it("includes the two inline FAQ questions in EN", () => {
    const questions = coachingLaneFaq("en").map((item) => item.question);
    expect(questions).toContain("Do I need to know how to code already?");
    expect(questions).toContain("Coaching or freelance?");
  });
});

describe("coachingLaneSection copy", () => {
  it("uses Coaching buchen as the DE lane CTA label", () => {
    expect(coachingLaneSection("de").ctaLabel).toBe("Coaching buchen");
  });

  it("links the more arrow to the coaching landing page per locale", () => {
    for (const locale of ["de", "en"] as const) {
      const section = coachingLaneSection(locale);
      expect(section.moreHref).toBe(coachingLandingPath(locale));
      expect(section.moreLabel).toMatch(/→/);
    }
  });

  it("frames Vibe Coding positively and shows pricing in both locales", () => {
    for (const locale of ["de", "en"] as const) {
      const { title, description } = coachingLaneSection(locale);
      expect(title).toMatch(/Vibe Coding/i);
      expect(description).toMatch(/60 €/);
      expect(description).toMatch(/30/i);
      expect(description.toLowerCase()).not.toMatch(/weggeworfen|throwaway|anti/i);
    }
  });
});
