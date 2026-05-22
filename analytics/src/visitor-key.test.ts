import { describe, it, expect } from "vitest";
import { deriveVisitorKey } from "./visitor-key.js";

describe("deriveVisitorKey", () => {
  it("returns the same key for the same IP and salt", () => {
    const a = deriveVisitorKey("203.0.113.42", "test-salt");
    const b = deriveVisitorKey("203.0.113.42", "test-salt");
    expect(a).toBe(b);
    expect(a).toMatch(/^[a-f0-9]{32}$/);
  });

  it("returns different keys for different IPs with the same salt", () => {
    const a = deriveVisitorKey("203.0.113.1", "test-salt");
    const b = deriveVisitorKey("203.0.113.2", "test-salt");
    expect(a).not.toBe(b);
  });

  it("does not contain the raw IP", () => {
    const ip = "198.51.100.9";
    const key = deriveVisitorKey(ip, "pepper");
    expect(key).not.toContain(ip);
    expect(key).not.toContain("198");
  });
});
