/** Project slugs featured in the Freelance Lane (excluded from the home projects grid). */
export const FREELANCE_LANE_PROJECT_SLUGS = [
  "budget-for-nomads",
  "wikifolio",
] as const;

export type FreelanceLaneProjectSlug =
  (typeof FREELANCE_LANE_PROJECT_SLUGS)[number];

export function isFreelanceLaneProject(
  slug: string,
): slug is FreelanceLaneProjectSlug {
  return (FREELANCE_LANE_PROJECT_SLUGS as readonly string[]).includes(slug);
}
