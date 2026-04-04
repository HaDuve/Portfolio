import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import legalData from "@/data/legal.json";
import { localePath } from "@/lib/i18n";
import type { LegalContent } from "@/types/legal";

const legal = legalData as LegalContent;

const BASE = "https://hannesduve.com";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ locale: "de" }];
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "de") {
    return {};
  }
  return {
    title: "Datenschutz",
    description:
      "Datenschutzerklärung — Verarbeitung personenbezogener Daten auf dieser Website.",
    alternates: {
      canonical: "/de/datenschutz",
      languages: {
        "de-DE": "/de/datenschutz",
        en: "/en/privacy",
        "x-default": "/de/datenschutz",
      },
    },
    openGraph: {
      url: `${BASE}/de/datenschutz`,
      locale: "de_DE",
      type: "website",
    },
  };
}

export default async function DatenschutzPage({ params }: Props) {
  const { locale } = await params;
  if (locale !== "de") {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Link
        href={localePath("de")}
        className="font-mono text-sm text-muted underline-offset-4 transition hover:text-foreground hover:underline"
      >
        ← Start
      </Link>
      <h1 className="font-display mt-8 text-3xl text-foreground">
        Datenschutz
      </h1>
      <div className="mt-8 whitespace-pre-wrap text-sm leading-relaxed text-stone-600 dark:text-stone-400">
        {legal.datenschutzDe}
      </div>
    </main>
  );
}
