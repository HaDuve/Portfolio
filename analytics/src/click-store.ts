import Database from "better-sqlite3";

export type SchedulingClickRow = {
  path: string;
  placement: string;
  locale: string;
  visitorKey: string;
  receivedAt: string;
};

export type PathPlacementCount = {
  path: string;
  placement: string;
  count: number;
};

export class ClickStore {
  private db: Database.Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS scheduling_clicks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT NOT NULL,
        placement TEXT NOT NULL,
        locale TEXT NOT NULL,
        visitor_key TEXT NOT NULL,
        received_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_scheduling_clicks_received_at
        ON scheduling_clicks (received_at);
    `);
  }

  insertSchedulingClick(row: SchedulingClickRow): void {
    this.db
      .prepare(
        `INSERT INTO scheduling_clicks (path, placement, locale, visitor_key, received_at)
         VALUES (@path, @placement, @locale, @visitorKey, @receivedAt)`,
      )
      .run(row);
  }

  aggregateByPathPlacement(): PathPlacementCount[] {
    return this.aggregateByPathPlacementInRange();
  }

  aggregateByPathPlacementInRange(
    fromIso?: string,
    toIso?: string,
  ): PathPlacementCount[] {
    const clauses: string[] = [];
    const params: string[] = [];
    if (fromIso) {
      clauses.push("received_at >= ?");
      params.push(fromIso);
    }
    if (toIso) {
      clauses.push("received_at <= ?");
      params.push(toIso);
    }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    return this.db
      .prepare(
        `SELECT path, placement, COUNT(*) AS count
         FROM scheduling_clicks
         ${where}
         GROUP BY path, placement
         ORDER BY path, placement`,
      )
      .all(...params) as PathPlacementCount[];
  }

  /** Deletes rows with received_at before cutoff minus months. Returns rows removed. */
  pruneOlderThanMonths(months: number, nowIso: string): number {
    const cutoff = subtractMonthsIso(nowIso, months);
    const result = this.db
      .prepare(`DELETE FROM scheduling_clicks WHERE received_at < ?`)
      .run(cutoff);
    return result.changes;
  }

  close(): void {
    this.db.close();
  }
}

function subtractMonthsIso(iso: string, months: number): string {
  const d = new Date(iso);
  d.setUTCMonth(d.getUTCMonth() - months);
  return d.toISOString();
}
