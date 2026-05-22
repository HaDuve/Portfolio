import { deriveVisitorKey } from "./visitor-key.js";
import { ClickStore } from "./click-store.js";

const PLACEMENTS = new Set(["hero", "contact", "cta"]);
const LOCALES = new Set(["de", "en"]);

export type IngestRequest = {
  method: string;
  clientIp: string;
  origin?: string;
  referer?: string;
  ingestKey?: string;
  body: unknown;
};

export type IngestResponse =
  | { ok: true; status: 204 }
  | { ok: false; status: number; reason: string };

export type IngestServiceConfig = {
  store: ClickStore;
  ingestSecret: string;
  ipHashSalt: string;
  allowedOrigins: string[];
  rateLimitPerIp: number;
  rateLimitWindowMs: number;
};

type RateBucket = { count: number; windowStart: number };

export class IngestService {
  private readonly config: IngestServiceConfig;
  /** Per-IP windows only reset on new traffic; stale IPs are not evicted (fine at portfolio scale). */
  private readonly rateBuckets = new Map<string, RateBucket>();

  constructor(config: IngestServiceConfig) {
    this.config = config;
  }

  handle(request: IngestRequest): IngestResponse {
    if (request.method !== "POST") {
      return { ok: false, status: 405, reason: "method_not_allowed" };
    }

    if (!this.isTrustedSiteRequest(request)) {
      return { ok: false, status: 403, reason: "origin_not_allowed" };
    }

    if (!this.hasValidCredential(request.ingestKey)) {
      return { ok: false, status: 401, reason: "invalid_credential" };
    }

    if (!this.allowRequestForIp(request.clientIp)) {
      return { ok: false, status: 429, reason: "rate_limited" };
    }

    const event = parseSchedulingClick(request.body);
    if (!event) {
      return { ok: false, status: 400, reason: "invalid_event" };
    }

    const receivedAt = new Date().toISOString();
    const visitorKey = deriveVisitorKey(
      request.clientIp,
      this.config.ipHashSalt,
    );

    this.config.store.insertSchedulingClick({
      path: event.path,
      placement: event.placement,
      locale: event.locale,
      visitorKey,
      receivedAt,
    });

    return { ok: true, status: 204 };
  }

  private hasValidCredential(key: string | undefined): boolean {
    return (
      typeof key === "string" &&
      key.length > 0 &&
      key === this.config.ingestSecret
    );
  }

  private isTrustedSiteRequest(request: IngestRequest): boolean {
    const allowed = this.config.allowedOrigins
      .map(siteOriginFromAllowed)
      .filter((o): o is string => o !== null);
    const requestOrigin =
      siteOriginFromHeader(request.origin) ??
      siteOriginFromReferer(request.referer);
    if (!requestOrigin) return false;
    return allowed.includes(requestOrigin);
  }

  private allowRequestForIp(ip: string): boolean {
    const now = Date.now();
    const bucket = this.rateBuckets.get(ip);
    if (!bucket || now - bucket.windowStart >= this.config.rateLimitWindowMs) {
      this.rateBuckets.set(ip, { count: 1, windowStart: now });
      return true;
    }
    if (bucket.count >= this.config.rateLimitPerIp) {
      return false;
    }
    bucket.count += 1;
    return true;
  }
}

function parseSchedulingClick(
  body: unknown,
): { path: string; placement: string; locale: string } | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (b.type !== "scheduling_click") return null;
  if (typeof b.path !== "string" || !isContentPath(b.path)) return null;
  if (typeof b.placement !== "string" || !PLACEMENTS.has(b.placement)) {
    return null;
  }
  if (typeof b.locale !== "string" || !LOCALES.has(b.locale)) return null;
  return { path: b.path, placement: b.placement, locale: b.locale };
}

function isContentPath(path: string): boolean {
  return /^\/(de|en)\//.test(path);
}

function siteOriginFromAllowed(allowed: string): string | null {
  try {
    return new URL(allowed.replace(/\/+$/, "") || allowed).origin;
  } catch {
    return null;
  }
}

function siteOriginFromHeader(origin: string | undefined): string | null {
  if (!origin) return null;
  try {
    return new URL(origin).origin;
  } catch {
    return null;
  }
}

function siteOriginFromReferer(referer: string | undefined): string | null {
  if (!referer) return null;
  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}
