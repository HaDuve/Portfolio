import type { Project } from "@/types/content";
import Image from "next/image";

type Props = { project: Project };

export function ProjectCard({ project }: Props) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-violet-500/20 via-zinc-100 to-cyan-500/20 dark:from-violet-500/10 dark:via-zinc-900 dark:to-cyan-500/10">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt=""
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-bold text-zinc-400/80 dark:text-zinc-600">
            {project.title.slice(0, 1)}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {project.title}
        </h3>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {project.description}
        </p>
        <ul className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li
              key={t}
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-3 pt-1">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-violet-600 underline-offset-4 hover:underline dark:text-violet-400"
            >
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-violet-600 underline-offset-4 hover:underline dark:text-violet-400"
            >
              Live
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
