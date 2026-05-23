import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";

const repoRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

describe("funnel-report-remote.example.sh", () => {
  const script = readFileSync(
    path.join(repoRoot, "scripts/funnel-report-remote.example.sh"),
    "utf8",
  );

  it("mounts production analytics_data for funnel-report and GRAB_RAW", () => {
    expect(script).toContain("analytics_data");
    expect(script).toMatch(/ANALYTICS_VOL=.*analytics_data/s);
    const runMounts = script.match(/-v "\\\$\{ANALYTICS_VOL\}:\/data:ro"/g);
    expect(runMounts?.length).toBeGreaterThanOrEqual(2);
  });
});
