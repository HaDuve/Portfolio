import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";

const portfolioHomeSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "PortfolioHome.tsx"),
  "utf8",
);

describe("PortfolioHome layout", () => {
  it("does not render sections removed by the hub restructure", () => {
    for (const id of ["app-entwickeln", "zusammenarbeit", "ablauf"]) {
      expect(portfolioHomeSource).not.toContain(`id="${id}"`);
    }
  });

  it("renders the hub block before the services section", () => {
    const hubIndex = portfolioHomeSource.indexOf("<HubBlock");
    const servicesIndex = portfolioHomeSource.indexOf('id="leistungen"');
    expect(hubIndex).toBeGreaterThan(-1);
    expect(servicesIndex).toBeGreaterThan(-1);
    expect(hubIndex).toBeLessThan(servicesIndex);
  });
});
