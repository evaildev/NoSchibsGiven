#!/usr/bin/env bash
# build.sh — Bygger alle nettleser-pakker til dist/
# Bruk: ./build.sh

set -e

SRC="src"
DIST="dist"
VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "2.0")

rm -rf "$DIST"
mkdir -p "$DIST"

build_chromium() {
  local NAME=$1
  local OUT="$DIST/build-chromium"
  rm -rf "$OUT" && mkdir -p "$OUT/icons"

  cp "$SRC/content.js"              "$OUT/"
  cp "$SRC/rules.json"              "$OUT/"
  cp "$SRC/manifest.chromium.json"  "$OUT/manifest.json"
  cp "$SRC/icons/"*                 "$OUT/icons/"

  ZIP="$DIST/schibsted-blocker-chromium-v${VERSION}.zip"
  (cd "$DIST" && zip -r "../$ZIP" "build-chromium/" > /dev/null)
  mv "$ZIP" "$DIST/"
  rm -rf "$OUT"
  echo "✅  Chromium (Chrome, Edge, Opera, Brave, Vivaldi): $ZIP"
}

build_firefox() {
  local OUT="$DIST/build-firefox"
  rm -rf "$OUT" && mkdir -p "$OUT/icons"

  cp "$SRC/content.js"             "$OUT/"
  cp "$SRC/rules.json"             "$OUT/"
  cp "$SRC/manifest.firefox.json"  "$OUT/manifest.json"
  cp "$SRC/icons/"*                "$OUT/icons/"

  ZIP="$DIST/schibsted-blocker-firefox-v${VERSION}.zip"
  (cd "$OUT" && zip -r "../../$ZIP" . > /dev/null)
  rm -rf "$OUT"
  echo "✅  Firefox: $ZIP"
}

build_chromium
build_firefox

echo ""
echo "Safari: Kjør følgende etter bygg:"
echo "  xcrun safari-web-extension-converter dist/build-chromium --project-location safari-src --app-name SchibstedBlocker"
echo ""
echo "Ferdig! Filer i $DIST/"
