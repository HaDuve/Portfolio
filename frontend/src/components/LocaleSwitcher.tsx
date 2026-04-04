"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAlternateLocalePath, type Locale } from "@/lib/i18n";

type Props = { locale: Locale };

export function LocaleSwitcher({ locale }: Props) {
  const pathname = usePathname();
  const hrefDe = getAlternateLocalePath(pathname, "de");
  const hrefEn = getAlternateLocalePath(pathname, "en");

  return (
    <div
      className="flex shrink-0 items-center rounded-full border border-border bg-background p-0.5 text-[11px] font-mono font-semibold tracking-tight"
      role="group"
      aria-label="Website language"
    >
      <Link
        href={hrefDe}
        hrefLang="de"
        aria-current={locale === "de" ? "true" : undefined}
        className={
          locale === "de"
            ? "rounded-full bg-accent px-2.5 py-1 text-white shadow-sm dark:text-stone-950"
            : "rounded-full px-2.5 py-1 text-muted transition hover:text-foreground"
        }
      >
        DE
      </Link>
      <Link
        href={hrefEn}
        hrefLang="en"
        aria-current={locale === "en" ? "true" : undefined}
        className={
          locale === "en"
            ? "rounded-full bg-accent px-2.5 py-1 text-white shadow-sm dark:text-stone-950"
            : "rounded-full px-2.5 py-1 text-muted transition hover:text-foreground"
        }
      >
        EN
      </Link>
    </div>
  );
}
