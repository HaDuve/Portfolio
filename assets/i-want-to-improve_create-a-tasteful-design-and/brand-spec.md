# Brand spec — hannesduve.com (extracted)

## Color tokens (OKLch)

| Token | OKLch | Hex ref |
|-------|-------|---------|
| `--bg` | oklch(97% 0.002 85) | #f5f5f4 |
| `--surface` | oklch(98% 0.002 85) | #fafaf9 |
| `--fg` | oklch(15% 0.01 50) | #0c0a09 |
| `--muted` | oklch(48% 0.015 70) | #57534e |
| `--border` | oklch(87% 0.006 85) | #d6d3d1 |
| `--accent` | oklch(52% 0.20 275) | #4f46e5 |

Dark mode: bg oklch(15% 0.01 50), fg oklch(98% 0.002 85), accent oklch(78% 0.12 275).

## Typography

- **Display:** Instrument Serif, Georgia fallback
- **Body:** system-ui, -apple-system, BlinkMacSystemFont, sans-serif
- **Mono:** ui-monospace, SFMono-Regular, Menlo, monospace

## Layout posture

- Hairline borders (1px `--border`), rounded-xl/2xl cards (12–16px)
- Mono uppercase eyebrows with wide tracking
- Single indigo accent — CTAs, eyebrows, hover states only
- Subtle grain overlay + one radial accent glow in hero (not full-page wash)
- Serif headlines at large scale; sans body at relaxed line-height
