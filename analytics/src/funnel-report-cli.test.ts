import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  dayRangeToBounds,
  formatAllZeroWarning,
  isAllZeroFunnelReport,
  parseFunnelReportArgv,
  resolveFunnelLogPaths,
  runFunnelReportCli,
} from "./funnel-report-cli.js";
import { ClickStore } from "./click-store.js";

const fixtureDir = path.dirname(fileURLToPath(import.meta.url));
const fixtureLog = path.join(fixtureDir, "../fixtures/access-sample.jsonl");

describe("parseFunnelReportArgv", () => {
  it("requires --from and --to as YYYY-MM-DD", () => {
    expect(parseFunnelReportArgv(["--from", "2026-05-22"]).args).toBeNull();
    expect(
      parseFunnelReportArgv(["--from", "2026-05-22", "--to", "2026-05-22"]),
    ).toMatchObject({
      args: { from: "2026-05-22", to: "2026-05-22" },
      unknownFlags: [],
    });
  });

  it("reports unknown flags", () => {
    const result = parseFunnelReportArgv([
      "--from",
      "2026-05-22",
      "--to",
      "2026-05-22",
      "--placement-breakdowns",
    ]);
    expect(result.args).toMatchObject({ from: "2026-05-22", to: "2026-05-22" });
    expect(result.unknownFlags).toEqual(["--placement-breakdowns"]);
  });

  it("accepts multiple --log paths", () => {
    const result = parseFunnelReportArgv([
      "--from",
      "2026-05-22",
      "--to",
      "2026-05-22",
      "--log",
      "/tmp/a.log",
      "--log",
      "/tmp/b.log",
    ]);
    expect(result.args?.logPaths).toEqual(["/tmp/a.log", "/tmp/b.log"]);
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

  it("prints funnel rows from fixture log and click store", async () => {
    const output = await runFunnelReportCli({
      logPaths: [fixtureLog],
      dbPath,
      from: "2026-05-22",
      to: "2026-05-22",
      placementBreakdown: false,
    });
    expect(output).toContain("/de/\t2\t1\t");
    expect(output).toContain("path\tviews\tclicks\tclick_rate");
  });

  it("merges views from multiple log files", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "funnel-logs-"));
    const logA = path.join(dir, "a.jsonl");
    const logB = path.join(dir, "b.jsonl");
    const line = (uri: string) =>
      `${JSON.stringify({
        level: "info",
        ts: 1779436800,
        logger: "http.log.access",
        request: {
          method: "GET",
          uri,
          headers: { "User-Agent": ["Mozilla/5.0"] },
        },
        status: 200,
      })}\n`;
    fs.writeFileSync(logA, line("/de/"));
    fs.writeFileSync(logB, line("/de/"));
    try {
      const output = await runFunnelReportCli({
        logPaths: [logA, logB],
        dbPath,
        from: "2026-05-22",
        to: "2026-05-22",
        placementBreakdown: false,
      });
      expect(output).toContain("/de/\t2\t");
    } finally {
      fs.rmSync(dir, { recursive: true });
    }
  });

  it("warns on stderr when every funnel row is zero", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "funnel-empty-"));
    const emptyLog = path.join(dir, "empty.jsonl");
    fs.writeFileSync(emptyLog, "");
    const emptyDb = path.join(dir, "empty.sqlite");
    new ClickStore(emptyDb).close();
    const stderrSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      await runFunnelReportCli({
        logPaths: [emptyLog],
        dbPath: emptyDb,
        from: "2026-05-22",
        to: "2026-05-22",
        placementBreakdown: false,
      });
      expect(stderrSpy).toHaveBeenCalledWith(
        expect.stringContaining("all funnel paths are zero"),
      );
    } finally {
      stderrSpy.mockRestore();
      fs.rmSync(dir, { recursive: true });
    }
  });
});

describe("resolveFunnelLogPaths", () => {
  it("expands globs to sorted paths", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "funnel-glob-"));
    fs.writeFileSync(path.join(dir, "access-b.log"), "");
    fs.writeFileSync(path.join(dir, "access-a.log"), "");
    try {
      expect(resolveFunnelLogPaths(path.join(dir, "access-*.log"))).toEqual([
        path.join(dir, "access-a.log"),
        path.join(dir, "access-b.log"),
      ]);
    } finally {
      fs.rmSync(dir, { recursive: true });
    }
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

describe("all-zero diagnostics", () => {
  it("detects all-zero funnel rows", () => {
    expect(
      isAllZeroFunnelReport([
        { path: "/de/", views: 0, clicks: 0, clickRate: null },
      ]),
    ).toBe(true);
    expect(
      isAllZeroFunnelReport([
        { path: "/de/", views: 1, clicks: 0, clickRate: 0 },
      ]),
    ).toBe(false);
  });

  it("includes log and click counts in the warning", () => {
    const warning = formatAllZeroWarning({
      logFiles: 2,
      logStats: {
        totalLines: 10,
        jsonLines: 8,
        accessLogLines: 0,
        funnelLines: 0,
      },
      clickRows: 0,
      totalViews: 0,
      totalClicks: 0,
    });
    expect(warning).toContain("log files: 2");
    expect(warning).toContain("10 total, 8 json, 0 access-log");
    expect(warning).toContain("click rows in range: 0");
    expect(warning).toContain("http.log.access");
  });
});
