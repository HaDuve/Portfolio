import type { SchedulingPlacement } from "./click-telemetry";

/** All six Calendly SchedulingLink call sites (path, placement, locale). */
export const INSTRUMENTED_SCHEDULING_CLICKS: ReadonlyArray<{
  path: string;
  placement: SchedulingPlacement;
  locale: "de" | "en";
}> = [
  { path: "/de/", placement: "hero", locale: "de" },
  { path: "/de/", placement: "contact", locale: "de" },
  { path: "/de/app-entwickeln-freelancer/", placement: "cta", locale: "de" },
  { path: "/de/programmieren-lernen-mit-ki/", placement: "cta", locale: "de" },
  { path: "/en/freelance-app-development/", placement: "cta", locale: "en" },
  { path: "/en/vibe-coding-coach/", placement: "cta", locale: "en" },
] as const;
