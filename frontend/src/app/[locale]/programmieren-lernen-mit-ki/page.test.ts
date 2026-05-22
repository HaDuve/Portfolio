import { describe, it, expect } from "vitest";
import { generateStaticParams } from "./page";

describe("programmieren-lernen-mit-ki generateStaticParams", () => {
  it("prebuilds only the de locale segment", () => {
    expect(generateStaticParams()).toEqual([{ locale: "de" }]);
  });
});
