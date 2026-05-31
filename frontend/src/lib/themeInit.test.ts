import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

const rootLayout = readFileSync(
  path.join(__dirname, "../app/layout.tsx"),
  "utf8",
);

describe("theme init script", () => {
  it("applies the dark class from localStorage before paint", () => {
    expect(rootLayout).toContain('if (t === "dark") document.documentElement.classList.add("dark")');
    expect(rootLayout).toContain(
      'else if (t === "light") document.documentElement.classList.remove("dark")',
    );
  });
});
