import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { JsonLd } from "@/app/json-ld";
import { isLocale, siteCopy, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return [{ locale: "de" }, { locale: "en" }];
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: l } = await params;
  if (!isLocale(l)) {
    return { title: "Not found" };
  }
  const locale = l;
  const copy = siteCopy[locale];
  const isEn = locale === "en";

  return {
    title: {
      default: copy.title,
      template: "%s · Hannes Duve",
    },
    description: copy.description,
    metadataBase: new URL("https://hannesduve.com"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "de-DE": "/de",
        "de-AT": "/de",
        "de-CH": "/de",
        en: "/en",
        "x-default": "/de",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `https://hannesduve.com/${locale}`,
      siteName: "Hannes Duve",
      locale: isEn ? "en_US" : "de_DE",
      alternateLocale: isEn
        ? ["de_DE", "de_AT", "de_CH"]
        : ["de_AT", "de_CH", "en_US"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
    },
    category: "technology",
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: l } = await params;
  if (!isLocale(l)) {
    notFound();
  }
  const locale = l as Locale;

  return (
    <>
      <JsonLd locale={locale} />
      <Header locale={locale} />
      {children}
    </>
  );
}
