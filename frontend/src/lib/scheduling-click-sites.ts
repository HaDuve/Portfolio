import type { SchedulingPlacement } from "./click-telemetry";

const HOME_PLACEMENTS: SchedulingPlacement[] = [
  "header",
  "mobile-freelance",
  "mobile-coaching",
  "hero-freelance",
  "hero-coaching",
  "lane-freelance",
  "lane-coaching",
  "contact-freelance",
  "contact-coaching",
];

function homeClicks(locale: "de" | "en"): ReadonlyArray<{
  path: string;
  placement: SchedulingPlacement;
  locale: "de" | "en";
}> {
  const path = locale === "de" ? "/de/" : "/en/";
  return HOME_PLACEMENTS.map((placement) => ({ path, placement, locale }));
}

/** All Calendly SchedulingLink call sites (dual-lane home per locale + landing cta). */
export const INSTRUMENTED_SCHEDULING_CLICKS: ReadonlyArray<{
  path: string;
  placement: SchedulingPlacement;
  locale: "de" | "en";
}> = [
  ...homeClicks("de"),
  ...homeClicks("en"),
  { path: "/de/app-entwickeln-freelancer/", placement: "cta", locale: "de" },
  { path: "/de/programmieren-lernen-mit-ki/", placement: "cta", locale: "de" },
  { path: "/en/freelance-app-development/", placement: "cta", locale: "en" },
  { path: "/en/vibe-coding-coach/", placement: "cta", locale: "en" },
] as const;
