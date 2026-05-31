# Design System — hannesduve.com

Web-design + interaction source of truth. Pair with `voice.md` (copy) and `CONTEXT.md` (terms). Tokens originate from the exported design (`assets/.../css/tokens.css`, `brand-spec.md`) and match the palette already shipped in `frontend/src/app/globals.css`.

## Tokens — OKLch (canonical)

Adopt the OKLch token set; map into Tailwind v4 `@theme`. Same palette as today, OKLch-native (wider gamut, more precise).

| Token | Light | Dark |
|---|---|---|
| `--bg` | `oklch(97.5% 0.003 85)` | `oklch(16% 0.012 50)` |
| `--surface` | `oklch(99% 0.002 85)` | `oklch(20% 0.014 50)` |
| `--fg` | `oklch(18% 0.012 50)` | `oklch(96% 0.004 85)` |
| `--muted` | `oklch(46% 0.014 70)` | `oklch(66% 0.012 70)` |
| `--border` | `oklch(88% 0.006 85)` | `oklch(28% 0.012 50)` |
| `--accent` | `oklch(52% 0.20 275)` (indigo) | `oklch(72% 0.14 275)` |

- **Single accent** (indigo) only: CTAs, eyebrows, hover/focus. No second brand color.
- Radius: `0.875rem` / `1.125rem` (rounded-xl/2xl). Hairline `1px --border`.
- Dark mode: class/`data-theme` based, with a toggle (already in app).

## Typography

- **Display:** Instrument Serif — load via **`next/font`** (NOT the export's render-blocking Google Fonts `@import`). Large serif headlines.
- **Body:** system-ui stack. **Mono:** ui-monospace — used for uppercase, wide-tracked eyebrows.
- Fluid type/spacing via `clamp()`; relaxed body line-height.

## Surfaces & layout

- Max width ~`68rem`; consistent gutters. Cards: surface + hairline border + rounded-xl/2xl.
- Hero: subtle grain overlay + **one** radial accent glow (not a full-page wash). No warm/cream/peach washes.

## Motion (decision: keep-for-now under guardrails)

- **Dropped:** `HeroFan`; **Embla carousel** and GSAP parallax project cards (`ParallaxMedia`/`ParallaxLetter`/`ProjectMediaCarousel`) — home featured work is static images in the Freelance Lane.
- **Keep:** Lenis smooth-scroll (gated on `prefers-reduced-motion`, raf via Motion `frame.update` for `whileInView`), scroll reveals, `IntroSequence` — **on a budget**.
- **IntroSequence (production):** currently **cut** via `ACTIVE_MOTION_CUTS.introSequence` in `frontend/src/lib/motionBudget.ts` after Lighthouse miss; implementation remains for re-enable when budget allows.
- **Guardrails (non-negotiable):**
  - `prefers-reduced-motion` honored everywhere.
  - **Performance budget:** mobile Lighthouse Performance ≥ 90; healthy LCP/INP. Measure after porting.
  - **IntroSequence:** once per session, < ~800ms, must not block the LCP element.
  - **Documented cut order if budget breaks:** IntroSequence → Lenis.
  - **2026-05-31 local Lighthouse (mobile, simulated throttling, static export via `serve out`):** Performance **83** with full motion; LCP **4.7s** (IntroSequence overlay); INP **47ms**. Applied cut **IntroSequence** → **91** Performance, LCP **3.5s**. Lenis cut not required. Re-measure on production host after deploy.

## Stack

Next.js 16 (static export), React 19, Tailwind v4 (`@theme`), Lenis, GSAP, Motion. Bilingual `[locale]` routing retained.

## Responsive contract

Validate with no horizontal overflow at: 360×800, 390×844, 430×932, 600×960, 820×1180, 1024×768, 1366×768, 1440×900, 1920×1080.
