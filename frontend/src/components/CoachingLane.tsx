import Link from "next/link";
import { SchedulingLink } from "@/components/SchedulingLink";
import { SectionHeading } from "@/components/SectionHeading";
import {
  coachingLaneFaq,
  coachingLaneSection,
  coachingLaneTimeline,
  coachingLaneTools,
} from "@/lib/coachingLane";
import type { Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  schedulingUrl: string;
};

export function CoachingLane({ locale, schedulingUrl }: Props) {
  const section = coachingLaneSection(locale);
  const timeline = coachingLaneTimeline(locale);
  const tools = coachingLaneTools(locale);
  const faq = coachingLaneFaq(locale);

  return (
    <section
      id="coaching"
      className="scroll-mt-28"
      aria-label={locale === "en" ? "AI coding coaching" : "KI-Coaching"}
    >
      <SectionHeading
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
      />

      <div
        className="mt-12 grid max-w-2xl gap-5 md:max-w-none md:grid-cols-4 md:gap-4"
        role="list"
      >
        {timeline.map((step) => (
          <article
            key={step.id}
            role="listitem"
            className="min-w-0 rounded-2xl border border-border bg-card/80 p-5 shadow-sm dark:bg-card"
          >
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-accent">
              {step.stepNum}
            </p>
            <h3 className="font-display mt-2 text-[1.0625rem] font-normal text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              {step.description}
            </p>
          </article>
        ))}
      </div>

      <div
        className="mt-8 flex flex-wrap gap-2"
        aria-label={locale === "en" ? "Tools" : "Werkzeuge"}
      >
        {tools.map((tool) => (
          <span
            key={tool.id}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted"
          >
            {tool.label}
          </span>
        ))}
      </div>

      <div className="mt-8 grid max-w-2xl gap-4 sm:max-w-none sm:grid-cols-2">
        {faq.map((item) => (
          <article
            key={item.id}
            className="min-w-0 rounded-2xl border border-border bg-card/80 p-5 shadow-sm dark:bg-card"
          >
            <h3 className="text-[0.9375rem] font-semibold text-foreground">
              {item.question}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              {item.answer}
              {item.link ? (
                <Link
                  href={item.link.href}
                  className="font-medium text-accent underline-offset-4 transition hover:underline"
                >
                  {item.link.label}
                </Link>
              ) : null}
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
