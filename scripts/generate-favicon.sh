#!/usr/bin/env bash
# Regenerate Next.js favicon assets from assets/HD_Logo.png.
#
# Requires: ImageMagick (magick)
# Usage:
#   ./scripts/generate-favicon.sh
#
# Writes:
#   frontend/src/app/favicon.ico   (16, 32, 48 px)
#   frontend/src/app/icon.png        (32×32)
#   frontend/src/app/apple-icon.png  (180×180)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${ROOT}/assets/HD_Logo.png"
APP="${ROOT}/frontend/src/app"
BG="#1D2125"
# Monogram-only crop (excludes name/tagline); tune if logo file changes
CROP="480x380+464+32"

if ! command -v magick >/dev/null 2>&1; then
  echo "ImageMagick (magick) is required. Install: brew install imagemagick" >&2
  exit 1
fi

if [[ ! -f "$SRC" ]]; then
  echo "Source logo not found: $SRC" >&2
  exit 1
fi

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

magick "$SRC" -crop "$CROP" +repage \
  -background "$BG" -gravity center -extent 480x480 \
  "${tmpdir}/square.png"

magick "${tmpdir}/square.png" -filter Lanczos -resize 32x32 \
  -unsharp 0x0.75+0.75+0.01 "${APP}/icon.png"

magick "${tmpdir}/square.png" -filter Lanczos -resize 180x180 \
  "${APP}/apple-icon.png"

magick "${tmpdir}/square.png" \
  \( -clone 0 -filter Lanczos -resize 16x16 -unsharp 0x1+1+0.02 \) \
  \( -clone 0 -filter Lanczos -resize 32x32 -unsharp 0x0.75+0.75+0.01 \) \
  \( -clone 0 -filter Lanczos -resize 48x48 \) \
  -delete 0 "${APP}/favicon.ico"

echo "Wrote ${APP}/favicon.ico, icon.png, apple-icon.png"
