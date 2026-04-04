import type { Project } from "@/types/content";
import Image from "next/image";

type Props = { project: Project; variant?: "default" | "featured" };

export function ProjectCard({ project, variant = "default" }: Props) {
  const isFeatured = variant === "featured";
  const meta = [project.year, project.role].filter(Boolean).join(" · ");

  return (
    <article
      className={
        isFeatured
          ? "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 ease-out hover:shadow-md dark:border-stone-700/80"
          : "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md dark:border-stone-800"
      }
    >
      <div
        className={
          isFeatured
            ? "relative aspect-[21/9] overflow-hidden bg-gradient-to-br from-accent/15 via-card to-stone-300/30 dark:from-accent/10 dark:via-card dark:to-stone-800/50 sm:aspect-[2.4/1]"
            : "relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-accent/10 via-stone-100 to-stone-200/80 dark:from-accent/5 dark:via-zinc-900 dark:to-zinc-950"
        }
      >
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt=""
            fill
            className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
            sizes={isFeatured ? "(max-width: 768px) 100vw, 72rem" : "(max-width: 768px) 100vw, 50vw"}
            priority={isFeatured}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl font-display font-normal text-stone-400/90 dark:text-stone-600 sm:text-6xl">
            {project.title.slice(0, 1)}
          </div>
        )}
        {isFeatured ? (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent dark:from-background/90" />
        ) : null}
      </div>
      <div className={`flex flex-1 flex-col gap-3 ${isFeatured ? "p-6 sm:p-8" : "p-5"}`}>
        {meta ? (
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted">{meta}</p>
        ) : null}
        <h3
          className={
            isFeatured
              ? "font-display text-2xl font-normal tracking-tight text-foreground sm:text-3xl"
              : "text-lg font-semibold tracking-tight text-foreground"
          }
        >
          {project.title}
        </h3>
        <p
          className={
            isFeatured
              ? "max-w-3xl text-base leading-relaxed text-stone-600 dark:text-stone-400"
              : "text-sm leading-relaxed text-stone-600 dark:text-stone-400"
          }
        >
          {project.description}
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
              Live
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
