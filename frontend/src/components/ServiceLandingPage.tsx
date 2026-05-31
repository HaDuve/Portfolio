import Link from "next/link";
import { OfferingLadderStrip } from "@/components/OfferingLadderStrip";
import { SchedulingLink } from "@/components/SchedulingLink";
import type { FaqItem, ScopeExample } from "@/data/appEntwickelnFreelancer";
import { offeringLadder } from "@/lib/offeringLadder";
import { localePath, type Locale } from "@/lib/i18n";
import { COACHING_TOOLS_SECTION_ID } from "@/lib/serviceLandingSections";

export type ServiceLandingBodySection = {
  id: string;
  title: string;
  paragraphs?: readonly string[];
  steps?: readonly string[];
};

type Props = {
  locale: Locale;
  schedulingUrl: string;
  eyebrow: string;
  h1: string;
  lead: string;
  sections: readonly ServiceLandingBodySection[];
  scopeTitle: string;
  scopeExamples: readonly ScopeExample[];
  faq: readonly FaqItem[];
  cta: {
    title: string;
    body: string;
    buttonLabel: string;
  };
  variant: "freelance" | "coaching";
  toolLabels?: readonly string[];
  priceNote?: string;
};

const FAQ_HEADING = "FAQ";

export function ServiceLandingPage({
  locale,
  schedulingUrl,
  eyebrow,
  h1,
  lead,
  sections,
  scopeTitle,
  scopeExamples,
  faq,
  cta,
  variant,
  toolLabels,
  priceNote,
}: Props) {
  const isEn = locale === "en";
  const ladder = variant === "freelance" ? offeringLadder(locale) : null;
  const showCoachingTools =
    variant === "coaching" && toolLabels && toolLabels.length > 0;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
      <Link
        href={localePath(locale)}
        className="font-mono text-sm text-muted underline-offset-4 transition hover:text-foreground hover:underline"
      >
        {isEn ? "← Home" : "← Start"}
      </Link>

      <header className="mt-8 max-w-3xl">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
        <h1 className="font-display mt-3 text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
          {h1}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-stone-600 dark:text-stone-400">
          {lead}
        </p>
      </header>

      {sections.map((section) => (
        <section key={section.id} className="mt-16 scroll-mt-28">
          <h2 className="font-display text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
            {section.title}
          </h2>
          {section.paragraphs?.map((paragraph, index) => (
            <p
              key={`${section.id}-p-${index}`}
              className="mt-4 max-w-3xl text-base leading-relaxed text-stone-600 dark:text-stone-400"
            >
              {paragraph}
            </p>
          ))}
          {section.steps ? (
            <ol className="mt-4 max-w-3xl list-decimal space-y-3 pl-6 text-base leading-relaxed text-stone-600 dark:text-stone-400">
              {section.steps.map((step) => (
                <li key={step} className="min-w-0">
                  {step}
                </li>
              ))}
            </ol>
          ) : null}
          {showCoachingTools && section.id === COACHING_TOOLS_SECTION_ID ? (
            <div
              className="mt-8 flex flex-wrap gap-2"
              aria-label={isEn ? "Tools" : "Werkzeuge"}
            >
              {toolLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted"
                >
                  {label}
                </span>
              ))}
            </div>
          ) : null}
        </section>
      ))}

      {ladder ? (
        <OfferingLadderStrip
          ladder={ladder}
          className="mt-16 flex flex-wrap items-baseline gap-x-4 gap-y-2 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-stone-600 shadow-sm dark:text-stone-400 sm:gap-x-6 sm:px-6"
        />
      ) : null}

      <section className="mt-16 scroll-mt-28" aria-labelledby="scope-heading">
        <h2
          id="scope-heading"
          className="font-display text-2xl font-normal tracking-tight text-foreground sm:text-3xl"
        >
          {scopeTitle}
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {scopeExamples.map((example) => (
            <article
              key={example.id}
              className="min-w-0 rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <h3 className="font-display text-lg font-normal text-foreground">
                {example.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                {example.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {priceNote ? (
        <p className="mt-8 text-base font-medium text-foreground">{priceNote}</p>
      ) : null}

      <section className="mt-16 scroll-mt-28" id="faq" aria-labelledby="faq-heading">
        <h2
          id="faq-heading"
          className="font-display text-2xl font-normal tracking-tight text-foreground sm:text-3xl"
        >
          {FAQ_HEADING}
        </h2>
        <div className="mt-8 grid max-w-2xl gap-4 sm:max-w-none sm:grid-cols-2">
          {faq.map((item) => (
            <article
              key={item.question}
              className="min-w-0 rounded-2xl border border-border bg-card/80 p-5 shadow-sm dark:bg-card"
            >
              <h3 className="text-[0.9375rem] font-semibold text-foreground">
                {item.question}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                {item.answer}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="mt-16 rounded-2xl border border-border bg-card p-8 shadow-sm"
        aria-labelledby="cta-heading"
      >
        <h2 id="cta-heading" className="font-display text-xl text-foreground">
          {cta.title}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-stone-600 dark:text-stone-400">
          {cta.body}
        </p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <SchedulingLink
            href={schedulingUrl}
            placement="cta"
            locale={locale}
            className="inline-flex w-fit rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 dark:text-stone-950"
          >
            {cta.buttonLabel}
          </SchedulingLink>
        </div>
      </section>
    </main>
  );
}
