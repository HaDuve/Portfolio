import { describe, it, expect, beforeEach } from "vitest";
import {
  INTRO_SESSION_KEY,
  markIntroPlayedThisSession,
  readIntroPlayedThisSession,
} from "./introSession";

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.get(key) ?? null;
    },
    key(index: number) {
      return [...map.keys()][index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
  };
}

describe("introSession", () => {
  let storage: Storage;

  beforeEach(() => {
    storage = createMemoryStorage();
  });

  it("plays intro on first visit in a session", () => {
    expect(readIntroPlayedThisSession(storage)).toBe(false);
  });

  it("skips intro after it has played once this session", () => {
    markIntroPlayedThisSession(storage);
    expect(readIntroPlayedThisSession(storage)).toBe(true);
  });

  it("uses a stable sessionStorage key", () => {
    markIntroPlayedThisSession(storage);
    expect(storage.getItem(INTRO_SESSION_KEY)).toBe("1");
  });
});
