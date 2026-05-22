import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import profile from "@/data/profile.json";
import {
  coachingFaq,
  coachingMeta,
  coachingSections,
} from "@/data/programmierenLernenMitKi";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import type { Profile } from "@/types/content";

const BASE = "https://hannesduve.com";
const p = profile as Profile;

export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ locale: "de" }];
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: l } = await params;
  if (!isLocale(l) || l !== "de") {
    return {};
  }

  const meta = coachingMeta.de;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: "/de/programmieren-lernen-mit-ki/",
      languages: {
        "de-DE": "/de/programmieren-lernen-mit-ki/",
        en: "/en/vibe-coding-coach/",
        "x-default": "/de/programmieren-lernen-mit-ki/",
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${BASE}/de/programmieren-lernen-mit-ki/`,
      locale: "de_DE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function ProgrammierenLernenMitKiPage({ params }: Props) {
  const { locale: l } = await params;
  if (!isLocale(l)) {
    notFound();
  }
  if (l !== "de") {
    notFound();
  }

  const locale = l as Locale;
  const copy = coachingSections.de;
  const faq = coachingFaq.de;

  return (
    <>
      <FaqJsonLd items={faq} />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link
          href={localePath(locale)}
          className="font-mono text-sm text-muted underline-offset-4 transition hover:text-foreground hover:underline"
        >
          ← Start
        </Link>
        <h1 className="font-display mt-8 text-3xl tracking-tight text-foreground sm:text-4xl">
          {copy.h1}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-stone-600 dark:text-stone-400">
          {copy.lead}
        </p>
        <h2 className="font-display mt-14 text-2xl text-foreground">
          {copy.toolsTitle}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-stone-600 dark:text-stone-400">
          {copy.tools}
        </p>
        <h2 className="font-display mt-14 text-2xl text-foreground">
          {copy.fitTitle}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-stone-600 dark:text-stone-400">
          {copy.fit}
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-600 dark:text-stone-400">
          {copy.alsoFit}
        </p>
        <h2 className="font-display mt-14 text-2xl text-foreground">
          {copy.processTitle}
        </h2>
        <ol className="mt-4 list-decimal space-y-3 pl-6 text-base leading-relaxed text-stone-600 dark:text-stone-400">
          {copy.processSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="mt-6 text-base font-medium text-foreground">
          Preis: {copy.price}
        </p>
        <h2 className="font-display mt-14 text-2xl text-foreground" id="faq">
          FAQ
        </h2>
        <div className="mt-6 space-y-8">
          {faq.map((item) => (
            <div key={item.question}>
              <h3 className="text-lg font-medium text-foreground">
                {item.question}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-stone-600 dark:text-stone-400">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
        <section
          className="mt-14 rounded-2xl border border-border bg-card p-8 shadow-sm"
          aria-labelledby="cta-heading"
        >
          <h2 id="cta-heading" className="font-display text-xl text-foreground">
            {copy.ctaTitle}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-stone-600 dark:text-stone-400">
            {copy.ctaBody}
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={p.schedulingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 dark:text-stone-950"
            >
              Kostenloses Erstgespräch buchen (30 Min.)
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
