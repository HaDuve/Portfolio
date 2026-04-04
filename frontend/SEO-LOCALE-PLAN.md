# Plan: `/de` + `/en` + legal URLs (Lighthouse SEO parity)

## Goal

- **Lighthouse SEO** passes on **both** `hannesduve.com/de` and `hannesduve.com/en` (title, meta description, canonical, crawlable links, valid `robots`, hreflang).
- **Impressum** and **Datenschutz** as **real, indexable URLs** (not only a slide-over).

## Architecture

- **Locale segment:** `app/[locale]/layout.tsx` with `locale` in `('de' | 'en')`, `generateStaticParams` → `[{ locale: 'de' }, { locale: 'en' }]`.
- **Home:** `app/[locale]/page.tsx` — move current `PortfolioHome` here; pass `locale` instead of only client `showEnglish`.
- **Root `/`:** redirect to `/de` (HTTP redirect in **Caddy** preferred for SEO; optional `next.config` `redirects` if compatible with `output: 'export'` — verify in [Next static export redirects](https://nextjs.org/docs/app/guides/static-exports)).
- **Replace EN toggle** with **locale switcher**: links to `/de/...` ↔ `/en/...` (same path suffix), no `localStorage` as source of truth for SEO-critical language.

## Metadata (per locale)

- **`generateMetadata`** in `app/[locale]/layout.tsx` (or per-route): distinct `title`, `description`, `openGraph`/`twitter` (`locale` / `alternateLocale`), `alternates.canonical` = `https://hannesduve.com/{locale}`.
- **`alternates.languages`** (`hreflang`): `de` → `de-DE` (and optionally `de-AT`, `de-CH` if you keep DACH targeting), `en` → `en`, **`x-default` → `/de`** (confirmed).
- **`metadataBase`** unchanged; OG images: either one shared asset with neutral copy or **locale-specific** `opengraph-image` under `app/[locale]/` if you want distinct share text.

## `lang` attribute

- Set **`<html lang={locale}>`** in `app/[locale]/layout.tsx` (server). Remove or narrow **`HtmlLangSync`** if redundant (avoid mismatch with SSR).

## JSON-LD

- Emit **locale-appropriate** strings (`inLanguage`, descriptions, `jobTitle`) from `locale` in a small server component, or two graph nodes with correct language — avoid German-only copy when URL is `/en`.

## Sitemap & robots

- **[`app/sitemap.ts`](src/app/sitemap.ts):** entries for `/de`, `/en`, `/de/impressum`, `/de/datenschutz`, `/en/impressum`, `/en/privacy`.
- **[`app/robots.ts`](src/app/robots.ts):** keep single sitemap URL; no change unless you add staging rules later.

## Legal routes

- **`app/[locale]/impressum/page.tsx`** — both locales (DE/EN copy from `legal.json`).
- **`app/[locale]/datenschutz/page.tsx`** — **`generateStaticParams` → `{ locale: 'de' }` only** so `/en/datenschutz` is not a dead or duplicate URL.
- **`app/[locale]/privacy/page.tsx`** — **`generateStaticParams` → `{ locale: 'en' }` only** → **`/en/privacy`** (confirmed).
- Content from [`legal.json`](src/data/legal.json); simple layout (back link to `/{locale}`, site header optional).
- **Footer + header:** link to these routes; **remove** exclusive reliance on [`LegalSlideIn`](src/components/LegalSlideIn.tsx) or repurpose it as “quick view” that duplicates the same URLs (optional).

## Internal linking

- Nav/footer: all targets use `/${locale}/#...` or path-based sections so crawlers see **same-locale** links.
- Cross-link **`/de` ↔ `/en`** in header (locale switcher) — satisfies crawlable alternate discovery together with hreflang.

## Manifest

- [`manifest.ts`](src/app/manifest.ts): either **neutral** `name`/`lang` or generate per locale if you split manifests (lower priority than pages).

## Verification

- Build `out/` and spot-check: `de/index.html` vs `en/index.html` contain correct `<title>`, meta description, `link rel="canonical"`, `hreflang`.
- Lighthouse SEO on `/de` and `/en` in Chrome DevTools.

## Resolved

- **`x-default`:** `/de`.
- **English Datenschutz URL:** `/en/privacy`.

## Implementation checklist

1. `app/[locale]/layout.tsx` + `page.tsx`; `generateStaticParams`; `generateMetadata` + `alternates` + `x-default` → `/de`.
2. Root `/` → `/de` (Caddy + verify Next static export options).
3. Move home UI under `[locale]`; locale switcher links; retire `localStorage` language as primary.
4. `JsonLd` + optional `opengraph-image` per locale.
5. `app/[locale]/impressum`, `app/[locale]/datenschutz` (`de`), `app/[locale]/privacy` (`en`); footer/header links; optional thin `LegalSlideIn`.
6. Update `sitemap.ts` for all URLs above.
7. Build + Lighthouse SEO on `/de` and `/en`.
