import { describe, it, expect } from "vitest";
import {
  HOME_NAV_SECTIONS,
  HOME_PAGE_SECTION_IDS,
  REMOVED_HOME_SECTION_IDS,
} from "./homeSections";

describe("homeSections", () => {
  it("lists dual-lane home sections in ADR-0004 order", () => {
    expect([...HOME_PAGE_SECTION_IDS]).toEqual([
      "hero",
      "freelance",
      "coaching",
      "skills",
      "contact",
    ]);
  });

  it("excludes hub and legacy sections removed by the dual-lane restructure", () => {
    for (const id of REMOVED_HOME_SECTION_IDS) {
      expect(HOME_PAGE_SECTION_IDS).not.toContain(id);
    }
    expect(HOME_PAGE_SECTION_IDS).not.toContain("hub");
    expect(HOME_PAGE_SECTION_IDS).not.toContain("projects");
  });

  it("keeps header nav targets aligned with rendered home sections", () => {
    for (const { id } of HOME_NAV_SECTIONS) {
      expect(HOME_PAGE_SECTION_IDS).toContain(id);
    }
  });

  it("drops hub and projects from nav", () => {
    const navIds = HOME_NAV_SECTIONS.map((s) => s.id);
    expect(navIds).not.toContain("hub");
    expect(navIds).not.toContain("projects");
    expect(navIds).not.toContain("zusammenarbeit");
    expect(navIds).not.toContain("ablauf");
    expect(navIds).toContain("freelance");
    expect(navIds).toContain("coaching");
  });
});
