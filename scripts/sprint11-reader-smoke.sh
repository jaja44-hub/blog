#!/usr/bin/env bash
set -u
BASE='https://blog.addiscrown.et'
routes=(/ /latest /new-this-week /popular /contact /search /about /corrections /accessibility /privacy-policy /terms /feed.xml /robots.txt /sitemap.xml /posts/public-policy-institutions /posts/media-and-information /posts/markets-and-investment /category/legal-rights /category/technology-ai /category/economics-and-finance)
for path in "${routes[@]}"; do
  out=$(curl -sS -L -o /dev/null -w '%{http_code} %{url_effective} %{content_type}' "$BASE$path")
  printf '%-42s %s\n' "$path" "$out"
done
