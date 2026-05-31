# SEO Content Strategy — hannesduve.com

Content/keyword strategy. Plumbing (locale routing, slugs, sitemap, hreflang, OG) lives in `frontend/SEO-LOCALE-PLAN.md`.

## Intent map (one primary head term per page)

> ⚠️ **Verify search volume in a real keyword tool before locking slugs/titles.** Do not assume German volumes. Home keyword choice is deferred until research is done.

| Page | Audience | Primary target (to verify) |
|---|---|---|
| Home `/de`, `/en` | brand + both | TBD after keyword research (candidates: "Freelance App Entwickler", "React Native Freelancer") |
| `/de/app-entwickeln-freelancer` | SME Client | "App entwickeln lassen" |
| `/en/freelance-app-development` | intl SME | "freelance app development" |
| `/de/programmieren-lernen-mit-ki` | beginner / engineer | "programmieren lernen mit KI" |
| `/en/vibe-coding-coach` | intl | "vibe coding coach" |

## Structured data (JSON-LD) — invest

Existing: `json-ld.tsx`, `FaqJsonLd`. Add:
- **Person** — Hannes Duve (jobTitle per locale).
- **Service** — one per offering (Freelance Development, Coaching).
- **Offer / priceSpecification** — from the **Offering Ladder** (Micro-MVP, MVP, Laufende Entwicklung) once numbers land; hourly rate + coaching 60 €/60 min. Eligible for rich results.
- **FAQPage** — from expanded landing-page FAQs.

## Long-form content — invest

- Landing pages carry real long-form: process, FAQ, scope examples. Current exported landing files are thin; expand with genuine copy (no filler — see `voice.md`).
- Home stays scannable (dual-lane); depth lives on landing pages.

## Open

- **Preliminary keyword research** (agent: search + SERP signals) → propose home primary keyword; owner validates in a keyword tool before slugs/titles lock. Until then, home ships brand-first.
