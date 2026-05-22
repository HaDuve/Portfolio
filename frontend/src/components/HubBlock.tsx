import Link from "next/link";
import { hubTiles } from "@/lib/homeHub";
import type { Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
};

export function HubBlock({ locale }: Props) {
  const tiles = hubTiles(locale);

  return (
    <section aria-label={locale === "en" ? "Explore services" : "Angebote entdecken"}>
      <div className="grid gap-6 sm:grid-cols-2">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="group flex min-h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-accent/40 hover:bg-accent/5"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              {tile.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-2xl font-normal text-foreground group-hover:text-accent">
              {tile.headline}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              {tile.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
