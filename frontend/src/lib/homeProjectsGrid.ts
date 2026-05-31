import type { Project } from "@/types/content";
import { isFreelanceLaneProject } from "./freelanceLaneSlugs";

/** Projects shown in `#projects` — lane-featured slugs are excluded to avoid duplication. */
export function projectsForHomeGrid(projects: Project[]): Project[] {
  return projects.filter((project) => !isFreelanceLaneProject(project.slug));
}
