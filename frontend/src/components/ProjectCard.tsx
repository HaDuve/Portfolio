"use client";

import type { Project } from "@/types/content";
import type { Locale } from "@/lib/i18n";
import { resolveProjectImageAlt } from "@/lib/projectMedia";
import { ParallaxLetter } from "@/components/ParallaxLetter";
import { ParallaxMedia } from "@/components/ParallaxMedia";
import { ProjectMediaCarousel } from "@/components/ProjectMediaCarousel";

type Props = {
  project: Project;
  locale: Locale;
  variant?: "default" | "featured";
  /** Kept for API compatibility; scroll-in was removed (nested opacity + whileInView + Lenis broke visibility). */
  index?: number;
};

export function ProjectCard({ project, locale, variant = "default" }: Props) {
  const showEnglish = locale === "en";
  const isFeatured = variant === "featured";

  const title =
    showEnglish && project.titleEn?.trim()
      ? project.titleEn
      : project.title;
  const description =
    showEnglish && project.descriptionEn?.trim()
      ? project.descriptionEn
      : project.description;
  const roleLine =
    showEnglish && project.roleEn?.trim()
      ? project.roleEn
      : project.role;

  const meta = [project.year, roleLine].filter(Boolean).join(" · ");
  const liveLabel =
    project.liveUrl?.includes("apps.apple.com") ||
    project.liveUrl?.includes("itunes.apple.com")
      ? "App Store"
      : "Live";

  const media = project.media;
  const mediaKind = project.mediaKind ?? "web";
  const showAppBadge = mediaKind === "app";

  const regionAriaLabel = showEnglish
    ? `Images: ${title}`
    : `Bilder: ${title}`;

  const frameClass = isFeatured
    ? "relative aspect-[21/9] overflow-hidden bg-gradient-to-br from-accent/15 via-card to-stone-300/30 dark:from-accent/10 dark:via-card dark:to-stone-800/50 sm:aspect-[2.4/1]"
    : "relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-accent/10 via-stone-100 to-stone-200/80 dark:from-accent/5 dark:via-zinc-900 dark:to-zinc-950";

  const sizes = isFeatured
    ? "(max-width: 768px) 100vw, 72rem"
    : "(max-width: 768px) 100vw, 50vw";

  const cardClass =
    isFeatured
      ? "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 ease-out hover:shadow-md dark:border-stone-700/80"
      : "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md dark:border-stone-800";

  return (
    <article className={cardClass}>
      <div className="relative">
        {media.length === 0 ? (
          <ParallaxLetter
            letter={title.slice(0, 1)}
            frameClassName={frameClass}
            isFeatured={isFeatured}
          />
        ) : media.length === 1 ? (
          <>
            <ParallaxMedia
              imageUrl={media[0].src}
              alt={resolveProjectImageAlt(
                media[0],
                project,
                locale,
                0,
                1,
              )}
              sizes={sizes}
              priority={isFeatured}
              frameClassName={frameClass}
              mediaKind={mediaKind}
            />
            {showAppBadge ? (
              <span
                className="pointer-events-none absolute left-3 top-3 z-20 rounded-md border border-border bg-background/90 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted shadow-sm backdrop-blur-sm"
                aria-hidden
              >
                App
              </span>
            ) : null}
          </>
        ) : (
          <ProjectMediaCarousel
            project={project}
            items={media}
            locale={locale}
            mediaKind={mediaKind}
            frameClassName={frameClass}
            sizes={sizes}
            priority={isFeatured}
            showAppBadge={showAppBadge}
            regionAriaLabel={regionAriaLabel}
            isFeatured={isFeatured}
          />
        )}
        {isFeatured && media.length <= 1 ? (
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-background/80 via-transparent to-transparent dark:from-background/90" />
        ) : null}
      </div>
      <div
        className={`flex flex-1 flex-col gap-3 ${isFeatured ? "p-6 sm:p-8" : "p-5"}`}
      >
        {meta ? (
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
            {meta}
          </p>
        ) : null}
        <h3
          className={
            isFeatured
              ? "font-display text-2xl font-normal tracking-tight text-foreground sm:text-3xl"
              : "text-lg font-semibold tracking-tight text-foreground"
          }
        >
          {title}
        </h3>
        <p
          className={
            isFeatured
              ? "max-w-3xl text-base leading-relaxed text-stone-600 dark:text-stone-400"
              : "text-sm leading-relaxed text-stone-600 dark:text-stone-400"
          }
        >
          {description}
        </p>
        <ul className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li
              key={t}
              className="rounded-full bg-stone-200/80 px-2.5 py-0.5 text-xs font-medium text-stone-800 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-4 pt-1">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-accent underline-offset-4 transition hover:underline"
            >
              GitHub
            </a>
          ) : null}
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-accent underline-offset-4 transition hover:underline"
            >
              {liveLabel}
            </a>
          ) : null}
          {project.playStoreUrl ? (
            <a
              href={project.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-accent underline-offset-4 transition hover:underline"
            >
              Play Store
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
