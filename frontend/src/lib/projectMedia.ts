import type { Locale } from "@/lib/i18n";
import type { Project, ProjectMediaItem } from "@/types/content";

export function resolveProjectImageAlt(
  item: ProjectMediaItem,
  project: Project,
  locale: Locale,
  slideIndex: number,
  slideCount: number,
): string {
  const showEnglish = locale === "en";
  const fromItem = showEnglish
    ? item.altEn?.trim() || item.altDe?.trim()
    : item.altDe?.trim() || item.altEn?.trim();
  if (fromItem) return fromItem;
  const name = showEnglish
    ? project.titleEn?.trim() || project.title
    : project.title;
  return `${name} · ${slideIndex + 1} / ${slideCount}`;
}
