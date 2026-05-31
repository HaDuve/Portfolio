# ADR-0005: Transparent pricing with a three-tier Offering Ladder

## Status
Accepted

## Context
Previously only the coaching price (60 €/60 min) was public; freelance pricing was undisclosed. The redesign surfaces rates openly. The question is how to show freelance pricing without anchoring too low or over-committing to a fixed scope.

## Decision
Show freelance pricing transparently on the Site:
- A visible **hourly rate** as the unit anchor.
- A three-tier **Offering Ladder** as **"ab/from" baselines** (not fixed quotes) with typical timeframes: **Micro-MVP / Prototyp**, **MVP / launch-ready**, **Laufende Entwicklung / Full Product**.
- **One ladder**, plus a one-line note that app vs web vs backend shifts the estimate — not a per-type price matrix.

## Considered options
- *Fixed package prices* — rejected: software scope varies too much to commit on a marketing page.
- *Per-type 3×3 matrix* — rejected: visually heavy, over-promises precision.
- *No public freelance pricing* — rejected: transparency builds trust and filters budget-mismatch leads for a solo operator.

## Consequences
- Baselines feed `Offer`/`priceSpecification` JSON-LD (see `docs/seo-content.md`).
- The exported `240 €/Tag (4 h)` day rate is dropped — a 4h "Tag" misleads and undercuts senior positioning.
- Baselines: Micro-MVP **ab 1.200 €**, MVP **ab 4.800 €**, Laufende Entwicklung **ab 1.200 €/Monat**; hourly **60 €/h** anchor.
