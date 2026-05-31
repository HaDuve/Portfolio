import { describe, it, expect } from "vitest";
import { HOME_PAGE_SECTION_IDS } from "./homeSections";
import { siteChromeNav } from "./siteChromeNav";

describe("siteChromeNav", () => {
  it("lists in-page anchors in design order (DE labels)", () => {
    const nav = siteChromeNav("de");
    expect(nav.map((item) => item.id)).toEqual([
      "freelance",
      "coaching",
      "skills",
      "contact",
    ]);
    expect(nav.map((item) => item.label)).toEqual([
      "Freelance",
      "Coaching",
      "Stack",
      "Kontakt",
    ]);
  });

  it("lists in-page anchors in design order (EN labels)", () => {
    const nav = siteChromeNav("en");
    expect(nav.map((item) => item.label)).toEqual([
      "Freelance",
      "Coaching",
      "Stack",
      "Contact",
    ]);
  });

  it("only links to sections that exist on the home page", () => {
    for (const locale of ["de", "en"] as const) {
      for (const { id } of siteChromeNav(locale)) {
        expect(HOME_PAGE_SECTION_IDS).toContain(id);
      }
    }
  });
});
