import { describe, it, expect } from "vitest";
import { shouldUseDarkClass } from "./theme";

describe("shouldUseDarkClass", () => {
  it("enables dark class when theme is dark", () => {
    expect(shouldUseDarkClass("dark", false)).toBe(true);
    expect(shouldUseDarkClass("dark", true)).toBe(true);
  });

  it("disables dark class when theme is light", () => {
    expect(shouldUseDarkClass("light", true)).toBe(false);
    expect(shouldUseDarkClass("light", false)).toBe(false);
  });

  it("follows system preference when theme is system", () => {
    expect(shouldUseDarkClass("system", true)).toBe(true);
    expect(shouldUseDarkClass("system", false)).toBe(false);
  });
});
