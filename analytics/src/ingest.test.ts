import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ClickStore } from "./click-store.js";
import { IngestService, type IngestRequest } from "./ingest.js";

const SECRET = "test-ingest-secret";
const SALT = "test-ip-salt";
const ALLOWED = ["https://hannesduve.com"];

function req(
  overrides: Partial<IngestRequest> & { body?: Record<string, unknown> } = {},
): IngestRequest {
  const { body, ...rest } = overrides;
  return {
    method: "POST",
    clientIp: "203.0.113.10",
    origin: "https://hannesduve.com",
    referer: "https://hannesduve.com/de/",
    ingestKey: SECRET,
    body: body ?? {
      type: "scheduling_click",
      path: "/de/",
      placement: "hero-freelance",
      locale: "de",
    },
    ...rest,
  };
}

describe("IngestService", () => {
  let dbPath: string;
  let store: ClickStore;
  let ingest: IngestService;

  beforeEach(() => {
    dbPath = path.join(os.tmpdir(), `ingest-${Date.now()}.sqlite`);
    store = new ClickStore(dbPath);
    ingest = new IngestService({
      store,
      ingestSecret: SECRET,
      ipHashSalt: SALT,
      allowedOrigins: ALLOWED,
      rateLimitPerIp: 100,
      rateLimitWindowMs: 60_000,
    });
  });

  afterEach(() => {
    store.close();
    if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  });

  it("accepts a valid scheduling_click and persists it", () => {
    const result = ingest.handle(req());
    expect(result).toEqual({ ok: true, status: 204 });
    const rows = store.aggregateByPathPlacement();
    expect(rows).toEqual([
      { path: "/de/", placement: "hero-freelance", count: 1 },
    ]);
  });

  it("rejects unknown event types", () => {
    const result = ingest.handle(
      req({ body: { type: "page_view", path: "/de/", placement: "hero", locale: "de" } }),
    );
    expect(result.ok).toBe(false);
    expect(result.status).toBe(400);
    expect(store.aggregateByPathPlacement()).toHaveLength(0);
  });

  it("rejects requests without a trusted site origin", () => {
    const result = ingest.handle(
      req({ origin: "https://evil.example", referer: "https://evil.example/de/" }),
    );
    expect(result).toMatchObject({ ok: false, status: 403 });
  });

  it("rejects referer hostnames that only prefix-match the allowlist", () => {
    const result = ingest.handle(
      req({
        origin: undefined,
        referer: "https://hannesduve.com.evil.example/de/",
      }),
    );
    expect(result).toMatchObject({ ok: false, status: 403 });
  });

  it("accepts referer-only requests when referer origin matches allowlist", () => {
    const result = ingest.handle(
      req({
        origin: undefined,
        referer: "https://hannesduve.com/en/freelance-app-development/",
      }),
    );
    expect(result).toEqual({ ok: true, status: 204 });
  });

  it("rejects legacy hero and contact placement labels", () => {
    for (const placement of ["hero", "contact"] as const) {
      const result = ingest.handle(
        req({
          body: {
            type: "scheduling_click",
            path: "/de/",
            placement,
            locale: "de",
          },
        }),
      );
      expect(result).toMatchObject({ ok: false, status: 400 });
    }
    expect(store.aggregateByPathPlacement()).toHaveLength(0);
  });

  it("accepts offering-aware placements such as lane-coaching", () => {
    const result = ingest.handle(
      req({
        body: {
          type: "scheduling_click",
          path: "/en/",
          placement: "lane-coaching",
          locale: "en",
        },
      }),
    );
    expect(result).toEqual({ ok: true, status: 204 });
    expect(store.aggregateByPathPlacement()).toEqual([
      { path: "/en/", placement: "lane-coaching", count: 1 },
    ]);
  });

  it("rejects missing or invalid ingest credentials", () => {
    expect(ingest.handle(req({ ingestKey: undefined }))).toMatchObject({
      ok: false,
      status: 401,
    });
    expect(ingest.handle(req({ ingestKey: "wrong" }))).toMatchObject({
      ok: false,
      status: 401,
    });
  });

  it("rate-limits excessive requests from the same IP", () => {
    const limited = new IngestService({
      store,
      ingestSecret: SECRET,
      ipHashSalt: SALT,
      allowedOrigins: ALLOWED,
      rateLimitPerIp: 2,
      rateLimitWindowMs: 60_000,
    });
    expect(limited.handle(req()).ok).toBe(true);
    expect(limited.handle(req()).ok).toBe(true);
    const third = limited.handle(req());
    expect(third).toMatchObject({ ok: false, status: 429 });
  });
});
