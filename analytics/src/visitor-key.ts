import { createHmac } from "node:crypto";

/** Pseudonymous visitor key from client IP + server salt (no raw IP stored). */
export function deriveVisitorKey(clientIp: string, salt: string): string {
  return createHmac("sha256", salt).update(clientIp).digest("hex").slice(0, 32);
}
