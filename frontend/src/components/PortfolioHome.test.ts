import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import {
  HOME_PAGE_SECTION_IDS,
  REMOVED_HOME_SECTION_IDS,
} from "@/lib/homeSections";

const componentsDir = dirname(fileURLToPath(import.meta.url));

const sectionSources: Record<
  (typeof HOME_PAGE_SECTION_IDS)[number],
  string
> = {
  hero: "Hero.tsx",
  hub: "HubBlock.tsx",
  leistungen: "PortfolioHome.tsx",
  projects: "PortfolioHome.tsx",
  skills: "PortfolioHome.tsx",
  contact: "PortfolioHome.tsx",
};

describe("PortfolioHome layout", () => {
  it("does not render sections removed by the hub restructure", () => {
    for (const id of REMOVED_HOME_SECTION_IDS) {
      expect(HOME_PAGE_SECTION_IDS).not.toContain(id);
    }
  });

  it("renders each configured home section id in the layout", () => {
    for (const id of HOME_PAGE_SECTION_IDS) {
      const source = readFileSync(
        join(componentsDir, sectionSources[id]),
        "utf8",
      );
      expect(source).toContain(`id="${id}"`);
    }
  });

  it("places the hub block before the services section on the page", () => {
    const hubIndex = HOME_PAGE_SECTION_IDS.indexOf("hub");
    const servicesIndex = HOME_PAGE_SECTION_IDS.indexOf("leistungen");
    expect(hubIndex).toBeLessThan(servicesIndex);
  });
});
