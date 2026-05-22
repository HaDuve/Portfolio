import { createServer } from "node:http";
import { ClickStore } from "./click-store.js";
import { IngestService } from "./ingest.js";
import { loadConfig } from "./config.js";
import { createHttpHandler } from "./http.js";

const config = loadConfig();
const store = new ClickStore(config.dbPath);
const ingest = new IngestService({
  store,
  ingestSecret: config.ingestSecret,
  ipHashSalt: config.ipHashSalt,
  allowedOrigins: config.allowedOrigins,
  rateLimitPerIp: config.rateLimitPerIp,
  rateLimitWindowMs: config.rateLimitWindowMs,
});

const server = createServer(createHttpHandler(ingest));

server.listen(config.port, () => {
  console.log(`analytics ingest listening on :${config.port}`);
});

function shutdown() {
  store.close();
  server.close(() => process.exit(0));
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
