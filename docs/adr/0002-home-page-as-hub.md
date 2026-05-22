# ADR-0002: Home page restructured as a routing hub

## Status
Accepted

## Context
The original home page was a long single-scroll portfolio with a hero, four service cards, a mid-page "App entwickeln" section (linking to the landing page), a Collaboration section, a Process section, projects, skills, and contact.

Adding an AI coaching service creates a second distinct audience — Vibe Coding Beginners — who share no intent with SME clients looking to hire a developer. A single long page cannot efficiently route two different audiences to two different landing pages.

## Decision
Restructure the home page as a hub:

1. **Add a Hub Block** immediately after the hero — two tiles, one per subpage (app/web dev, coaching). First visible content after the intro.
2. **Remove** the mid-page "App entwickeln" section — redundant with the hub tile.
3. **Remove** the Collaboration and Process sections — this detail lives on the landing pages; the home page routes, it doesn't close.
4. **Keep** the Services section (four cards, one sentence each) as supporting context for visitors who scroll. Tone: "real engineering — not vibe coding."

Final page order: Hero → Hub Block → Services → Projects → Skills → Contact.

## Consequences
- The home page's SEO focus shifts from "app entwickeln" keyword targeting toward broader brand/hub positioning. A dedicated SEO pass on home page metadata is needed after the restructure.
- The Collaboration and Process sections are deleted, not archived — their content already exists on the app/web landing page.
- The intentional contrast ("real engineering — not vibe coding" on services, coaching tile on the same page) is load-bearing brand logic. Don't flatten it.
