import { ClickStore } from "./click-store.js";
import { loadConfig } from "./config.js";

const config = loadConfig();
const store = new ClickStore(config.dbPath);
const deleted = store.pruneOlderThanMonths(12, new Date().toISOString());
store.close();
console.log(`pruned ${deleted} scheduling click row(s) older than 12 months`);
