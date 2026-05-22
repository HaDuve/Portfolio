"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { hubHeaderNavItems } from "@/lib/homeHub";
import { HOME_NAV_SECTIONS } from "@/lib/homeSections";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";

type Props = { locale: Locale };

export function Header({ locale }: Props) {
  const [active, setActive] = useState<string>("hero");
  const base = localePath(locale);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 100;
      let current = "hero";
      for (const { id } of HOME_NAV_SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= y) current = id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLabel = locale === "en" ? "Main navigation" : "Hauptnavigation";
  const serviceLinks = hubHeaderNavItems(locale);
  const serviceLinkClass =
    "shrink-0 text-sm font-medium text-foreground transition hover:text-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
  const sectionLinkClass = (isActive: boolean) =>
    isActive
      ? "shrink-0 text-sm font-normal text-foreground/75 transition focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40"
      : "shrink-0 text-sm font-normal text-muted transition hover:text-foreground/75 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40";

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href={base}
          className="font-mono text-sm font-semibold tracking-tight text-foreground"
        >
          HD
        </Link>
        <nav
          className="mr-2 flex flex-1 items-center justify-end gap-3 overflow-x-auto px-1 sm:gap-4"
          aria-label={navLabel}
        >
          {serviceLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={serviceLinkClass}
              aria-label={item.ariaLabel}
            >
              {item.label}
            </Link>
          ))}
          <span
            className="mx-0.5 hidden h-4 w-px shrink-0 bg-border sm:block"
            aria-hidden
          />
          {HOME_NAV_SECTIONS.slice(1).map((item) => (
            <a
              key={item.hash}
              href={`${base}#${item.hash}`}
              className={sectionLinkClass(active === item.id)}
            >
              {locale === "en" ? item.labelEn : item.labelDe}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <LocaleSwitcher locale={locale} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
