import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

const landingSource = readFileSync(
  path.join(__dirname, "../components/ServiceLandingPage.tsx"),
  "utf8",
);

describe("ServiceLandingPage layout contract", () => {
  it("uses the same max width and gutters as the home main column", () => {
    expect(landingSource).toContain("max-w-6xl");
    expect(landingSource).toMatch(/px-4.*sm:px-6/);
  });

  it("constrains FAQ and scope cards with min-w-0 to avoid horizontal overflow", () => {
    expect(landingSource).toContain("min-w-0");
  });

  it("renders FAQ in a responsive two-column grid on sm+ viewports", () => {
    expect(landingSource).toMatch(/sm:grid-cols-2/);
  });

  it("keeps the landing CTA scheduling placement as cta", () => {
    expect(landingSource).toContain('placement="cta"');
  });

  it("renders coaching tool pills inside the tools section, not after all sections", () => {
    expect(landingSource).toMatch(
      /section\.id === COACHING_TOOLS_SECTION_ID[\s\S]*toolLabels\.map/,
    );
    expect(landingSource).not.toMatch(
      /\}\)\)\s*\n\s*\{variant === "coaching" && toolLabels/,
    );
  });
});
