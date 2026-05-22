import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { countLoggedPageViews } from "./access-log-parser.js";
import { ClickStore } from "./click-store.js";
import { buildFunnelReport, formatFunnelReport } from "./funnel-report.js";

export type FunnelReportCliArgs = {
  logPath: string;
  dbPath: string;
  from: string;
  to: string;
  placementBreakdown: boolean;
};

export function parseFunnelReportArgv(argv: string[]): FunnelReportCliArgs | null {
  let logPath = "/var/log/caddy/access.log";
  let dbPath = process.env.ANALYTICS_DB_PATH ?? "/data/clicks.sqlite";
  let from: string | undefined;
  let to: string | undefined;
  let placementBreakdown = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--placement-breakdown") {
      placementBreakdown = true;
      continue;
    }
    const value = argv[i + 1];
    if (!value) continue;
    if (arg === "--log") {
      logPath = value;
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
    return null;
  }

  return { logPath, dbPath, from, to, placementBreakdown };
}

export function runFunnelReportCli(args: FunnelReportCliArgs): string {
  const logText = fs.readFileSync(args.logPath, "utf8");
  const { fromDate, toDate, fromIso, toIso } = dayRangeToBounds(args.from, args.to);

  const views = countLoggedPageViews(logText, { from: fromDate, to: toDate });
  const store = new ClickStore(args.dbPath);
  try {
    const clicks = store.aggregateByPathPlacementInRange(fromIso, toIso);
    const rows = buildFunnelReport(views, clicks, {
      placementBreakdown: args.placementBreakdown,
    });
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
  --log PATH              Caddy access log (default: /var/log/caddy/access.log)
  --db PATH               Click store SQLite (default: ANALYTICS_DB_PATH or /data/clicks.sqlite)
  --placement-breakdown   Hero vs contact clicks on Home paths (/de/, /en/)
`);
}

const isMain =
  process.argv[1] !== undefined &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMain) {
  const parsed = parseFunnelReportArgv(process.argv.slice(2));
  if (!parsed) {
    printUsage();
    process.exit(1);
  }
  process.stdout.write(runFunnelReportCli(parsed));
}
