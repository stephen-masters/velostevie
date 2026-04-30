#!/usr/bin/env bash
#
# check-gps.sh
#
# Scans every image under assets/images/*/gallery/ and reports those that lack
# GPS metadata (GPSLatitude). Useful for identifying photos that will not appear
# as map markers in the gpxmap shortcode.
#
# Prerequisites: exiftool must be installed (`brew install exiftool`).
#
# Run:  ./scripts/check-gps.sh

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