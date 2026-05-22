export type AnalyticsConfig = {
  port: number;
  dbPath: string;
  ingestSecret: string;
  ipHashSalt: string;
  allowedOrigins: string[];
  rateLimitPerIp: number;
  rateLimitWindowMs: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AnalyticsConfig {
  const ingestSecret = env.ANALYTICS_INGEST_SECRET;
  const ipHashSalt = env.ANALYTICS_IP_HASH_SALT;
  if (!ingestSecret || !ipHashSalt) {
    throw new Error(
      "ANALYTICS_INGEST_SECRET and ANALYTICS_IP_HASH_SALT are required",
    );
  }

  const allowedOrigins = (env.ANALYTICS_ALLOWED_ORIGINS ??
    "https://hannesduve.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    port: Number(env.ANALYTICS_PORT ?? "3000"),
    dbPath: env.ANALYTICS_DB_PATH ?? "/data/clicks.sqlite",
    ingestSecret,
    ipHashSalt,
    allowedOrigins,
    rateLimitPerIp: Number(env.ANALYTICS_RATE_LIMIT_PER_IP ?? "60"),
    rateLimitWindowMs: Number(env.ANALYTICS_RATE_LIMIT_WINDOW_MS ?? "60000"),
  };
}
