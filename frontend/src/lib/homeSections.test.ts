import { describe, it, expect } from "vitest";
import {
  HOME_NAV_SECTIONS,
  HOME_PAGE_SECTION_IDS,
  REMOVED_HOME_SECTION_IDS,
} from "./homeSections";

describe("homeSections", () => {
  it("lists hub before services in page section order", () => {
    const hubIndex = HOME_PAGE_SECTION_IDS.indexOf("hub");
    const servicesIndex = HOME_PAGE_SECTION_IDS.indexOf("leistungen");
    expect(hubIndex).toBeGreaterThan(-1);
    expect(servicesIndex).toBeGreaterThan(-1);
    expect(hubIndex).toBeLessThan(servicesIndex);
  });

  it("excludes sections removed by the hub restructure", () => {
    for (const id of REMOVED_HOME_SECTION_IDS) {
      expect(HOME_PAGE_SECTION_IDS).not.toContain(id);
    }
  });

  it("keeps header nav targets aligned with rendered home sections", () => {
    for (const { id } of HOME_NAV_SECTIONS) {
      expect(HOME_PAGE_SECTION_IDS).toContain(id);
    }
  });

  it("drops Collaboration and Process from nav", () => {
    const navIds = HOME_NAV_SECTIONS.map((s) => s.id);
    expect(navIds).not.toContain("zusammenarbeit");
    expect(navIds).not.toContain("ablauf");
    expect(navIds).toContain("hub");
  });
});
