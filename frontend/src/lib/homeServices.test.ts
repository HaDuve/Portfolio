import { describe, it, expect } from "vitest";
import { homeServiceCards } from "./homeServices";

describe("homeServiceCards", () => {
  it("returns exactly four service cards", () => {
    expect(homeServiceCards("de")).toHaveLength(4);
    expect(homeServiceCards("en")).toHaveLength(4);
  });

  it("keeps each card description to one tight sentence", () => {
    for (const card of homeServiceCards("en")) {
      expect(card.description.length).toBeLessThanOrEqual(120);
      expect(card.description).not.toMatch(/\n/);
    }
  });

  it("anchors Quality & ops with the real-engineering line in EN", () => {
    const quality = homeServiceCards("en").find((c) => c.id === "quality");
    expect(quality?.description).toContain(
      "real engineering — not vibe coding.",
    );
  });
});
