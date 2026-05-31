import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { HeroProofShot } from "./heroProofShots";
import {
  DEFAULT_FRONT_PROOF_SHOT,
  createProofShotSwapController,
  proofShotFrontFromPointer,
  type ProofShotSwapDeps,
} from "./heroProofShotSwap";

function createDeps(
  overrides: Partial<ProofShotSwapDeps> & {
    initialFront?: HeroProofShot["variant"];
    initialSeparation?: number;
  } = {},
) {
  let front = overrides.initialFront ?? DEFAULT_FRONT_PROOF_SHOT;
  let separation = overrides.initialSeparation ?? 0;
  const separationTargets: number[] = [];
  let spreadRelease: (() => void) | null = null;
  let holdSpreadAnimation = false;

  const animateSeparation = vi.fn(async (to: number) => {
    separationTargets.push(to);
    if (to === 1 && holdSpreadAnimation) {
      await new Promise<void>((resolve) => {
        spreadRelease = resolve;
      });
    }
    separation = to;
  });

  const deps: ProofShotSwapDeps = {
    getSeparation: () => separation,
    animateSeparation,
    abortAnimation: vi.fn(),
    getFront: () => front,
    setFront: (next) => {
      front = next;
    },
    shouldAnimate: () => true,
    ...overrides,
  };

  return {
    deps,
    animateSeparation,
    getFront: () => front,
    getSeparation: () => separation,
    getSeparationTargets: () => separationTargets,
    holdSpread: () => {
      holdSpreadAnimation = true;
    },
    releaseSpread: () => {
      holdSpreadAnimation = false;
      spreadRelease?.();
      spreadRelease = null;
    },
  };
}

describe("proofShotFrontFromPointer", () => {
  const rect = { left: 100, width: 200 } as DOMRect;

  it("puts browser in front on the left side of the stack", () => {
    expect(proofShotFrontFromPointer(150, rect)).toBe("browser");
  });

  it("keeps browser in front up to the split ratio", () => {
    expect(proofShotFrontFromPointer(216, rect)).toBe("browser");
  });

  it("puts phone in front just past the split ratio", () => {
    expect(proofShotFrontFromPointer(217, rect)).toBe("phone");
  });

  it("puts phone in front on the right side of the stack", () => {
    expect(proofShotFrontFromPointer(250, rect)).toBe("phone");
  });
});

describe("createProofShotSwapController", () => {
  it("does nothing when the target is already in front and shots are at rest", async () => {
    const { deps, animateSeparation, getFront } = createDeps({
      initialFront: "phone",
    });
    const { requestFront } = createProofShotSwapController(deps);

    await requestFront("phone");

    expect(animateSeparation).not.toHaveBeenCalled();
    expect(getFront()).toBe("phone");
  });

  it("swaps front immediately without separation when animation is disabled", async () => {
    const { deps, animateSeparation, getFront } = createDeps({
      initialFront: "phone",
      shouldAnimate: () => false,
    });
    const { requestFront } = createProofShotSwapController(deps);

    await requestFront("browser");

    expect(getFront()).toBe("browser");
    expect(animateSeparation).not.toHaveBeenCalled();
  });

  it("spreads apart, swaps front at peak separation, then reunites on lg+", async () => {
    const { deps, animateSeparation, getFront, getSeparationTargets } =
      createDeps({ initialFront: "phone" });
    const { requestFront } = createProofShotSwapController(deps);

    await requestFront("browser");

    expect(getSeparationTargets()).toEqual([1, 0]);
    expect(getFront()).toBe("browser");
    expect(animateSeparation).toHaveBeenCalledTimes(2);
  });

  it("reunites when the target is already in front but shots are still separated", async () => {
    const { deps, animateSeparation, getSeparationTargets } = createDeps({
      initialFront: "phone",
      initialSeparation: 1,
    });
    const { requestFront } = createProofShotSwapController(deps);

    await requestFront("phone");

    expect(getSeparationTargets()).toEqual([0]);
    expect(animateSeparation).toHaveBeenCalledOnce();
  });

  it("aborts an in-flight separation tween before starting a new swap", async () => {
    const abortAnimation = vi.fn();
    const { deps } = createDeps({
      initialFront: "phone",
      abortAnimation,
    });
    const { requestFront } = createProofShotSwapController(deps);

    await requestFront("browser");

    expect(abortAnimation).toHaveBeenCalled();
  });

  it("coalesces duplicate targets while a swap is in flight", async () => {
    const { deps, animateSeparation, holdSpread, releaseSpread, getFront } =
      createDeps({ initialFront: "phone" });
    const { requestFront } = createProofShotSwapController(deps);

    holdSpread();
    const first = requestFront("browser");
    const second = requestFront("browser");

    expect(animateSeparation).toHaveBeenCalledTimes(1);

    releaseSpread();
    await Promise.all([first, second]);

    expect(getFront()).toBe("browser");
    expect(animateSeparation).toHaveBeenCalledTimes(2);
  });

  it("finishes with the latest target when interrupted mid-spread", async () => {
    let front: HeroProofShot["variant"] = "phone";
    let separation = 0;
    let releaseSpread: (() => void) | undefined;

    const deps: ProofShotSwapDeps = {
      getSeparation: () => separation,
      animateSeparation: vi.fn(async (to: number) => {
        if (to === 1) {
          await new Promise<void>((resolve) => {
            releaseSpread = resolve;
          });
          separation = 1;
          return;
        }
        separation = to;
      }),
      abortAnimation: vi.fn(),
      getFront: () => front,
      setFront: (next) => {
        front = next;
      },
      shouldAnimate: () => true,
    };
    const { requestFront } = createProofShotSwapController(deps);

    const browserSwap = requestFront("browser");
    await requestFront("phone");
    releaseSpread?.();
    await browserSwap;

    expect(front).toBe("phone");
  });

  it("does not apply a stale front after a newer swap preempts", async () => {
    const setFront = vi.fn();
    let spreadGate: (() => void) | null = null;
    let front: HeroProofShot["variant"] = "phone";

    const deps: ProofShotSwapDeps = {
      getSeparation: () => 0,
      animateSeparation: vi.fn(async (to: number) => {
        if (to === 1) {
          await new Promise<void>((resolve) => {
            spreadGate = resolve;
          });
        }
      }),
      abortAnimation: vi.fn(),
      getFront: () => front,
      setFront: (next) => {
        front = next;
        setFront(next);
      },
      shouldAnimate: () => true,
    };

    const { requestFront } = createProofShotSwapController(deps);

    const browserSwap = requestFront("browser");
    const phoneSwap = requestFront("phone");
    spreadGate?.();
    await Promise.all([browserSwap, phoneSwap]);

    expect(setFront).not.toHaveBeenCalledWith("browser");
    expect(front).toBe("phone");
  });

  it("swallows aborted separation tweens without throwing", async () => {
    const { deps } = createDeps({ initialFront: "phone" });
    deps.animateSeparation = vi
      .fn()
      .mockRejectedValueOnce(new Error("stopped"))
      .mockResolvedValue(undefined);
    const { requestFront } = createProofShotSwapController(deps);

    await expect(requestFront("browser")).resolves.toBeUndefined();
  });
});

describe("hero proof-shot swap wiring", () => {
  const heroSource = readFileSync(
    path.join(__dirname, "../components/Hero.tsx"),
    "utf8",
  );

  it("serializes front changes through createProofShotSwapController", () => {
    expect(heroSource).toContain("createProofShotSwapController");
    expect(heroSource).toContain("onPointerLeave={() => requestFront(DEFAULT_FRONT_PROOF_SHOT)}");
  });

  it("composes lg offsets in motion instead of tailwind translate utilities", () => {
    expect(heroSource).toContain("browserXFromSeparation");
    expect(heroSource).toContain("proofShotSeparationTransition");
    expect(heroSource).not.toContain("lg:-translate-x-12");
    expect(heroSource).not.toContain("lg:-translate-y-1/2");
  });
});
