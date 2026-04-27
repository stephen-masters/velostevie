#!/usr/bin/env bash
# check-gps.sh — report gallery images missing GPS metadata

ASSETS_DIR="$(cd "$(dirname "$0")/.." && pwd)/assets"
missing=0

while IFS= read -r -d '' img; do
  gps=$(exiftool -GPSLatitude "$img" 2>/dev/null)
  if [[ -z "$gps" ]]; then
    echo "NO GPS: ${img#"$ASSETS_DIR/"}"
    ((missing++))
  fi
done < <(find "$ASSETS_DIR/images" -path "*/gallery/*" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -print0 | sort -z)

echo ""
echo "$missing image(s) missing GPS metadata."