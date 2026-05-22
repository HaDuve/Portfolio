import { canonicalFunnelPath, type FunnelContentPath } from "./content-paths.js";

export type PageViewCount = Map<FunnelContentPath, number>;

export type CountLoggedPageViewsOptions = {
  from?: Date;
  to?: Date;
};

const BOT_UA =
  /bot\b|spider|crawl|slurp|wget|curl\/|python-requests|go-http-client|headlesschrome/i;

export function countLoggedPageViews(
  logText: string,
  options: CountLoggedPageViewsOptions = {},
): PageViewCount {
  const counts = new Map<FunnelContentPath, number>();
  for (const line of logText.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let entry: CaddyAccessEntry;
    try {
      entry = JSON.parse(trimmed) as CaddyAccessEntry;
    } catch {
      continue;
    }
    if (!isCountableAccessEntry(entry, options)) continue;
    const path = canonicalFunnelPath(entry.request?.uri ?? "");
    if (!path) continue;
    counts.set(path, (counts.get(path) ?? 0) + 1);
  }
  return counts;
}

type CaddyAccessEntry = {
  logger?: string;
  ts?: number;
  status?: number;
  request?: {
    method?: string;
    uri?: string;
    headers?: { "User-Agent"?: string[] };
  };
};

function isCountableAccessEntry(
  entry: CaddyAccessEntry,
  options: CountLoggedPageViewsOptions,
): boolean {
  if (entry.logger !== "http.log.access") return false;
  if (entry.request?.method !== "GET") return false;
  const status = entry.status ?? 0;
  if (status < 200 || status >= 300) return false;
  if (!entryInRange(entry.ts, options)) return false;
  const ua = entry.request?.headers?.["User-Agent"]?.[0] ?? "";
  if (BOT_UA.test(ua)) return false;
  return true;
}

function entryInRange(
  ts: number | undefined,
  options: CountLoggedPageViewsOptions,
): boolean {
  if (ts === undefined) return false;
  const at = new Date(ts * 1000);
  if (options.from && at < options.from) return false;
  if (options.to && at > options.to) return false;
  return true;
}
