import type { Locale } from "@/lib/i18n";
import { credibilityStripItems } from "@/lib/credibilityStrip";

type Props = { locale: Locale };

export function CredibilityStrip({ locale }: Props) {
  const items = credibilityStripItems(locale);

  return (
    <section
      aria-label={locale === "en" ? "Credibility" : "Referenzen"}
      className="border-b border-border bg-card/50"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-4 sm:gap-x-6 sm:px-6">
        {items.map((item, index) => {
          const content = item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-foreground"
            >
              {item.label}
            </a>
          ) : (
            <span>{item.label}</span>
          );

          return (
            <span key={item.id} className="inline-flex items-center gap-x-4 sm:gap-x-6">
              {index > 0 ? (
                <span aria-hidden className="hidden text-border sm:inline">
                  ·
                </span>
              ) : null}
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                {content}
              </span>
            </span>
          );
        })}
      </div>
    </section>
  );
}
