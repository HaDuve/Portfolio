/** Offering-aware placements (ADR-0003 amendment); shared by ingest validation. */
export const SCHEDULING_PLACEMENTS = [
  "header",
  "hero-freelance",
  "hero-coaching",
  "lane-freelance",
  "lane-coaching",
  "contact-freelance",
  "contact-coaching",
  "cta",
] as const;

export type SchedulingPlacement = (typeof SCHEDULING_PLACEMENTS)[number];

export const PLACEMENTS = new Set<string>(SCHEDULING_PLACEMENTS);

export type OfferingIntent = "freelance" | "coaching";

/** Derives offering intent from placement suffix; header and landing cta return null. */
export function offeringIntentFromPlacement(
  placement: string,
): OfferingIntent | null {
  if (placement.endsWith("-freelance")) return "freelance";
  if (placement.endsWith("-coaching")) return "coaching";
  return null;
}
