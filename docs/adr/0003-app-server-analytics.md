# ADR-0003: App-server analytics for the Lead funnel

## Status
Accepted (amended by ADR-0004 redesign — placements are now offering-aware)

## Amendment (dual-lane redesign)
The dual-lane home (ADR-0004) mixes Freelance and Coaching CTAs on one page, so the binary `hero`/`contact` placement can no longer express intent. `SchedulingPlacement` is extended to be **offering-aware**: `header`, `hero-freelance`, `hero-coaching`, `lane-freelance`, `lane-coaching`, `contact-freelance`, `contact-coaching`; Landing Pages keep `cta`. The click payload shape and the enumerated call-site list (`scheduling-click-sites.ts`) and funnel report update accordingly.

## Context
The Site is a static Next.js export on a single app host (Caddy, no database VM). Hannes needs to understand the **Lead funnel**: **Logged page views** and **Scheduling clicks** per Home page and Landing Page (DE/EN), with **placement** on the Home page (hero vs contact).

Alternatives considered:

- **VM2 PostgreSQL** — proper SQL, but a second machine, firewall, backups, and an ingest API for a low-traffic portfolio site.
- **Hosted analytics (Plausible, Umami, etc.)** — fast setup and dashboards, but third-party processing, ongoing cost, and Datenschutz for another processor.
- **Caddy logs only** — page views without new services, but no **Scheduling clicks** (outbound to Calendly).
- **Unified browser beacons for page views and clicks** — one pipeline, but duplicates data already in the **access log** and adds JS on every page load.

Privacy: Datenschutz previously stated no analytics tracking (theme localStorage only). New processing must be documented under **Site analytics (legitimate interest)** with **Analytics retention** and a pseudonymous visitor key (hashed/truncated IP) in the click store.

## Decision
Implement **App-server analytics** on the existing app host:

1. **Scheduling clicks** — **Click telemetry** from the browser at click time (`sendBeacon` or equivalent) to first-party **Click telemetry ingestion** (HTTPS, same origin via Caddy reverse proxy). Persist in a local **click store** (SQLite on a Docker volume). Record page path, locale, **placement** (`hero`, `contact`, `cta`), timestamp, and pseudonymous visitor key (HMAC or hash of client IP with server secret; no raw IP stored).

2. **Page views** — **Server-derived** **Logged page views** from the Caddy **access log**, parsed on demand (not stored in the click store for v1). Filter to content paths (Home page and Landing Pages per locale); exclude assets and obvious noise.

3. **Security** — Origin/referrer allowlist for `hannesduve.com`, per-IP rate limiting, and a **site-issued ingest credential** in static scripts (deters bots; not a secret from a motivated attacker).

4. **Reporting** — **Funnel report** via operator SSH + repo scripts (SQLite queries + log parser), not a public admin UI.

5. **Retention** — **12 months** for click store rows and access logs used for analytics; automated prune/rotate.

6. **Rollout** — Two slices: (1) click telemetry end-to-end including Datenschutz; (2) access-log parser and combined funnel script.

## Consequences
- `docker-compose` gains an analytics ingest service, Caddy access logging, and `/api/events` (or equivalent) routing. Deploy scripts and README must document env vars (e.g. ingest secret, IP hash salt) on the server only.
- Frontend Calendly links need shared instrumentation and placement labels at six call sites (hero, contact, four landing CTAs).
- `legal.json` Datenschutz must describe Site analytics, legitimate interest, pseudonymous key, retention, and access logs — remove the blanket “no tracking” claim for theme-only scope.
- Completing a Calendly booking remains out of scope; only **Scheduling clicks** are counted unless Calendly webhooks are added later.
- A future move to VM2 Postgres or SaaS analytics would replace the click store and possibly page-view source; this ADR should be superseded if that happens.

## References
- Domain terms: `CONTEXT.md` → Measurement
- Prior hosting note: `README.md` (VM1 static stack; VM2 deferred)
