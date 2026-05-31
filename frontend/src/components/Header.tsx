"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SchedulingLink } from "./SchedulingLink";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { mobileNavPanelClass, nextMobileNavOpen } from "@/lib/mobileNav";
import { siteChromeCopy } from "@/lib/siteChromeCopy";
import {
  siteChromeMoreLinks,
  siteChromeNav,
  type SiteChromeNavItem,
} from "@/lib/siteChromeNav";
import type { HomePageSectionId } from "@/lib/homeSections";
import { isLocaleHomePath } from "@/lib/localeHomePath";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";

type Props = {
  locale: Locale;
  schedulingUrl: string;
};

const SCROLL_OFFSET = 100;

function scrollSpySectionIds(nav: SiteChromeNavItem[]): HomePageSectionId[] {
  return ["hero", ...nav.map((item) => item.id)];
}

export function Header({ locale, schedulingUrl }: Props) {
  const pathname = usePathname();
  const isHome = isLocaleHomePath(pathname);
  const [active, setActive] = useState<HomePageSectionId>("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const base = localePath(locale);
  const chrome = siteChromeCopy(locale);
  const nav = siteChromeNav(locale);
  const moreLinks = siteChromeMoreLinks(locale, {
    freelance: chrome.moreFreelanceLabel,
    coaching: chrome.moreCoachingLabel,
  });
  const spyIds = scrollSpySectionIds(nav);

  useEffect(() => {
    if (!isHome) {
      setActive("hero");
      return;
    }

    const onScroll = () => {
      const y = window.scrollY + SCROLL_OFFSET;
      let current: HomePageSectionId = "hero";
      for (const id of spyIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= y) current = id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, spyIds.join(",")]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const navLabel = locale === "en" ? "Main navigation" : "Hauptnavigation";
  const sectionLinkClass = (isActive: boolean) =>
    isActive
      ? "rounded-full px-3.5 py-2 text-sm text-accent transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      : "rounded-full px-3.5 py-2 text-sm text-muted transition hover:bg-accent/10 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-transparent bg-background/75 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 dark:supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-[68rem] items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href={base}
            className="font-display text-lg tracking-tight text-foreground focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label={chrome.logoAriaLabel}
          >
            Hannes Duve
          </Link>

          <nav
            className="hidden items-center gap-0.5 md:flex"
            aria-label={navLabel}
          >
            {nav.map((item) => (
              <a
                key={item.hash}
                href={`${base}#${item.hash}`}
                className={sectionLinkClass(active === item.id)}
                aria-current={active === item.id && isHome ? true : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {isHome ? (
              <SchedulingLink
                href={schedulingUrl}
                placement={chrome.headerCta.placement}
                locale={locale}
                className="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:inline-flex dark:text-stone-950"
              >
                {chrome.headerCta.label}
              </SchedulingLink>
            ) : null}
            <LocaleSwitcher locale={locale} />
            <ThemeToggle />
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-sm text-foreground transition hover:border-accent/40 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={
                menuOpen ? chrome.menuCloseLabel : chrome.menuToggleLabel
              }
              onClick={() => setMenuOpen((open) => nextMobileNavOpen(open))}
            >
              <span aria-hidden>{menuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
      </header>

      <nav
        id="mobile-nav"
        className={`fixed inset-x-0 top-14 z-40 flex max-h-[calc(100dvh-3.5rem)] flex-col gap-1 overflow-y-auto border-t border-border bg-background p-5 transition duration-300 ease-out md:hidden ${mobileNavPanelClass(menuOpen)}`}
        aria-label={chrome.mobileNavLabel}
        aria-hidden={!menuOpen}
        inert={menuOpen ? undefined : true}
      >
        <div className="flex flex-col gap-2 border-b border-border pb-4">
          <SchedulingLink
            href={schedulingUrl}
            placement={chrome.mobileFreelanceCta.placement}
            locale={locale}
            className="inline-flex w-full justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-stone-950"
            onClick={closeMenu}
          >
            {chrome.mobileFreelanceCta.label}
          </SchedulingLink>
          <SchedulingLink
            href={schedulingUrl}
            placement={chrome.mobileCoachingCta.placement}
            locale={locale}
            className="inline-flex w-full justify-center rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:bg-accent/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={closeMenu}
          >
            {chrome.mobileCoachingCta.label}
          </SchedulingLink>
        </div>
        <div className="my-2 h-px bg-border" aria-hidden />
        {nav.map((item) => (
          <a
            key={item.hash}
            href={`${base}#${item.hash}`}
            className="rounded-xl px-4 py-3 text-base text-foreground transition hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={closeMenu}
          >
            {item.label}
          </a>
        ))}
        {moreLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl px-4 py-3 text-base text-muted transition hover:bg-accent/10 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={closeMenu}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
