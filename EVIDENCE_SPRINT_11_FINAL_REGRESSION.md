# Sprint 11 Final Regression Summary

**Date:** 2026-09-19  
**Production:** `https://blog.addiscrown.et`  
**Vercel deployment:** `dpl_59TQ86NoaA71Y6FM2EFS5SVRadD5`  
**Git commit:** `4d80850177bdb454fc95d7dccc500d512093b98b`

## Results

| Test group | Result |
|---|---|
| Admin session creation | PASS — HTTP 200 and session cookie issued |
| Authenticated GET matrix | PASS — all tested routes returned HTTP 200 |
| Content opportunity POST | PASS — HTTP 201; API cleanup returned HTTP 200 |
| Knowledge source POST | PASS — HTTP 201; route cleanup returned HTTP 405, then the exact probe row was removed through approved Neon cleanup and verified absent |
| Media asset POST | PASS — HTTP 201; API cleanup returned HTTP 200 |
| Search Console POST | PASS — HTTP 201; API cleanup returned HTTP 200 |
| Reader smoke matrix | PASS — all 20 tested routes returned HTTP 200 |
| Vercel runtime logs | PASS — no error entries for the corrected deployment during the verification window |
| Neon required-relation inventory | PASS — all 18 required relations present on production branch |
| Probe-data verification | PASS — zero matching knowledge-source probe rows remained after cleanup |

The final production probes returned identifiers for all four tested POST operations. Each record was cleaned up immediately. The probe deletion failure exposed an existing API limitation: `app/api/admin/knowledge-sources/route.ts` implements GET and POST but not DELETE. This limitation did not block cleanup because the uniquely identified test row was removed directly after explicit approval.

The before-state was the Sprint 11 finding: Vercel runtime logs reported PostgreSQL `42P01` missing-relation errors because Vercel production used a different Neon endpoint from the verified production branch. The remediation corrected Vercel production `DATABASE_URL` to the Neon production branch endpoint. No database migration was applied because the target branch already contained the required schema.

Sprint 12 and Sprint 13 were not implemented. No Google production credentials or campaigns were used, no legal-app integration was changed, and `www.addiscrown.et` was not modified.
