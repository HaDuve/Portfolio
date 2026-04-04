"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const sections = [
  { href: "#hero", label: "Home", id: "hero" as const },
  { href: "#projects", label: "Projects", id: "projects" as const },
  { href: "#skills", label: "Skills", id: "skills" as const },
  { href: "#contact", label: "Contact", id: "contact" as const },
];

export function Header() {
  const [active, setActive] = useState<string>("hero");

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

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="#top"
          className="font-mono text-sm font-semibold tracking-tight text-foreground"
        >
          HD
        </Link>
        <nav className="flex flex-1 items-center justify-end gap-3 overflow-x-auto px-1 sm:gap-8" aria-label="Primary">
          {sections.slice(1).map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={
                active === item.id
                  ? "text-sm font-medium text-foreground transition"
                  : "text-sm text-muted transition hover:text-foreground"
              }
            >
              {item.label}
            </a>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
