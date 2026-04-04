"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";

const sections = [
  { hash: "hero", labelDe: "Start", labelEn: "Start", id: "hero" as const },
  {
    hash: "leistungen",
    labelDe: "Leistungen",
    labelEn: "Services",
    id: "leistungen" as const,
  },
  {
    hash: "zusammenarbeit",
    labelDe: "Team",
    labelEn: "Team",
    id: "zusammenarbeit" as const,
  },
  { hash: "ablauf", labelDe: "Ablauf", labelEn: "Process", id: "ablauf" as const },
  {
    hash: "projects",
    labelDe: "Projekte",
    labelEn: "Projects",
    id: "projects" as const,
  },
  { hash: "skills", labelDe: "Stack", labelEn: "Stack", id: "skills" as const },
  {
    hash: "contact",
    labelDe: "Kontakt",
    labelEn: "Contact",
    id: "contact" as const,
  },
];

type Props = { locale: Locale };

export function Header({ locale }: Props) {
  const [active, setActive] = useState<string>("hero");
  const base = localePath(locale);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 100;
      let current = "hero";
      for (const { id } of sections) {
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
          className="mr-2 flex flex-1 items-center justify-end gap-3 overflow-x-auto px-1 sm:gap-5"
          aria-label={navLabel}
        >
          {sections.slice(1).map((item) => (
            <a
              key={item.hash}
              href={`${base}#${item.hash}`}
              className={
                active === item.id
                  ? "shrink-0 text-sm font-medium text-foreground transition"
                  : "shrink-0 text-sm text-muted transition hover:text-foreground"
              }
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
