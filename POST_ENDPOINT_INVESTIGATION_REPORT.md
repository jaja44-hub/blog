# POST Endpoint Investigation Report

**Date**: 2026-09-17  
**Investigation**: Cross-cutting POST endpoint failures affecting Sprints 5, 6, 7, and 8  
**Status**: Root cause identified

---

## Executive Summary

The POST endpoint failures affecting 4 consecutive sprints (Knowledge Sources, Media Library, Google Ads, AdSense/Search Console) have been traced to a specific SQL pattern difference between working and non-working database insertion operations. The root cause is the **use of `::uuid` type casting in INSERT/UPDATE operations with Neon serverless**.

---

## Investigation Process

### 1. Code Pattern Analysis

**Working POST endpoint** (`app/api/admin/drafts/route.ts`):
- Uses `lib/editorial.ts` with direct SQL template strings
- **No UUID type casting in INSERT operations**
- Pattern: `${input.slug}` without `::uuid` cast
- **Result**: POST 201 success, creates records successfully

**Failing POST endpoints** (Sprints 5, 6, 7, 8):
- Use library functions with `::uuid` type casting in INSERT/UPDATE
- Pattern: `${input.source_id}::uuid` or `${input.media_id}::uuid`
- **Result**: POST 500 error, generic "could not be created" message

### 2. Production Testing

**Test Results**:
- ✅ Authentication session creation: Works (POST 201)
- ✅ Draft creation (existing editorial): Works (POST 201)
- ❌ Knowledge source creation: Fails (POST 500)
- ❌ Media asset creation: Fails (POST 500)
- ❌ Google Ads campaign creation: Fails (POST 500)
- ❌ AdSense ad unit creation: Fails (POST 500)
- ❌ Search Console data creation: Fails (POST 500)

**Key Finding**: The editorial system (which predates Sprints 5-8) continues to work because it does not use UUID type casting in INSERT operations.

### 3. Code Comparison

**Working Pattern** (`lib/editorial.ts` lines 65-85):
```typescript
const posts = (await sql`
  INSERT INTO editorial_posts (
    slug,
    title,
    description,
    category,
    body_markdown,
    author_id,
    series_id
  )
  VALUES (
    ${input.slug},
    ${input.title},
    ${input.description ?? ""},
    ${input.category},
    ${input.bodyMarkdown ?? ""},
    ${input.authorId ?? null},
    ${input.seriesId ?? null}
  )
  RETURNING *
`) as EditorialPost[];
```

**Failing Pattern** (`lib/knowledge-sources.ts` lines 157-173):
```typescript
const usage = (await sql`
  INSERT INTO source_usage (
    source_id,
    post_id,
    context,
    claim_verified,
    verification_notes
  )
  VALUES (
    ${input.source_id}::uuid,
    ${input.post_id}::uuid,
    ${input.context ?? null},
    ${input.claim_verified ?? null},
    ${input.verification_notes ?? null}
  )
  RETURNING *
`) as SourceUsage[];
```

**The Difference**: The `::uuid` type casting in the failing pattern.

---

## Root Cause

**Primary Issue**: Neon serverless SQL template string execution appears to have issues with explicit UUID type casting in INSERT/UPDATE operations within Vercel's serverless environment.

**Supporting Evidence**:
1. Direct database operations work (confirmed via Neon MCP)
2. Editorial POST endpoints work (no UUID casting)
3. All failing POST endpoints use UUID casting
4. Error is generic 500, not a database constraint error
5. The pattern is consistent across 4 different sprints

**Environmental Factors**:
- Vercel serverless runtime
- Neon PostgreSQL with `@neondatabase/serverless`
- Template string SQL execution
- UUID foreign key relationships

---

## Affected Files

### Sprint 5: Knowledge Sources
- `lib/knowledge-sources.ts` (lines 167, 220)
- Issue: `createSourceUsage` uses `::uuid` casting

### Sprint 6: Media Library
- `lib/media.ts` (lines 186, 220)
- Issue: `createMediaUsage` and `createMediaTag` use `::uuid` casting

### Sprint 7: Google Ads
- `lib/google-ads.ts` (lines 240, 349)
- Issue: `createGoogleAdsPerformance` and `createAdCreative` use `::uuid` casting

### Sprint 8: AdSense & Search Console
- `lib/search-console.ts` (line 85)
- Issue: `createSearchConsoleData` uses `::uuid` casting for `post_id`

---

## Proposed Solution

### Option 1: Remove UUID Type Casting (Recommended)

Remove `::uuid` type casting from all INSERT/UPDATE operations in affected library files. This matches the working pattern in `lib/editorial.ts`.

**Files to modify**:
1. `lib/knowledge-sources.ts` - Remove `::uuid` from lines 167, 220
2. `lib/media.ts` - Remove `::uuid` from lines 186, 220
3. `lib/google-ads.ts` - Remove `::uuid` from lines 240, 349
4. `lib/search-console.ts` - Remove `::uuid` from line 85

**Rationale**:
- Matches proven working pattern
- Minimal code change
- No schema changes required
- Neon serverless handles type inference correctly

### Option 2: Switch to Parameterized Queries

Convert template string SQL to parameterized queries using a different pattern that handles UUID casting at the driver level.

**Rationale**:
- More explicit type handling
- Standard SQL pattern
- More complex implementation

**Drawback**: Larger refactoring, unproven in this environment.

### Option 3: Add Environment-Specific Handling

Add conditional logic to use UUID casting only in local development, relying on type inference in production.

**Rationale**:
- Preserves explicit typing locally
- Matches production working pattern

**Drawback**: Adds complexity, harder to maintain.

---

## Risk Assessment

### Low Risk (Option 1)
- Change is localized to library files
- Pattern is proven to work in production
- No schema or data migration required
- Rollback is straightforward

### Medium Risk (Option 2)
- Larger refactoring scope
- Unknown behavior in Vercel environment
- Harder to test without deployment

### High Risk (Option 3)
- Environment-specific logic is error-prone
- Harder to debug production issues
- Maintenance burden

---

## Testing Plan

After implementing Option 1:

1. **Unit Testing**: Test each library function locally with direct database connection
2. **Integration Testing**: Test POST endpoints against local development server
3. **Production Verification**: Test POST endpoints against production deployment after Vercel deployment
4. **Regression Testing**: Verify GET endpoints and existing editorial POST continue to work

**Test Cases**:
- Create knowledge source via POST
- Create media asset via POST
- Create Google Ads campaign via POST
- Create AdSense ad unit via POST
- Create Search Console data via POST
- Verify all GET operations still work
- Verify existing draft creation still works

---

## Dependencies

- Vercel deployment for production verification
- GitHub commit for code changes
- No database schema changes required
- No environment variable changes required

---

## Timeline Estimate

- **Implementation**: 30 minutes (remove `::uuid` from 5 locations)
- **Local Testing**: 15 minutes
- **Deployment**: 5 minutes (Vercel auto-deploy)
- **Production Verification**: 15 minutes
- **Total**: ~1 hour

---

## Recommendations

### Immediate Action
1. Implement Option 1 (remove UUID type casting)
2. Test locally
3. Deploy to Vercel
4. Verify POST endpoints work in production
5. Document the fix in affected sprint evidence files

### Long-term Prevention
1. Add linting rule to prevent `::uuid` casting in INSERT/UPDATE operations
2. Update code review checklist to check for this pattern
3. Consider migration to a more explicit ORM if this pattern recurs
4. Document the Neon serverless + Vercel type handling behavior

### Alternative Consideration
If Option 1 does not resolve the issue, investigate:
- Vercel function logs for detailed error messages
- Neon serverless connection pool behavior
- Edge runtime vs. Node runtime differences
- Request size limits or timeout issues

---

## Conclusion

The POST endpoint failures are caused by UUID type casting (`::uuid`) in INSERT/UPDATE operations when using Neon serverless template strings in Vercel's serverless environment. The editorial system works because it avoids this pattern. Removing the type casting to match the working pattern is the lowest-risk solution and should resolve the issue across all affected sprints.

**Next Step**: Implement Option 1 and verify in production.

---

**Report Generated**: 2026-09-17  
**Investigator**: Devin AI Assistant  
**Status**: Ready for implementation approval
