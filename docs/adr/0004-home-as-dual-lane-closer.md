# ADR-0004: Home page is a dual-lane closer, not a routing hub

## Status
Accepted — supersedes ADR-0002

## Context
ADR-0002 made the home a router: hero → two bare hub tiles → services → projects → skills → contact, on the theory that two distinct audiences (SME Clients, Vibe Coding Beginners) should be bounced to landing pages fast. In practice two empty tiles show no substance, and a solo freelancer converts better by demonstrating real work up front.

A new design iteration (`assets/.../index.html`) replaces the hub with two full **Lanes** that each close on the home itself.

## Decision
The home page both routes and closes. Structure: **Hero → Freelance Lane → Coaching Lane → Skills → Contact.**
- The **Freelance Lane** carries featured projects, the rates strip, and the four service cards.
- The **Coaching Lane** carries the 4-step timeline and an inline FAQ.
- Each lane ends with its own CTA plus a "more →" link to the matching Landing Page.
- **Landing Pages remain** — now purely for SEO depth and deep-link targets, not the only place an offering can convert.

## Consequences
- Home SEO can target a primary head term again (pending keyword research) instead of vague hub positioning.
- More content on the home → keep it scannable and on a performance budget (see `docs/design-system.md`).
- The brand contrast is reframed (see ADR-0005-adjacent voice rules): both lanes share one "durable, quality software" philosophy; the Freelance Lane no longer disparages vibe coding.
