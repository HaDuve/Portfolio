# SEO Content Strategy — hannesduve.com

Content/keyword strategy. Plumbing (locale routing, slugs, sitemap, hreflang, OG) lives in `frontend/SEO-LOCALE-PLAN.md`.

## Intent map (one primary head term per page)

> Home primary keyword locked 2026-05-31 (owner validation via Google Keyword Planner). Landing supporting terms documented in intent map.

| Page | Audience | Primary target (to verify) |
|---|---|---|
| Home `/de`, `/en` | brand + both | **App Entwickler** (DE) · **App Developer** (EN) — validated owner, Google Keyword Planner |
| `/de/app-entwickeln-freelancer` | SME Client | "App entwickeln lassen" · supporting: **app entwickeln kosten** |
| `/en/freelance-app-development` | intl SME | "freelance app development" |
| `/de/programmieren-lernen-mit-ki` | beginner / engineer | "programmieren lernen mit KI" · supporting: **eigene app erstellen** |
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

## Home keyword research (2026-05-31)

Preliminary research for issue #35. **Volumes and difficulty are not verified** — owner must check in Ahrefs, Semrush, Ubersuggest, or similar before locking `homePrimaryKeyword` in `frontend/src/lib/homeSeoMeta.ts`.

### Constraints

- Home is **dual-lane** (Freelance + Coaching) — head term should be broad enough for freelance-primary positioning; coaching stays in meta description and lane copy.
- **No slug change** — home stays `/de/` and `/en/`.
- **Avoid cannibalization** with landing primaries:
  - DE freelance LP: *App entwickeln lassen* / title *App entwickeln & Freelancer beauftragen*
  - EN freelance LP: *freelance app development*
  - DE coaching LP: *programmieren lernen mit KI*
  - EN coaching LP: *vibe coding coach*

### Shortlist (ranked)

| Rank | DE head term | EN head term | Intent | SERP signals | Fit | Cannibalization risk |
| --- | --- | --- | --- | --- | --- | --- |
| **1** | App & Full-Stack Freelancer | freelance app & full-stack developer | Transactional — hire a senior freelancer for app/web/backend | Freelancer profiles ([freelancermap](https://www.freelancermap.com)), marketplaces ([Twine](https://www.twine.net/find/app-developers/de)), rate guides — few strong personal portfolio homepages | Matches dual-lane breadth (app + web + backend); coaching in description | **Low** — differentiated from LP *App entwickeln* phrasing |
| **2** | Freelance App Entwickler | freelance app developer | Same, slightly more DE-native | Same SERP mix; DE queries skew to *App Entwickler* + *Freelancer* compound terms | Strong freelance signal; weaker coaching signal | **Medium** — overlaps EN LP *freelance app development* |
| **3** | React Native Freelancer | React Native freelancer | Transactional — hire mobile specialist | Niche portfolios ([mariusstiedl.com](https://mariusstiedl.com/)), platform role pages ([Fratch](https://fratch.io/de/role/react-native-developer/frankfurt)), job boards | Matches stack strength (Expo/RN) | **Low** with LPs |
| **4** | App Entwickler Freelancer | freelance app developer | Transactional — DE hiring phrasing | Mix of agencies and *App entwickeln lassen* content ([TJ Labs](https://tj-labs.de/blog-posts/wie-viel-kostet-es-eine-app-entwickeln-zu-lassen)) | Readable for DACH SMEs | **High** — collides with freelance LP intent |

### Owner decision (2026-05-31, Google Keyword Planner)

| Term | Page assignment | Rationale |
| --- | --- | --- |
| **App Entwickler** | Home `/de` (title) | Broad professional identity; fits dual-lane home without colliding with LP *App entwickeln lassen* |
| **App Developer** | Home `/en` (title) | EN equivalent of home head term |
| **app entwickeln kosten** | Freelance LP `/de` (supporting) | Pricing/cost intent — matches Offering Ladder + transparent rates; keep out of home title |
| **eigene app erstellen** | Coaching LP `/de` (supporting) | DIY/build intent — aligns with Vibe-Coding coaching, not hire-a-freelancer |

Locked in `frontend/src/lib/homeSeoMeta.ts`:

- DE title: `App Entwickler — Hannes Duve (DACH)`
- EN title: `App Developer — Hannes Duve (DACH & EU)`

### Agent shortlist (superseded for home)
