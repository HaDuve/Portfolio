import Image from "next/image";
import Link from "next/link";
import { SchedulingLink } from "@/components/SchedulingLink";
import { SectionHeadingMotion } from "@/components/SectionHeadingMotion";
import { freelanceLaneSection } from "@/lib/freelanceLane";
import { freelanceLaneFeaturedProjects } from "@/lib/freelanceLaneFeatured";
import { homeServiceCards } from "@/lib/homeServices";
import type { Locale } from "@/lib/i18n";
import type { Project } from "@/types/content";
import { OfferingLadderStrip } from "@/components/OfferingLadderStrip";
import { offeringLadder } from "@/lib/offeringLadder";

type Props = {
  locale: Locale;
  schedulingUrl: string;
  projects: Project[];
  scrollReveal?: boolean;
};

export function FreelanceLane({
  locale,
  schedulingUrl,
  projects,
  scrollReveal = true,
}: Props) {
  const section = freelanceLaneSection(locale);
  const featured = freelanceLaneFeaturedProjects(locale, projects);
  const ladder = offeringLadder(locale);
  const services = homeServiceCards(locale);

  return (
    <section
      id="freelance"
      className="scroll-mt-28"
      aria-label={locale === "en" ? "Freelance development" : "Freelance Entwicklung"}
    >
      <SectionHeadingMotion
        scrollReveal={scrollReveal}
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
      />

      <div className="mt-12 space-y-8">
        {featured.map((project) => (
          <article
            key={project.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 ease-out hover:shadow-md dark:border-stone-700/80 lg:flex-row"
          >
            <div className="relative aspect-[16/10] min-h-0 w-full shrink-0 overflow-hidden bg-gradient-to-br from-accent/10 via-stone-100 to-stone-200/80 dark:from-accent/5 dark:via-zinc-900 dark:to-zinc-950 lg:aspect-auto lg:w-2/5">
              <Image
                src={project.imageSrc}
                alt={project.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-widest text-muted">
                {project.meta}
              </p>
              <h3 className="font-display mt-2 text-2xl font-normal text-foreground">
                {project.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                {project.description}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-lg border border-border bg-background px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-wide text-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-accent underline-offset-4 transition hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <OfferingLadderStrip ladder={ladder} />

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {services.map((card) => (
          <article
            key={card.id}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <h3 className="font-display text-xl font-normal text-foreground">
              {card.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              {card.description}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <SchedulingLink
          href={schedulingUrl}
          placement={section.schedulingPlacement}
          locale={locale}
          className="inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 dark:text-stone-950"
        >
          {section.ctaLabel}
        </SchedulingLink>
        <Link
          href={section.moreHref}
          className="text-sm font-medium text-accent underline-offset-4 transition hover:underline"
        >
          {section.moreLabel}
        </Link>
      </div>
    </section>
  );
}
