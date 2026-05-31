import { describe, it, expect } from "vitest";
import { mobileNavPanelClass, nextMobileNavOpen } from "./mobileNav";

describe("mobileNav", () => {
  it("toggles open state", () => {
    expect(nextMobileNavOpen(false)).toBe(true);
    expect(nextMobileNavOpen(true)).toBe(false);
  });

  it("exposes open vs closed panel classes for accessibility styling", () => {
    expect(mobileNavPanelClass(true)).toContain("pointer-events-auto");
    expect(mobileNavPanelClass(false)).toContain("pointer-events-none");
  });
});
