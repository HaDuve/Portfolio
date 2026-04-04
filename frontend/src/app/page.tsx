import { ProjectCard } from "@/components/ProjectCard";
import profile from "@/data/profile.json";
import projectsData from "@/data/projects.json";
import skillsData from "@/data/skills.json";
import type { Project } from "@/types/content";

const projects = projectsData as Project[];

export default function Home() {
  return (
    <div id="top" className="flex flex-1 flex-col">
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 shadow-sm sm:px-10">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl dark:bg-violet-500/10"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/10"
            aria-hidden
          />
          <p className="text-sm font-medium uppercase tracking-widest text-violet-600 dark:text-violet-400">
            Portfolio
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            {profile.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">{profile.tagline}</p>
          <p className="mt-6 max-w-2xl leading-relaxed text-zinc-600 dark:text-zinc-400">
            {profile.bio}
          </p>
          <p className="mt-4 text-sm text-muted">{profile.location}</p>
        </section>

        <section id="projects" className="mt-20 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Selected work — swap in your repos, screenshots, and case studies.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <section id="skills" className="mt-20 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Grouped by area — edit{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
              src/data/skills.json
            </code>{" "}
            to match your stack.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {skillsData.categories.map((cat) => (
              <div
                key={cat.name}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <h3 className="font-semibold text-foreground">{cat.name}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-lg bg-zinc-100 px-2.5 py-1 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="mt-20 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Prefer email? Reach out directly — or add a form backend later.
          </p>
          <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-border bg-card p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Email</p>
              <a
                href={`mailto:${profile.email}`}
                className="mt-1 text-lg font-medium text-violet-600 underline-offset-4 hover:underline dark:text-violet-400"
              >
                {profile.email}
              </a>
            </div>
            <div className="flex flex-wrap gap-4">
              {profile.social.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} {profile.name}. Static site — Next.js +
        Caddy.
      </footer>
    </div>
  );
}
