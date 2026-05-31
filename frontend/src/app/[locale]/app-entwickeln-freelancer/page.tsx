import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";
import profile from "@/data/profile.json";
import {
  appEntwickelnFreelancerFaq,
  appEntwickelnFreelancerMeta,
  appEntwickelnSections,
} from "@/data/appEntwickelnFreelancer";
import { isLocale, type Locale } from "@/lib/i18n";
import {
  freelanceLandingSections,
} from "@/lib/serviceLandingSections";
import type { Profile } from "@/types/content";

const BASE = "https://hannesduve.com";
const p = profile as Profile;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: l } = await params;
  if (!isLocale(l)) {
    return {};
  }
  const locale = l;
  const isEn = locale === "en";
  const meta = isEn
    ? appEntwickelnFreelancerMeta.en
    : appEntwickelnFreelancerMeta.de;

  const canonical = isEn
    ? "/en/freelance-app-development/"
    : "/de/app-entwickeln-freelancer/";

  return {
    title: meta.title,
    description: meta.description,
    robots: isEn
      ? {
          index: false,
          follow: true,
          googleBot: { index: false, follow: true },
        }
      : undefined,
    alternates: {
      canonical,
      languages: {
        "de-DE": "/de/app-entwickeln-freelancer/",
        en: "/en/freelance-app-development/",
        "x-default": "/de/app-entwickeln-freelancer/",
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${BASE}${canonical}`,
      locale: isEn ? "en_US" : "de_DE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function AppEntwickelnFreelancerPage({ params }: Props) {
  const { locale: l } = await params;
  if (!isLocale(l)) {
    notFound();
  }
  const locale = l as Locale;
  const isEn = locale === "en";
  const copy = isEn ? appEntwickelnSections.en : appEntwickelnSections.de;
  const faq = isEn
    ? appEntwickelnFreelancerFaq.en
    : appEntwickelnFreelancerFaq.de;

  return (
    <>
      <FaqJsonLd items={faq} locale={locale} />
      <ServiceLandingPage
        locale={locale}
        schedulingUrl={p.schedulingUrl}
        eyebrow={copy.eyebrow}
        h1={copy.h1}
        lead={copy.lead}
        sections={freelanceLandingSections(copy)}
        scopeTitle={copy.scopeTitle}
        scopeExamples={copy.scopeExamples}
        faq={faq}
        variant="freelance"
        cta={{
          title: copy.ctaTitle,
          body: copy.ctaBody,
          buttonLabel: isEn ? "Book a 30-minute call" : "Gespräch buchen (30 Min.)",
        }}
      />
    </>
  );
}
