import { describe, it, expect } from "vitest";
import { generateStaticParams } from "./page";

describe("vibe-coding-coach generateStaticParams", () => {
  it("prebuilds only the en locale segment", () => {
    expect(generateStaticParams()).toEqual([{ locale: "en" }]);
  });
});
