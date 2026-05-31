import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";
import profile from "@/data/profile.json";
import {
  coachingFaq,
  coachingMeta,
  coachingSections,
} from "@/data/programmierenLernenMitKi";
import { isLocale, type Locale } from "@/lib/i18n";
import {
  COACHING_TOOL_LABELS,
  coachingLandingSections,
} from "@/lib/serviceLandingSections";
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
      <FaqJsonLd items={faq} locale="de" />
      <ServiceLandingPage
        locale={locale}
        schedulingUrl={p.schedulingUrl}
        eyebrow={copy.eyebrow}
        h1={copy.h1}
        lead={copy.lead}
        sections={coachingLandingSections(copy)}
        scopeTitle={copy.scopeTitle}
        scopeExamples={copy.scopeExamples}
        faq={faq}
        variant="coaching"
        toolLabels={COACHING_TOOL_LABELS}
        priceNote={`Preis: ${copy.price}`}
        cta={{
          title: copy.ctaTitle,
          body: copy.ctaBody,
          buttonLabel: "Kostenloses Erstgespräch buchen (30 Min.)",
        }}
      />
    </>
  );
}
