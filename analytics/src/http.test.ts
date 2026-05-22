import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { IncomingMessage, ServerResponse } from "node:http";
import { Readable } from "node:stream";
import { EventEmitter } from "node:events";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ClickStore } from "./click-store.js";
import { IngestService } from "./ingest.js";
import { createHttpHandler } from "./http.js";

const SECRET = "test-ingest-secret";
const SALT = "test-ip-salt";

function mockRequest(
  overrides: Partial<{
    method: string;
    url: string;
    headers: Record<string, string | string[] | undefined>;
    body: string;
  }> = {},
): IncomingMessage {
  const chunks =
    overrides.body !== undefined
      ? [Buffer.from(overrides.body, "utf8")]
      : [];
  const req = Readable.from(chunks) as IncomingMessage;
  req.method = overrides.method ?? "POST";
  req.url = overrides.url ?? "/api/events";
  req.headers = overrides.headers ?? {
    origin: "https://hannesduve.com",
    referer: "https://hannesduve.com/de/",
    "x-analytics-ingest-key": SECRET,
  };
  req.socket = { remoteAddress: "203.0.113.10" } as IncomingMessage["socket"];
  return req;
}

function mockResponse(): ServerResponse & {
  statusCode?: number;
  body: string;
} {
  const res = new EventEmitter() as ServerResponse & {
    statusCode?: number;
    body: string;
  };
  res.body = "";
  res.writeHead = vi.fn((status: number) => {
    res.statusCode = status;
    return res;
  }) as ServerResponse["writeHead"];
  res.end = vi.fn((chunk?: unknown) => {
    if (typeof chunk === "string") res.body = chunk;
    return res;
  }) as ServerResponse["end"];
  return res;
}

describe("createHttpHandler", () => {
  let dbPath: string;
  let store: ClickStore;
  let handler: ReturnType<typeof createHttpHandler>;

  beforeEach(() => {
    dbPath = path.join(os.tmpdir(), `http-ingest-${Date.now()}.sqlite`);
    store = new ClickStore(dbPath);
    const ingest = new IngestService({
      store,
      ingestSecret: SECRET,
      ipHashSalt: SALT,
      allowedOrigins: ["https://hannesduve.com"],
      rateLimitPerIp: 100,
      rateLimitWindowMs: 60_000,
    });
    handler = createHttpHandler(ingest);
  });

  afterEach(() => {
    store.close();
    if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  });

  it("rejects request bodies larger than the cap without parsing JSON", async () => {
    const res = mockResponse();
    const huge = "x".repeat(9 * 1024);
    await handler(
      mockRequest({
        headers: {
          origin: "https://hannesduve.com",
          "x-analytics-ingest-key": SECRET,
          "content-type": "application/json",
        },
        body: huge,
      }),
      res,
    );
    expect(res.statusCode).toBe(413);
    expect(store.aggregateByPathPlacement()).toHaveLength(0);
  });
});
