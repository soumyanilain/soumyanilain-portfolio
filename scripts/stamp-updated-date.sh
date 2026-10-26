#!/usr/bin/env bash
# Stamps today's date (US Eastern) into the site at deploy time:
#   - the "Page updated" date in the footer of index.html
#   - "dateModified" in the page's structured data
#   - <lastmod> in sitemap.xml
# Netlify runs this on every deploy (see netlify.toml), so the date always
# matches the last time the site was published. Safe to run locally too.
set -euo pipefail
cd "$(dirname "$0")/.."

export TZ="America/New_York" LC_ALL=C
ISO="$(date +%Y-%m-%d)"
HUMAN="$(date '+%b %-d, %Y')"

sed -i -E "s|(<time class=\"page-updated-date\" datetime=\")[^\"]*(\">)[^<]*(</time>)|\1${ISO}\2${HUMAN}\3|g" index.html
sed -i -E "s|(\"dateModified\": \")[^\"]*(\")|\1${ISO}\2|" index.html
sed -i -E "s|<lastmod>[^<]*</lastmod>|<lastmod>${ISO}</lastmod>|" sitemap.xml

if grep -q "datetime=\"${ISO}\">${HUMAN}</time>" index.html; then
  echo "Stamped 'Page updated ${HUMAN}'"
else
  echo "Warning: no page-updated-date markers found in index.html; date not stamped" >&2
fi
