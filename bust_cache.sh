#!/bin/bash
# Cache-bust helper — run this before every deploy.
# Replaces ?v=... in all HTML files with the current timestamp.
# Usage: ./bust_cache.sh
set -e
cd "$(dirname "$0")"
VER=$(date +%Y%m%d%H%M)
echo "Cache-busting to v=$VER"
find . -type f -name "*.html" -exec sed -i -E "s|(assets/css/style\.css)\?v=[0-9]+|\1?v=$VER|g" {} +
find . -type f -name "*.html" -exec sed -i -E "s|(assets/js/app\.js)\?v=[0-9]+|\1?v=$VER|g" {} +
find . -type f -name "*.html" -exec sed -i -E "s|(assets/js/layout\.js)\?v=[0-9]+|\1?v=$VER|g" {} +
count=$(grep -rE "(style\.css|app\.js|layout\.js)\?v=$VER" --include="*.html" . | wc -l)
echo "Updated $count references."
