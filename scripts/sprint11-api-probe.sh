#!/usr/bin/env bash
set -u
BASE='https://blog.addiscrown.et'
TOKEN="${ADMIN_ACCESS_TOKEN:?Set ADMIN_ACCESS_TOKEN before running this probe}"
COOKIE=$(mktemp)
trap 'rm -f "$COOKIE"' EXIT
printf 'SESSION\n'
curl -sS -i -c "$COOKIE" -H 'Content-Type: application/json' -d "{\"token\":\"$TOKEN\"}" "$BASE/api/admin/session" | sed -n '1,12p'
for route in drafts research analytics content-opportunities content-performance knowledge-sources media seo-recommendations search-console; do
  printf '\nGET /api/admin/%s\n' "$route"
  curl -sS -w '\nHTTP %{http_code}\n' -b "$COOKIE" "$BASE/api/admin/$route" | head -c 1200
  printf '\n'
done
# Controlled creation probes. Any successful record is deleted immediately when an id is returned.
post_probe() {
  local route="$1" payload="$2"
  printf '\nPOST /api/admin/%s\n' "$route"
  local response status body id
  response=$(curl -sS -w '\n__HTTP__%{http_code}' -b "$COOKIE" -H 'Content-Type: application/json' -d "$payload" "$BASE/api/admin/$route")
  status=$(printf '%s' "$response" | sed -n 's/^__HTTP__//p')
  body=$(printf '%s' "$response" | sed '/^__HTTP__/d')
  printf '%s\nHTTP %s\n' "$body" "$status"
  id=$(printf '%s' "$body" | sed -n 's/.*"\(id\|source_id\|media_id\)"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\2/p' | head -1)
  if [ -n "$id" ] && [ "$status" -ge 200 ] && [ "$status" -lt 300 ]; then
    printf 'CLEANUP DELETE id=%s\n' "$id"
    local cleanup_url="$BASE/api/admin/$route?id=$id"
    if [ "$route" = 'knowledge-sources' ]; then
      cleanup_url="$BASE/api/admin/knowledge-sources/$id"
    fi
    curl -sS -w '\nHTTP %{http_code}\n' -X DELETE -b "$COOKIE" "$cleanup_url" | head -c 500
  fi
}
post_probe 'content-opportunities' '{"topic_suggestion":"Sprint 11 probe cleanup","demand_score":1,"competition_score":9,"monetization_potential":1,"estimated_effort":99}'
post_probe 'knowledge-sources' '{"title":"Sprint 11 probe cleanup","url":"https://example.com/sprint-11-probe-cleanup","source_type":"news"}'
post_probe 'media' '{"storage_key":"sprint-11-probe-cleanup","original_filename":"probe.txt","mime_type":"text/plain"}'
post_probe 'search-console' '{"date":"2026-09-19","impressions":1,"clicks":0,"ctr":0,"avg_position":99,"queries":[]}'
