# Portfolio – Domain Glossary

## Site

**hannesduve.com** — Hannes Duve's personal portfolio and freelance service site. A static Next.js export served by Caddy. Bilingual: DE (primary, default) and EN.

**Home page** — a hub that routes visitors to the right subpage. Structure: Hero → Hub Block → Services → Projects → Skills → Contact. The home page routes; the landing pages close.

**Hub Block** — two tiles immediately after the hero, before projects. Each tile links to one subpage: App/web development and AI coaching. Visitors who know what they want get routed immediately; visitors who browse continue scrolling.

**Services Section** — four cards (Web & web apps, Mobile apps, Backend & Cloud, Quality & ops) with one tight sentence each. Tone anchor: "real engineering — not vibe coding." Positions freelance work as the opposite of AI-generated throwaway code. Intentional contrast with the coaching tile on the same page.

Hub tile copy:
- Tile 1 (dev): eyebrow `Freelance` · DE headline `App & Web entwickeln lassen` · EN headline `App & web development` · desc `React Native, Next.js und Backend` / `React Native, Next.js, and backend`
- Tile 2 (coaching): eyebrow `Coaching` · DE headline `Mit KI programmieren lernen` · EN headline `Learn to build with AI` · desc `1:1 Sessions mit Cursor und Claude` / `1:1 sessions with Cursor and Claude`

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

**Freelance Development** — project-based or hourly engagement where Hannes builds web apps (Next.js), mobile apps (React Native/Expo), and backends (Node.js, PostgreSQL, Supabase) for SME Clients.

**Coaching Session** — a 1:1 video call where Hannes guides a Vibe Coding Beginner or Software Engineer through building their project using AI coding tools. Lead tool: Cursor. Underlying AI: Claude. Primary outcome: the client leaves unblocked on their specific project and with a repeatable workflow they can use independently. Price: 60 € for 60 minutes. Entry point: free 30-minute intro call via Calendly (same link as Freelance Development) to align on goals before the first paid session.

## Measurement

**Lead funnel** — how interest flows through the Site: views per page (Home page and each Landing Page, per locale) compared with clicks on the intro-call booking link (Calendly). Used to see which offers attract attention and which pages actually push people toward a call.

**Page view** — one counted view each time a visitor loads a page on the Site (full navigation or reload). Repeat visits and reloads count again; no deduplication into sessions or unique visitors. For the Lead funnel, page views are **server-derived**: inferred from the Site’s web server access log (one line per page request), not from browser beacons.

**Logged page view** — a Page view counted from an access-log entry for a content page path (Home page or Landing Page, per locale). Asset and non-page requests are excluded when building funnel totals.

**Scheduling click** — a visitor activates a link that opens Calendly to book the free 30-minute intro call (same URL for Freelance Development and Coaching Session). Counted separately from whether they complete a booking on Calendly. Recorded together with the page URL and a **placement** label (e.g. hero vs contact on the Home page, cta on a Landing Page). Captured in the browser at click time and sent to first-party **click telemetry** before the visitor leaves for Calendly.

**Click telemetry** — first-party recording of Scheduling clicks only (not page views). Distinct from access-log-based page views.

**Placement** — which booking control on a page produced a Scheduling click. Distinct placements on the same page are counted separately; the Lead funnel can still roll up to page totals.

**App-server analytics** — Lead funnel measurement entirely on the host that serves the Site (no separate database server). Scheduling clicks are kept in a **click store** on that host; Logged page views are derived on demand from the **access log**, not pre-aggregated in the click store.

**Click store** — durable local record of Click telemetry (Scheduling clicks and their page and placement). Used for funnel queries alongside access-log-derived page views.

**Access log** — the web server’s request log for the Site. Source for Logged page views when analyzed on demand.

**Site analytics (legitimate interest)** — App-server analytics processed under GDPR legitimate interest (not consent-based marketing tracking): first-party Click telemetry and access-log page counts to understand the Lead funnel. No analytics cookies; Scheduling clicks may include a **pseudonymous visitor key** (derived from a truncated or hashed IP) only to reduce duplicate or bot noise, not to profile individuals across sites.

**Analytics retention** — Site analytics records (click store and access logs used for the Lead funnel) are kept up to **12 months**, then deleted or rotated so older data is not retained.

**Click telemetry ingestion** — the app server accepts Scheduling click events from the Site over HTTPS. Requests must come from the Site (origin/referrer checks), are rate-limited, and include a **site-issued ingest credential** embedded in the static site scripts so random internet clients cannot post arbitrary events. The credential deters automated noise; it is not end-user authentication.

**Funnel report** — a periodic summary of Logged page views and Scheduling clicks per page (and placement where relevant), produced on demand from the app server via operator tooling (not a public dashboard).
