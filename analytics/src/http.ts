import type { IncomingMessage, ServerResponse } from "node:http";
import { IngestService, type IngestRequest } from "./ingest.js";

export function createHttpHandler(ingest: IngestService) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (url.pathname !== "/api/events") {
      res.writeHead(404).end();
      return;
    }

    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(chunk as Buffer);
    }
    let body: unknown = null;
    const raw = Buffer.concat(chunks).toString("utf8");
    if (raw.length > 0) {
      try {
        body = JSON.parse(raw) as unknown;
      } catch {
        body = null;
      }
    }

    const ingestReq: IngestRequest = {
      method: req.method ?? "GET",
      clientIp: clientIpFromRequest(req),
      origin: headerValue(req.headers.origin),
      referer: headerValue(req.headers.referer),
      ingestKey:
        headerValue(req.headers["x-analytics-ingest-key"]) ??
        bearerToken(headerValue(req.headers.authorization)) ??
        url.searchParams.get("key") ??
        undefined,
      body,
    };

    const result = ingest.handle(ingestReq);
    if (result.ok) {
      res.writeHead(204).end();
      return;
    }
    res
      .writeHead(result.status, { "Content-Type": "application/json" })
      .end(JSON.stringify({ error: result.reason }));
  };
}

function clientIpFromRequest(req: IncomingMessage): string {
  const forwarded = headerValue(req.headers["x-forwarded-for"]);
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "0.0.0.0";
  }
  return req.socket.remoteAddress ?? "0.0.0.0";
}

function headerValue(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function bearerToken(authorization: string | undefined): string | undefined {
  if (!authorization?.startsWith("Bearer ")) return undefined;
  return authorization.slice("Bearer ".length).trim();
}
