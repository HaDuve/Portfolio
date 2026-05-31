export const INTRO_SESSION_KEY = "portfolioIntroPlayed";

type SessionStorageLike = Pick<Storage, "getItem" | "setItem">;

function defaultStorage(): SessionStorageLike | null {
  if (typeof sessionStorage === "undefined") return null;
  return sessionStorage;
}

export function readIntroPlayedThisSession(
  storage: SessionStorageLike | null = defaultStorage(),
): boolean {
  try {
    return storage?.getItem(INTRO_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroPlayedThisSession(
  storage: SessionStorageLike | null = defaultStorage(),
): void {
  try {
    storage?.setItem(INTRO_SESSION_KEY, "1");
  } catch {
    /* private mode / quota */
  }
}
