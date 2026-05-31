import type { HeroProofShot } from "./heroProofShots";

export const DEFAULT_FRONT_PROOF_SHOT: HeroProofShot["variant"] = "phone";

export function proofShotFrontFromPointer(
  clientX: number,
  rect: DOMRect,
): HeroProofShot["variant"] {
  const ratio = (clientX - rect.left) / rect.width;
  return ratio > 0.58 ? "phone" : "browser";
}

/** Client-only; call from event handlers in client components. */
export function isLgViewport() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

export type ProofShotSwapDeps = {
  getSeparation: () => number;
  animateSeparation: (to: number) => Promise<void>;
  abortAnimation: () => void;
  getFront: () => HeroProofShot["variant"];
  setFront: (next: HeroProofShot["variant"]) => void;
  shouldAnimate: () => boolean;
};

export function createProofShotSwapController(deps: ProofShotSwapDeps) {
  let generation = 0;
  let inFlight: Promise<void> | null = null;
  let inFlightTarget: HeroProofShot["variant"] | null = null;

  async function execute(
    next: HeroProofShot["variant"],
    gen: number,
  ): Promise<void> {
    try {
      if (next === deps.getFront()) {
        if (deps.getSeparation() !== 0 && deps.shouldAnimate()) {
          deps.abortAnimation();
          await deps.animateSeparation(0);
        }
        return;
      }

      if (!deps.shouldAnimate()) {
        if (gen !== generation) return;
        deps.setFront(next);
        return;
      }

      deps.abortAnimation();
      await deps.animateSeparation(1);
      if (gen !== generation) return;

      deps.setFront(next);
      deps.abortAnimation();
      await deps.animateSeparation(0);
    } catch {
      // Separation tween was stopped by a newer swap.
    }
  }

  function requestFront(next: HeroProofShot["variant"]): Promise<void> {
    if (inFlight && inFlightTarget === next) {
      return inFlight;
    }

    if (
      !inFlight &&
      next === deps.getFront() &&
      (deps.getSeparation() === 0 || !deps.shouldAnimate())
    ) {
      return Promise.resolve();
    }

    generation += 1;
    const gen = generation;
    inFlightTarget = next;

    inFlight = execute(next, gen).finally(() => {
      if (gen === generation) {
        inFlight = null;
        inFlightTarget = null;
      }
    });

    return inFlight;
  }

  return { requestFront };
}

/** @deprecated Prefer createProofShotSwapController for serialized swaps. */
export async function requestProofShotFront(
  next: HeroProofShot["variant"],
  deps: ProofShotSwapDeps,
): Promise<void> {
  return createProofShotSwapController(deps).requestFront(next);
}
