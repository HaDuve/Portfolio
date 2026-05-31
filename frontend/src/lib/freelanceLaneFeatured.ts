import type { Locale } from "./i18n";
import type { Project } from "@/types/content";
import { resolveProjectImageAlt } from "./projectMedia";
import {
  FREELANCE_LANE_PROJECT_SLUGS,
  type FreelanceLaneProjectSlug,
} from "./freelanceLaneSlugs";

export type FreelanceFeaturedProjectId = FreelanceLaneProjectSlug;

export type FeaturedProjectLink = {
  label: string;
  href: string;
};

export type FreelanceFeaturedProject = {
  id: FreelanceFeaturedProjectId;
  title: string;
  meta: string;
  description: string;
  tags: string[];
  links: FeaturedProjectLink[];
  imageSrc: string;
  imageAlt: string;
};

/** Preferred media index per slug for lane card hero images. */
const LANE_MEDIA_INDEX: Record<FreelanceFeaturedProjectId, number> = {
  "budget-for-nomads": 1,
  wikifolio: 0,
};

function localizedTitle(project: Project, locale: Locale): string {
  if (locale === "en" && project.titleEn?.trim()) {
    return project.titleEn;
  }
  return project.title;
}

function localizedDescription(project: Project, locale: Locale): string {
  if (locale === "en" && project.descriptionEn?.trim()) {
    return project.descriptionEn;
  }
  return project.description;
}

function localizedRole(project: Project, locale: Locale): string {
  if (locale === "en" && project.roleEn?.trim()) {
    return project.roleEn;
  }
  return project.role?.trim() ?? "";
}

function projectMeta(project: Project, locale: Locale): string {
  const year = project.year?.trim() ?? "";
  const role = localizedRole(project, locale);
  const parts =
    project.mediaKind === "app" ? ["App", year, role] : [year, role];
  return parts.filter(Boolean).join(" · ");
}

function projectLinks(project: Project): FeaturedProjectLink[] {
  const links: FeaturedProjectLink[] = [];
  if (project.liveUrl) {
    const label =
      project.liveUrl.includes("apps.apple.com") ||
      project.liveUrl.includes("itunes.apple.com")
        ? "App Store"
        : "Live";
    links.push({ label, href: project.liveUrl });
  }
  if (project.githubUrl) {
    links.push({ label: "GitHub", href: project.githubUrl });
  }
  return links;
}

function laneImage(
  project: Project,
  locale: Locale,
): { src: string; alt: string } | null {
  const index = LANE_MEDIA_INDEX[project.slug as FreelanceFeaturedProjectId] ?? 0;
  const item = project.media[index] ?? project.media[0];
  if (!item) return null;
  return {
    src: item.src,
    alt: resolveProjectImageAlt(item, project, locale, index, project.media.length),
  };
}

function projectToLaneCard(
  project: Project,
  locale: Locale,
): FreelanceFeaturedProject {
  const image = laneImage(project, locale);
  return {
    id: project.slug as FreelanceFeaturedProjectId,
    title: localizedTitle(project, locale),
    meta: projectMeta(project, locale),
    description: localizedDescription(project, locale),
    tags: project.tech,
    links: projectLinks(project),
    imageSrc: image?.src ?? "",
    imageAlt: image?.alt ?? localizedTitle(project, locale),
  };
}

export function freelanceLaneFeaturedProjects(
  locale: Locale,
  projects: Project[],
): FreelanceFeaturedProject[] {
  return FREELANCE_LANE_PROJECT_SLUGS.flatMap((slug) => {
    const project = projects.find((entry) => entry.slug === slug);
    return project ? [projectToLaneCard(project, locale)] : [];
  });
}
