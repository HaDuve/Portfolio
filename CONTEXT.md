# Portfolio – Domain Glossary

## Site

**hannesduve.com** — Hannes Duve's personal portfolio and freelance service site. A static Next.js export served by Caddy. Bilingual: DE (primary, default) and EN.

**Home page** — the primary page; it both routes and closes. Structure: Hero → Freelance Lane → Coaching Lane → Skills → Contact. Unlike the old hub model (two bare tiles that bounced visitors away), the home now shows real substance per offering and can convert on the page itself. Landing Pages still exist for SEO depth and deep links. (Supersedes the routing-hub model in ADR-0002.)
_Avoid_: Hub, landing page (when referring to the home)

**Lane** — a full home-page section dedicated to one offering, deep enough to convert on its own. Two lanes: the **Freelance Lane** (featured projects + rates strip + services grid) and the **Coaching Lane** (4-step timeline + inline FAQ). Replaces the old **Hub Block** (two link tiles). Each lane ends with its own CTA plus a "more →" link to the matching Landing Page.
_Avoid_: Tile, Hub Block, card row

**Services Section** — four service cards (Web & web apps, Mobile apps, Backend & Cloud, Quality & ops) with one tight sentence each, living **inside the Freelance Lane**. Tone anchor: **production-grade quality, stable, reliable** (German-engineering register). Both offerings share one philosophy — durable, maintainable software — so the Freelance Lane no longer disparages "vibe coding"; it positions freelance work as high-quality, dependable engineering.
_Avoid in copy_: "weggeworfen", "trägt"/"tragen" (rejected wording)

**Credibility strip** — a lightweight trust element drawing only on real proof: shipped products (wikifolio, Budget for Nomads on the App Store), GitHub, Bremen / DACH, senior years. Not fabricated testimonials. A real **Testimonials** section is deferred until genuine quotes exist.

**Vibe Coding** — building software with AI tools (Cursor + Claude). Canonical usage: **"Vibe Coding" as the marketing hook, "Programmieren mit KI" / "Coding with AI" as the plain-language explainer**. Framed positively for the Coaching product: building with AI *and* keeping it maintainable.

## Service pages (Landing Pages)

**Landing Page** — an SEO-optimized page targeting a specific service keyword. Not the portfolio home. Each landing page has a DE and EN variant with independently optimized slugs, metadata, and copy.

Current landing pages:

| Service | DE slug | EN slug |
| --- | --- | --- |
| App & web development (freelancer) | `/de/app-entwickeln-freelancer/` | `/en/freelance-app-development/` |
| AI coding coaching | `/de/programmieren-lernen-mit-ki/` | `/en/vibe-coding-coach/` |

## Audiences

**SME Client** — a small or medium-sized business in the DACH region (DE/AT/CH) looking to hire Hannes as a freelance developer. Primary audience for the app/web landing page.

**Vibe Coding Beginner** — a non-technical or semi-technical person who wants to build software products using AI tools (Claude, Cursor, etc.) with little or no prior programming background. Primary audience for the coaching landing page.

**Software Engineer (AI upskilling)** — a working developer who already codes but wants to use AI agents (Claude Code, Cursor) more effectively in their workflow. Secondary audience for the coaching landing page.

## Products

**Freelance Development** — project-based or hourly engagement where Hannes builds web apps (Next.js), mobile apps (React Native/Expo), and backends (Node.js, PostgreSQL, Supabase) for SME Clients. Priced transparently on the Site: a visible **hourly rate** as the unit anchor, plus an **Offering Ladder** so a visitor can ballpark a whole product.

**Offering Ladder** — three engagement tiers presented as **"ab/from" baselines** (not fixed quotes — scope varies too much) with a typical timeframe, and a one-line note that app vs web vs backend shifts the estimate. One ladder, not a per-type price matrix. Public **hourly rate 60 €/h** is the unit anchor.
- **Micro-MVP / Prototyp** — one core flow, clickable and real. ~1–2 weeks. **ab 1.200 €**
- **MVP / launch-ready** — auth, data, deploy/store-ready product. ~4–8 weeks. **ab 4.800 €**
- **Laufende Entwicklung / Full Product** — ongoing build + support. **ab 1.200 €/Monat** (retainer); 60 €/h applies.

_Day rate:_ the exported `240 €/Tag (4 h)` is **dropped** — a 4-hour "Tag" misleads (an SME reader assumes ~8 h) and undercuts the senior positioning.

**Coaching Session** — a 1:1 video call where Hannes guides a Vibe Coding Beginner or Software Engineer through building their project using AI coding tools. Lead tool: Cursor. Underlying AI: Claude. Primary outcome: the client leaves unblocked on their specific project and with a repeatable workflow they can use independently. Price: 60 € for 60 minutes. Entry point: free 30-minute intro call via Calendly (same link as Freelance Development) to align on goals before the first paid session.

## Measurement

**Lead funnel** — how interest flows through the Site: views per page (Home page and each Landing Page, per locale) compared with clicks on the intro-call booking link (Calendly). Used to see which offers attract attention and which pages actually push people toward a call.

**Page view** — one counted view each time a visitor loads a page on the Site (full navigation or reload). Repeat visits and reloads count again; no deduplication into sessions or unique visitors. For the Lead funnel, page views are **server-derived**: inferred from the Site’s web server access log (one line per page request), not from browser beacons.

**Logged page view** — a Page view counted from an access-log entry for a content page path (Home page or Landing Page, per locale). Asset and non-page requests are excluded when building funnel totals.

**Scheduling click** — a visitor activates a link that opens Calendly to book the free 30-minute intro call (same URL for Freelance Development and Coaching Session). Counted separately from whether they complete a booking on Calendly. Recorded together with the page URL and an offering-aware **placement** label (e.g. `hero-freelance` on the Home page, `cta` on a Landing Page). Captured in the browser at click time and sent to first-party **click telemetry** before the visitor leaves for Calendly.

**Click telemetry** — first-party recording of Scheduling clicks only (not page views). Distinct from access-log-based page views.

**Placement** — which booking control on a page produced a Scheduling click. **Offering-aware**: on the dual-lane home, placements encode both location and offering intent (`header`, `hero-freelance`, `hero-coaching`, `lane-freelance`, `lane-coaching`, `contact-freelance`, `contact-coaching`); Landing Pages use `cta`. Lets the Lead funnel split Freelance vs Coaching intent, and still roll up to page totals. (Extends ADR-0003's click payload shape.)

**App-server analytics** — Lead funnel measurement entirely on the host that serves the Site (no separate database server). Scheduling clicks are kept in a **click store** on that host; Logged page views are derived on demand from the **access log**, not pre-aggregated in the click store.

**Click store** — durable local record of Click telemetry (Scheduling clicks and their page and placement). Used for funnel queries alongside access-log-derived page views.

**Access log** — the web server’s request log for the Site. Source for Logged page views when analyzed on demand.

**Site analytics (legitimate interest)** — App-server analytics processed under GDPR legitimate interest (not consent-based marketing tracking): first-party Click telemetry and access-log page counts to understand the Lead funnel. No analytics cookies; Scheduling clicks may include a **pseudonymous visitor key** (derived from a truncated or hashed IP) only to reduce duplicate or bot noise, not to profile individuals across sites.

**Analytics retention** — Site analytics records (click store and access logs used for the Lead funnel) are kept up to **12 months**, then deleted or rotated so older data is not retained.

**Click telemetry ingestion** — the app server accepts Scheduling click events from the Site over HTTPS. Requests must come from the Site (origin/referrer checks), are rate-limited, and include a **site-issued ingest credential** embedded in the static site scripts so random internet clients cannot post arbitrary events. The credential deters automated noise; it is not end-user authentication.

**Funnel report** — a periodic summary of Logged page views and Scheduling clicks per page (and placement where relevant), produced on demand from the app server via operator tooling (not a public dashboard).
