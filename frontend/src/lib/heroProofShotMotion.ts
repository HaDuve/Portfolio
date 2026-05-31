export const PROOF_SHOT_SEPARATION_PX = 40;
export const BROWSER_BASE_X = -48;

/** Overdamped spring — smooth spread/reunite without overshoot on x. */
export function proofShotSeparationTransition() {
  return {
    type: "spring" as const,
    stiffness: 220,
    damping: 32,
    mass: 0.95,
  };
}

export function phoneXFromSeparation(separation: number): number {
  return separation * PROOF_SHOT_SEPARATION_PX;
}

export function browserXFromSeparation(separation: number): number {
  return BROWSER_BASE_X - separation * PROOF_SHOT_SEPARATION_PX;
}
