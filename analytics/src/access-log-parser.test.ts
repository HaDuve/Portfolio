import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  countLoggedPageViews,
  isCaddyAccessLogger,
} from "./access-log-parser.js";

const fixtureDir = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.join(fixtureDir, "../fixtures/access-sample.jsonl");

function readFixture(): string {
  return fs.readFileSync(fixturePath, "utf8");
}

describe("countLoggedPageViews", () => {
  it("counts allowlisted GET 200 page views per path", () => {
    const counts = countLoggedPageViews(readFixture());
    expect(counts.get("/de/")).toBe(2);
    expect(counts.get("/de/app-entwickeln-freelancer/")).toBe(1);
  });

  it("excludes non-content paths and bot user agents", () => {
    const counts = countLoggedPageViews(readFixture());
    expect(counts.get("/de/")).toBe(2);
    expect(counts.get("/de/app-entwickeln-freelancer/")).toBe(1);
    expect(counts.has("/favicon.ico")).toBe(false);
    expect(counts.get("/en/")).toBe(1);
  });

  it("normalizes URIs without a trailing slash", () => {
    const line = JSON.stringify({
      level: "info",
      ts: 1779436800,
      logger: "http.log.access",
      request: {
        method: "GET",
        uri: "/en/freelance-app-development",
        headers: { "User-Agent": ["Mozilla/5.0"] },
      },
      status: 200,
    });
    const counts = countLoggedPageViews(`${line}\n`);
    expect(counts.get("/en/freelance-app-development/")).toBe(1);
  });

  it("filters entries to an inclusive date range", () => {
    const counts = countLoggedPageViews(readFixture(), {
      from: new Date("2026-05-22T00:00:00.000Z"),
      to: new Date("2026-05-22T23:59:59.999Z"),
    });
    expect(counts.get("/de/")).toBe(2);
    expect(counts.get("/en/")).toBeUndefined();
  });

  it("counts site-block Caddy loggers such as http.log.access.log0", () => {
    const line = JSON.stringify({
      level: "info",
      ts: 1779436800,
      logger: "http.log.access.log0",
      request: {
        method: "GET",
        uri: "/de/",
        headers: { "User-Agent": ["Mozilla/5.0"] },
      },
      status: 200,
    });
    const counts = countLoggedPageViews(`${line}\n`);
    expect(counts.get("/de/")).toBe(1);
  });
});

describe("isCaddyAccessLogger", () => {
  it("accepts default and site-block logger names", () => {
    expect(isCaddyAccessLogger("http.log.access")).toBe(true);
    expect(isCaddyAccessLogger("http.log.access.log0")).toBe(true);
    expect(isCaddyAccessLogger("http.log.error")).toBe(false);
  });
});
