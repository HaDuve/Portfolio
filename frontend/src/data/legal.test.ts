import { describe, expect, it } from "vitest";
import legal from "@/data/legal.json";

describe("legal.json privacy disclosures", () => {
  it("documents Google Ads conversion measurement in DE and EN", () => {
    expect(legal.datenschutzDe).toContain("Google Ads (Conversion-Messung)");
    expect(legal.datenschutzEn).toContain("Google Ads (conversion measurement)");
  });

  it("documents Ahrefs Web Analytics in DE and EN", () => {
    expect(legal.datenschutzDe).toContain("Ahrefs Web Analytics");
    expect(legal.datenschutzEn).toContain("Ahrefs Web Analytics");
  });
});
