import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import legalData from "@/data/legal.json";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import type { LegalContent } from "@/types/legal";

const legal = legalData as LegalContent;

const BASE = "https://hannesduve.com";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: l } = await params;
  if (!isLocale(l)) {
    return {};
  }
  const locale = l;
  const isEn = locale === "en";
  return {
    title: isEn ? "Imprint" : "Impressum",
    description: isEn
      ? "Legal notice and provider identification (Impressum)."
      : "Impressum — Angaben gemäß § 5 TMG / § 55 RStV.",
    alternates: {
      canonical: `/${locale}/impressum/`,
      languages: {
        "de-DE": "/de/impressum/",
        en: "/en/impressum/",
        "x-default": "/de/impressum/",
      },
    },
    openGraph: {
      url: `${BASE}/${locale}/impressum/`,
      locale: isEn ? "en_US" : "de_DE",
      type: "website",
    },
  };
}

export default async function ImpressumPage({ params }: Props) {
  const { locale: l } = await params;
  if (!isLocale(l)) {
    notFound();
  }
  const locale = l as Locale;
  const isEn = locale === "en";
  const body = isEn ? legal.impressumEn : legal.impressumDe;

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Link
        href={localePath(locale)}
        className="font-mono text-sm text-muted underline-offset-4 transition hover:text-foreground hover:underline"
      >
        {isEn ? "← Home" : "← Start"}
      </Link>
      <h1 className="font-display mt-8 text-3xl text-foreground">
        {isEn ? "Imprint" : "Impressum"}
      </h1>
      <div className="mt-8 whitespace-pre-wrap text-sm leading-relaxed text-stone-600 dark:text-stone-400">
        {body}
      </div>
    </main>
  );
}
