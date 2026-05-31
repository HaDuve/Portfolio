import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";
import profile from "@/data/profile.json";
import {
  appEntwickelnFreelancerFaq,
  appEntwickelnSections,
} from "@/data/appEntwickelnFreelancer";
import { isLocale, type Locale } from "@/lib/i18n";
import { freelanceLandingSections } from "@/lib/serviceLandingSections";
import type { Profile } from "@/types/content";

const BASE = "https://hannesduve.com";
const p = profile as Profile;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: l } = await params;
  if (!isLocale(l) || l !== "en") {
    return {};
  }

  const title = "Freelance app development (web, mobile, backend) · DACH";
  const description =
    "Hire a senior freelance developer for app development: React Native/Expo, Next.js, and backends. Remote for SMEs in Germany, Austria, and Switzerland.";

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    alternates: {
      canonical: "/en/freelance-app-development/",
      languages: {
        "de-DE": "/de/app-entwickeln-freelancer/",
        en: "/en/freelance-app-development/",
        "x-default": "/de/app-entwickeln-freelancer/",
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE}/en/freelance-app-development/`,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function FreelanceAppDevelopmentPage({ params }: Props) {
  const { locale: l } = await params;
  if (!isLocale(l)) {
    notFound();
  }
  if (l !== "en") {
    notFound();
  }

  const locale = l as Locale;
  const copy = appEntwickelnSections.en;
  const faq = appEntwickelnFreelancerFaq.en;

  return (
    <>
      <FaqJsonLd items={faq} locale="en" />
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
          buttonLabel: "Book a 30-minute call",
        }}
      />
    </>
  );
}
