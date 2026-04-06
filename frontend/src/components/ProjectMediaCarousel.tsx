"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "motion/react";
import { ParallaxMedia } from "@/components/ParallaxMedia";
import type { Locale } from "@/lib/i18n";
import { resolveProjectImageAlt } from "@/lib/projectMedia";
import type { Project, ProjectMediaItem } from "@/types/content";

const focusBtn =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

type Props = {
  project: Project;
  items: ProjectMediaItem[];
  locale: Locale;
  mediaKind: "app" | "web";
  frameClassName: string;
  sizes: string;
  priority?: boolean;
  showAppBadge: boolean;
  /** Accessible name for the carousel region (e.g. title + “images”) */
  regionAriaLabel: string;
  /** Darken bottom of frame (featured card), below controls */
  isFeatured?: boolean;
};

export function ProjectMediaCarousel({
  project,
  items,
  locale,
  mediaKind,
  frameClassName,
  sizes,
  priority,
  showAppBadge,
  regionAriaLabel,
  isFeatured = false,
}: Props) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : 22;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    duration,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit({ duration });
  }, [emblaApi, duration]);

  useEffect(() => {
    if (!emblaApi) return;
    const sync = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("init", sync);
    emblaApi.on("select", sync);
    emblaApi.on("reInit", sync);
    return () => {
      emblaApi.off("init", sync);
      emblaApi.off("select", sync);
      emblaApi.off("reInit", sync);
    };
  }, [emblaApi]);

  const showEnglish = locale === "en";
  const n = items.length;
  const prevLabel = showEnglish ? "Previous image" : "Vorheriges Bild";
  const nextLabel = showEnglish ? "Next image" : "Nächstes Bild";
  const pickerLabel = showEnglish
    ? "Choose slide to display"
    : "Folie wählen";

  const canPrev = emblaApi?.canScrollPrev() ?? false;
  const canNext = emblaApi?.canScrollNext() ?? false;

  return (
    <div
      className={`${frameClassName} relative`}
      role="region"
      aria-label={regionAriaLabel}
      aria-live="off"
    >
      <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {items.map((item, i) => (
            <div
              key={`${project.id}-${item.src}-${i}`}
              className="h-full min-w-0 shrink-0 grow-0 basis-full"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
            >
              <ParallaxMedia
                imageUrl={item.src}
                alt={resolveProjectImageAlt(
                  item,
                  project,
                  locale,
                  i,
                  n,
                )}
                sizes={sizes}
                priority={priority && i === 0}
                frameClassName="relative h-full min-h-[1px] w-full"
                mediaKind={mediaKind}
                parallax={false}
              />
            </div>
          ))}
        </div>
      </div>

      {isFeatured ? (
        <div className="pointer-events-none absolute inset-0 z-[8] bg-gradient-to-t from-background/80 via-transparent to-transparent dark:from-background/90" />
      ) : null}

      {showAppBadge ? (
        <span
          className="pointer-events-none absolute left-3 top-3 z-20 rounded-md border border-border bg-background/90 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted shadow-sm backdrop-blur-sm"
          aria-hidden
        >
          App
        </span>
      ) : null}

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-between px-1 sm:px-2">
        <button
          type="button"
          className={`pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background/85 text-foreground shadow-sm backdrop-blur-sm transition hover:bg-background ${focusBtn} disabled:pointer-events-none disabled:opacity-40`}
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canPrev}
          aria-label={prevLabel}
        >
          <ChevronLeftIcon aria-hidden />
        </button>
        <button
          type="button"
          className={`pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background/85 text-foreground shadow-sm backdrop-blur-sm transition hover:bg-background ${focusBtn} disabled:pointer-events-none disabled:opacity-40`}
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canNext}
          aria-label={nextLabel}
        >
          <ChevronRightIcon aria-hidden />
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-20 flex justify-center">
        <div
          className="pointer-events-auto flex gap-1 rounded-full border border-border/80 bg-background/80 px-1.5 py-1 shadow-sm backdrop-blur-sm"
          role="group"
          aria-label={pickerLabel}
        >
          {items.map((_, i) => (
            <button
              key={`dot-${project.id}-${i}`}
              type="button"
              className={`flex h-11 w-11 items-center justify-center rounded-full transition ${focusBtn} ${
                selectedIndex === i ? "" : "hover:bg-foreground/5"
              }`}
              aria-label={
                showEnglish
                  ? `Go to image ${i + 1} of ${n}`
                  : `Bild ${i + 1} von ${n}`
              }
              aria-current={selectedIndex === i ? true : undefined}
              onClick={() => emblaApi?.scrollTo(i)}
            >
              <span
                className={`block h-2 w-2 rounded-full ${
                  selectedIndex === i ? "bg-accent" : "bg-muted"
                }`}
                aria-hidden
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
