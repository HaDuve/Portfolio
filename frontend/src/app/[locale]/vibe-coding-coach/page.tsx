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
  return [{ locale: "en" }];
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: l } = await params;
  if (!isLocale(l) || l !== "en") {
    return {};
  }

  const meta = coachingMeta.en;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: "/en/vibe-coding-coach/",
      languages: {
        "de-DE": "/de/programmieren-lernen-mit-ki/",
        en: "/en/vibe-coding-coach/",
        "x-default": "/de/programmieren-lernen-mit-ki/",
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${BASE}/en/vibe-coding-coach/`,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function VibeCodingCoachPage({ params }: Props) {
  const { locale: l } = await params;
  if (!isLocale(l)) {
    notFound();
  }
  if (l !== "en") {
    notFound();
  }

  const locale = l as Locale;
  const copy = coachingSections.en;
  const faq = coachingFaq.en;

  return (
    <>
      <FaqJsonLd items={faq} locale="en" />
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
        priceNote={`Price: ${copy.price}`}
        cta={{
          title: copy.ctaTitle,
          body: copy.ctaBody,
          buttonLabel: "Book a free 30-minute intro call",
        }}
      />
    </>
  );
}
