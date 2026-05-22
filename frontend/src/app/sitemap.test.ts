import { describe, it, expect, vi } from "vitest";

vi.mock("@/data/projects.json", () => ({ default: [] }));
vi.mock("@/lib/normalizeProjects", () => ({
  normalizeProjects: () => [],
}));

const { default: sitemap } = await import("./sitemap");

const BASE = "https://hannesduve.com";

describe("sitemap — coaching pages", () => {
  it("includes DE coaching URL with priority 0.9", () => {
    const entries = sitemap();
    const entry = entries.find(
      (e) => e.url === `${BASE}/de/programmieren-lernen-mit-ki/`,
    );
    expect(entry).toBeDefined();
    expect(entry?.priority).toBe(0.9);
  });

  it("includes EN coaching URL with priority 0.9", () => {
    const entries = sitemap();
    const entry = entries.find(
      (e) => e.url === `${BASE}/en/vibe-coding-coach/`,
    );
    expect(entry).toBeDefined();
    expect(entry?.priority).toBe(0.9);
  });
});
