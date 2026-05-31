import { describe, it, expect } from "vitest";
import projectsData from "@/data/projects.json";
import { normalizeProjects } from "@/lib/normalizeProjects";
import { projectsForHomeGrid } from "./homeProjectsGrid";
import { FREELANCE_LANE_PROJECT_SLUGS } from "./freelanceLaneSlugs";
import type { RawProject } from "@/types/content";

const projects = normalizeProjects(projectsData as RawProject[]);

describe("projectsForHomeGrid", () => {
  it("excludes Freelance Lane featured slugs from the home projects grid", () => {
    const grid = projectsForHomeGrid(projects);
    const gridSlugs = grid.map((p) => p.slug);
    for (const slug of FREELANCE_LANE_PROJECT_SLUGS) {
      expect(gridSlugs).not.toContain(slug);
    }
  });

  it("keeps other projects in the grid", () => {
    const grid = projectsForHomeGrid(projects);
    expect(grid.length).toBeGreaterThan(0);
    expect(grid.length).toBeLessThan(projects.length);
  });
});
