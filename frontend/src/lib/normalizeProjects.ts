import type { Project, ProjectMediaItem, RawProject } from "@/types/content";

function mediaFromRaw(raw: RawProject): ProjectMediaItem[] {
  if (raw.media && raw.media.length > 0) {
    return raw.media;
  }
  if (raw.imageUrl) {
    return [
      {
        src: raw.imageUrl,
        altDe: raw.imageAltDe,
        altEn: raw.imageAltEn,
      },
    ];
  }
  return [];
}

export function normalizeProject(raw: RawProject): Project {
  return {
    id: raw.id,
    title: raw.title,
    titleEn: raw.titleEn,
    slug: raw.slug,
    description: raw.description,
    descriptionEn: raw.descriptionEn,
    tech: raw.tech,
    media: mediaFromRaw(raw),
    mediaKind: raw.mediaKind,
    githubUrl: raw.githubUrl,
    liveUrl: raw.liveUrl,
    playStoreUrl: raw.playStoreUrl ?? null,
    featured: raw.featured,
    year: raw.year,
    role: raw.role,
    roleEn: raw.roleEn,
  };
}

export function normalizeProjects(raw: RawProject[]): Project[] {
  return raw.map(normalizeProject);
}
