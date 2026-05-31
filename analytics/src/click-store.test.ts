import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ClickStore } from "./click-store.js";

describe("ClickStore", () => {
  let dbPath: string;
  let store: ClickStore;

  beforeEach(() => {
    dbPath = path.join(
      os.tmpdir(),
      `clicks-test-${Date.now()}-${Math.random()}.sqlite`,
    );
    store = new ClickStore(dbPath);
  });

  afterEach(() => {
    store.close();
    if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  });

  it("inserts a scheduling click and aggregates by placement", () => {
    store.insertSchedulingClick({
      path: "/de/",
      placement: "hero-freelance",
      locale: "de",
      visitorKey: "abc123",
      receivedAt: "2026-05-22T12:00:00.000Z",
    });
    store.insertSchedulingClick({
      path: "/de/",
      placement: "contact-freelance",
      locale: "de",
      visitorKey: "abc123",
      receivedAt: "2026-05-22T12:01:00.000Z",
    });

    const rows = store.aggregateByPathPlacement();
    expect(rows).toEqual(
      expect.arrayContaining([
        { path: "/de/", placement: "hero-freelance", count: 1 },
        { path: "/de/", placement: "contact-freelance", count: 1 },
      ]),
    );
    expect(rows).toHaveLength(2);
  });

  it("aggregates clicks within a received_at range", () => {
    store.insertSchedulingClick({
      path: "/de/",
      placement: "hero-freelance",
      locale: "de",
      visitorKey: "k1",
      receivedAt: "2026-05-20T10:00:00.000Z",
    });
    store.insertSchedulingClick({
      path: "/de/",
      placement: "hero-freelance",
      locale: "de",
      visitorKey: "k2",
      receivedAt: "2026-05-22T12:00:00.000Z",
    });
    store.insertSchedulingClick({
      path: "/de/",
      placement: "contact-freelance",
      locale: "de",
      visitorKey: "k3",
      receivedAt: "2026-05-22T18:00:00.000Z",
    });
    store.insertSchedulingClick({
      path: "/de/",
      placement: "contact-freelance",
      locale: "de",
      visitorKey: "k4",
      receivedAt: "2026-05-25T10:00:00.000Z",
    });

    const inRange = store.aggregateByPathPlacementInRange(
      "2026-05-22T00:00:00.000Z",
      "2026-05-22T23:59:59.999Z",
    );
    expect(inRange).toEqual(
      expect.arrayContaining([
        { path: "/de/", placement: "hero-freelance", count: 1 },
        { path: "/de/", placement: "contact-freelance", count: 1 },
      ]),
    );
    expect(inRange).toHaveLength(2);
  });

  it("prunes rows older than 12 months", () => {
    store.insertSchedulingClick({
      path: "/en/",
      placement: "hero-freelance",
      locale: "en",
      visitorKey: "k1",
      receivedAt: "2024-01-01T00:00:00.000Z",
    });
    store.insertSchedulingClick({
      path: "/en/",
      placement: "hero-freelance",
      locale: "en",
      visitorKey: "k2",
      receivedAt: "2026-05-22T12:00:00.000Z",
    });

    const deleted = store.pruneOlderThanMonths(12, "2026-05-22T12:00:00.000Z");
    expect(deleted).toBe(1);
    expect(store.aggregateByPathPlacement()).toEqual([
      { path: "/en/", placement: "hero-freelance", count: 1 },
    ]);
  });
});
