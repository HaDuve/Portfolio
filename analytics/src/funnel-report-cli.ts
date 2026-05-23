import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  countLoggedPageViewsFromFile,
  mergeLoggedPageViewCounts,
  scanAccessLogFile,
  type AccessLogScanStats,
} from "./access-log-parser.js";
import { ClickStore } from "./click-store.js";
import { buildFunnelReport, formatFunnelReport, type FunnelRow } from "./funnel-report.js";

export type FunnelReportCliArgs = {
  logPaths: string[];
  dbPath: string;
  from: string;
  to: string;
  placementBreakdown: boolean;
};

export type ParseFunnelReportArgvResult = {
  args: FunnelReportCliArgs | null;
  unknownFlags: string[];
};

const VALUE_FLAGS = new Set(["--log", "--db", "--from", "--to"]);
const KNOWN_FLAGS = new Set([...VALUE_FLAGS, "--placement-breakdown"]);

export function parseFunnelReportArgv(argv: string[]): ParseFunnelReportArgvResult {
  const logPaths: string[] = [];
  let dbPath = process.env.ANALYTICS_DB_PATH ?? "/data/clicks.sqlite";
  let from: string | undefined;
  let to: string | undefined;
  let placementBreakdown = false;
  const unknownFlags: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--placement-breakdown") {
      placementBreakdown = true;
      continue;
    }
    if (arg.startsWith("--") && !KNOWN_FLAGS.has(arg)) {
      unknownFlags.push(arg);
      continue;
    }
    const value = argv[i + 1];
    if (!value) continue;
    if (arg === "--log") {
      logPaths.push(value);
      i++;
    } else if (arg === "--db") {
      dbPath = value;
      i++;
    } else if (arg === "--from") {
      from = value;
      i++;
    } else if (arg === "--to") {
      to = value;
      i++;
    }
  }

  if (!from || !to || !/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    return { args: null, unknownFlags };
  }

  const resolvedLogPaths =
    logPaths.length > 0 ? logPaths : ["/var/log/caddy/access.log"];

  return {
    args: {
      logPaths: resolvedLogPaths,
      dbPath,
      from,
      to,
      placementBreakdown,
    },
    unknownFlags,
  };
}

export function resolveFunnelLogPaths(logPath: string): string[] {
  if (!logPath.includes("*") && !logPath.includes("?")) {
    return [logPath];
  }
  const dir = path.dirname(logPath);
  const pattern = path.basename(logPath);
  const re = globPatternToRegExp(pattern);
  return fs
    .readdirSync(dir)
    .filter((name) => re.test(name))
    .map((name) => path.join(dir, name))
    .sort();
}

function globPatternToRegExp(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".");
  return new RegExp(`^${escaped}$`);
}

export type FunnelReportDiagnostics = {
  logFiles: number;
  logStats: AccessLogScanStats;
  clickRows: number;
  totalViews: number;
  totalClicks: number;
};

export function mergeAccessLogScanStats(
  a: AccessLogScanStats,
  b: AccessLogScanStats,
): AccessLogScanStats {
  return {
    totalLines: a.totalLines + b.totalLines,
    jsonLines: a.jsonLines + b.jsonLines,
    accessLogLines: a.accessLogLines + b.accessLogLines,
    funnelLines: a.funnelLines + b.funnelLines,
  };
}

export function formatAllZeroWarning(diagnostics: FunnelReportDiagnostics): string {
  const { logFiles, logStats, clickRows } = diagnostics;
  const lines = [
    "funnel-report: warning — all funnel paths are zero for this date range.",
    `  log files: ${logFiles}`,
    `  log lines: ${logStats.totalLines} total, ${logStats.jsonLines} json, ${logStats.accessLogLines} access-log, ${logStats.funnelLines} funnel-eligible`,
    `  click rows in range: ${clickRows}`,
  ];
  if (logStats.totalLines === 0) {
    lines.push(
      "  hint: Caddy access log may be empty — confirm `log { output file … }` in caddy/Caddyfile and restart Caddy after deploy.",
    );
  } else if (logStats.accessLogLines === 0 && logStats.jsonLines > 0) {
    lines.push(
      "  hint: JSON lines found but none matched Caddy access loggers (expected http.log.access or http.log.access.*).",
    );
  } else if (logStats.funnelLines === 0 && logStats.accessLogLines > 0) {
    lines.push(
      "  hint: access log traffic exists but no funnel paths in range — check date range or GET 2xx hits on /de/, /en/, landing pages.",
    );
  }
  if (clickRows === 0) {
    lines.push(
      "  hint: no scheduling clicks in SQLite — confirm analytics_data volume is mounted, ingest returns 204, and NEXT_PUBLIC_ANALYTICS_INGEST_KEY matches server .env.",
    );
  }
  return lines.join("\n");
}

export function isAllZeroFunnelReport(rows: FunnelRow[]): boolean {
  return rows.every((row) => row.views === 0 && row.clicks === 0);
}

export async function runFunnelReportCli(args: FunnelReportCliArgs): Promise<string> {
  const { fromDate, toDate, fromIso, toIso } = dayRangeToBounds(args.from, args.to);
  const countOptions = { from: fromDate, to: toDate };

  const resolvedPaths = args.logPaths.flatMap(resolveFunnelLogPaths);
  if (resolvedPaths.length === 0) {
    throw new Error(`No access log files matched: ${args.logPaths.join(", ")}`);
  }

  let views: Awaited<ReturnType<typeof countLoggedPageViewsFromFile>> = new Map();
  let logStats: AccessLogScanStats = {
    totalLines: 0,
    jsonLines: 0,
    accessLogLines: 0,
    funnelLines: 0,
  };
  for (const logPath of resolvedPaths) {
    const fileCounts = await countLoggedPageViewsFromFile(logPath, countOptions);
    views = mergeLoggedPageViewCounts(views, fileCounts);
    logStats = mergeAccessLogScanStats(
      logStats,
      await scanAccessLogFile(logPath, countOptions),
    );
  }

  const store = new ClickStore(args.dbPath);
  try {
    const clicks = store.aggregateByPathPlacementInRange(fromIso, toIso);
    const clickRows = store.countSchedulingClicksInRange(fromIso, toIso);
    const rows = buildFunnelReport(views, clicks, {
      placementBreakdown: args.placementBreakdown,
    });
    const totalViews = rows.reduce((sum, row) => sum + row.views, 0);
    const totalClicks = rows.reduce((sum, row) => sum + row.clicks, 0);
    if (isAllZeroFunnelReport(rows)) {
      console.error(
        formatAllZeroWarning({
          logFiles: resolvedPaths.length,
          logStats,
          clickRows,
          totalViews,
          totalClicks,
        }),
      );
    }
    return formatFunnelReport(rows, {
      placementBreakdown: args.placementBreakdown,
    });
  } finally {
    store.close();
  }
}

export function dayRangeToBounds(from: string, to: string) {
  return {
    fromDate: new Date(`${from}T00:00:00.000Z`),
    toDate: new Date(`${to}T23:59:59.999Z`),
    fromIso: `${from}T00:00:00.000Z`,
    toIso: `${to}T23:59:59.999Z`,
  };
}

function printUsage(): void {
  console.error(`Usage: funnel-report --from YYYY-MM-DD --to YYYY-MM-DD [options]

Options:
  --log PATH              Caddy access log (repeatable; globs supported, e.g. /var/log/caddy/access*.log)
  --db PATH               Click store SQLite (default: ANALYTICS_DB_PATH or /data/clicks.sqlite)
  --placement-breakdown   Hero vs contact clicks on Home paths (/de/, /en/)
`);
}

function warnUnknownFlags(flags: string[]): void {
  for (const flag of flags) {
    console.error(`funnel-report: ignoring unknown option ${flag}`);
  }
}

const isMain =
  process.argv[1] !== undefined &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMain) {
  const { args, unknownFlags } = parseFunnelReportArgv(process.argv.slice(2));
  if (!args) {
    printUsage();
    process.exit(1);
  }
  warnUnknownFlags(unknownFlags);
  runFunnelReportCli(args)
    .then((output) => {
      process.stdout.write(output);
    })
    .catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`funnel-report: ${message}`);
      process.exit(1);
    });
}
