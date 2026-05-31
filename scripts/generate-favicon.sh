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

# Resize from full source (no intermediate downscale). Unsharp after each resize.
resize_sharp() {
  local size="$1"
  local out="$2"
  local unsharp="$3"
  magick "$SRC" -filter Lanczos -resize "${size}x${size}" \
    -unsharp "$unsharp" "$out"
}

if ! command -v magick >/dev/null 2>&1; then
  echo "ImageMagick (magick) is required. Install: brew install imagemagick" >&2
  exit 1
fi

if [[ ! -f "$SRC" ]]; then
  echo "Source logo not found: $SRC" >&2
  exit 1
fi

resize_sharp 32 "${APP}/icon.png" '0x1.2+1.2+0.03'
resize_sharp 180 "${APP}/apple-icon.png" '0x0.9+0.9+0.02'

magick "$SRC" \
  \( -clone 0 -filter Lanczos -resize 16x16 -unsharp 0x1.5+1.5+0.04 \) \
  \( -clone 0 -filter Lanczos -resize 32x32 -unsharp 0x1.2+1.2+0.03 \) \
  \( -clone 0 -filter Lanczos -resize 48x48 -unsharp 0x1+1+0.025 \) \
  -delete 0 "${APP}/favicon.ico"

echo "Wrote ${APP}/favicon.ico, icon.png, apple-icon.png"
