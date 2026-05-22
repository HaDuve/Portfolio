import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  dayRangeToBounds,
  parseFunnelReportArgv,
  runFunnelReportCli,
} from "./funnel-report-cli.js";
import { ClickStore } from "./click-store.js";

const fixtureDir = path.dirname(fileURLToPath(import.meta.url));
const fixtureLog = path.join(fixtureDir, "../fixtures/access-sample.jsonl");

describe("parseFunnelReportArgv", () => {
  it("requires --from and --to as YYYY-MM-DD", () => {
    expect(parseFunnelReportArgv(["--from", "2026-05-22"])).toBeNull();
    expect(
      parseFunnelReportArgv(["--from", "2026-05-22", "--to", "2026-05-22"]),
    ).toMatchObject({ from: "2026-05-22", to: "2026-05-22" });
  });
});

describe("runFunnelReportCli", () => {
  let dbPath: string;

  beforeEach(() => {
    dbPath = path.join(
      os.tmpdir(),
      `funnel-cli-${Date.now()}-${Math.random()}.sqlite`,
    );
    const store = new ClickStore(dbPath);
    store.insertSchedulingClick({
      path: "/de/",
      placement: "hero",
      locale: "de",
      visitorKey: "k1",
      receivedAt: "2026-05-22T12:00:00.000Z",
    });
    store.close();
  });

  afterEach(() => {
    if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  });

  it("prints funnel rows from fixture log and click store", () => {
    const output = runFunnelReportCli({
      logPath: fixtureLog,
      dbPath,
      from: "2026-05-22",
      to: "2026-05-22",
      placementBreakdown: false,
    });
    expect(output).toContain("/de/\t2\t1\t");
    expect(output).toContain("path\tviews\tclicks\tclick_rate");
  });
});

describe("dayRangeToBounds", () => {
  it("uses inclusive UTC day boundaries", () => {
    expect(dayRangeToBounds("2026-05-01", "2026-05-31")).toEqual({
      fromDate: new Date("2026-05-01T00:00:00.000Z"),
      toDate: new Date("2026-05-31T23:59:59.999Z"),
      fromIso: "2026-05-01T00:00:00.000Z",
      toIso: "2026-05-31T23:59:59.999Z",
    });
  });
});
