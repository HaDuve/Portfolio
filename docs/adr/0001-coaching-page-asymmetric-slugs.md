# ADR-0001: Asymmetric URL slugs for the coaching landing page

## Status
Accepted

## Context
The coaching landing page targets two different language markets with different search behaviour. The site's existing convention (established with the app/web landing page) is to use independently keyword-optimised slugs per locale rather than direct translations.

For coaching:
- German speakers searching for this topic use broad "learn to code" queries: *"programmieren lernen mit KI"*, *"mit Cursor programmieren"*. The term "vibe coding" exists in German but has low search volume compared to the broader learning-to-code intent.
- English speakers use the specific term *"vibe coding coach"* which has measurable and growing search volume as a standalone phrase.

## Decision
- DE slug: `/de/programmieren-lernen-mit-ki/`
- EN slug: `/en/vibe-coding-coach/`

These are not translations of each other. The DE slug targets broad keyword volume; the EN slug targets the specific vibe coding niche.

## Consequences
- The i18n alternate mapping in `lib/i18n.ts` must explicitly map these two slugs to each other (same pattern as `app-entwickeln-freelancer` ↔ `freelance-app-development`).
- Sitemap, hreflang, and canonical metadata must use the correct per-locale slug.
- A future reader seeing the two slugs should not "fix" them to be consistent — the asymmetry is intentional.
