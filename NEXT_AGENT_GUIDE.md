# Next Agent Guide - Addis Crown Blog Platform

**Generated**: 2026-09-19
**Current Production State**: Sprint 11 remediation complete (Commit 7c432b8) - READY
**Production URL**: https://blog.addiscrown.et
**Repository**: https://github.com/jaja44-hub/blog.git
**Vercel Project**: blog (team_brr8I5k4O1GstQ81Ic0OfaF5)
**Neon Project**: restless-cake-31725040

---

## ADMIN CREDENTIALS (READ CAREFULLY)

### Production Admin Access
- **Admin Login URL**: https://blog.addiscrown.et/admin/login
- **Admin Workspace URL**: https://blog.addiscrown.et/admin
- **Admin API Token**: Stored only in the Vercel `ADMIN_ACCESS_TOKEN` environment variable and local `.env.local` (never commit or paste the value).

### Admin API Authentication Flow
```bash
# 1. Authenticate with admin token (POST to /api/admin/session)
curl -X POST https://blog.addiscrown.et/api/admin/session \
  -H "Content-Type: application/json" \
  -d '{"token":"$ADMIN_ACCESS_TOKEN"}'

# 2. Response includes addis_admin_session cookie for subsequent requests
# 3. Use returned cookie for protected API calls
```

### Important Notes
- The system uses **token-based authentication** (not email/password)
- Email/password in .env.local are NextAuth placeholders (never activated)
- Always use the API token for authentication
- The admin login UI at /admin/login accepts the token for session creation

---

## PROJECT CONTEXT AND ESSENTIAL FILE PATHS

### Core Project Files (READ FIRST)
1. **EXECUTION_LOG.md** - Complete sprint execution history and current status
2. **ENHANCED_ADMIN_ROADMAP.md** - Overall project roadmap and architecture
3. **BACKEND_ROADMAP.md** - Backend development roadmap
4. **EXECUTION_SCHEDULE.md** - Test-driven development schedule
5. **GOOGLE_API_INTEGRATION_RESEARCH.md** - Google API integration strategy
6. **Addis Crown Blog Platform Blueprint.md** - Complete project blueprint

### Evidence Documents (READ BEFORE TROUBLESHOOTING)
1. **EVIDENCE_SPRINT_2_DATABASE_FOUNDATION.md** - Database foundation evidence
2. **EVIDENCE_SPRINT_3_ENHANCED_ADMIN.md** - Admin workspace evidence
3. **EVIDENCE_SPRINT_4_ADVANCED_ANALYTICS.md** - Analytics integration evidence
4. **EVIDENCE_SPRINT_5_KNOWLEDGE_SOURCES.md** - Knowledge sources evidence
5. **EVIDENCE_SPRINT_6_MEDIA_LIBRARY.md** - Media library evidence
6. **EVIDENCE_SPRINT_7_GOOGLE_ADS.md** - Google Ads evidence
7. **EVIDENCE_SPRINT_8_ADSENSE_SEARCH_CONSOLE.md** - AdSense/Search Console evidence
8. **EVIDENCE_SPRINT_9_CONTENT_PLANNING.md** - Content planning evidence
9. **EVIDENCE_SPRINT_11_END_TO_END_TESTING.md** - Sprint 11 end-to-end findings and remediation
10. **EVIDENCE_SPRINT_11_FINAL_REGRESSION.md** - Final production regression results
11. **EVIDENCE_SPRINT_11_SCHEMA_COMPARISON.md** - Neon/Vercel target comparison and schema evidence
12. **SPRINT_11_UPDATE_SUMMARY.md** - Scope, methods, deployment, and handoff summary
13. **KNOWN_ISSUES.md** - Active issues and safe operating contract
14. **EVIDENCE_SPRINT_12_READ_ONLY_INTELLIGENCE.md** - Sprint 12 phase-one contract and regression evidence
15. **SPRINT_13_ROADMAP_PROPOSAL.md** - Research-only Sprint 13 architecture, phased gates, platform findings, and approval checklist

### Issue Investigation Documents (READ FOR CONTEXT)
1. **POST_ENDPOINT_INVESTIGATION_REPORT.md** - POST failure investigation
2. **POST_FIX_VERIFICATION_REPORT.md** - UUID casting fix attempt (failed)
3. **POST_ROOT_CAUSE_ANALYSIS.md** - POST root cause analysis
4. **VERCEL_DEPLOYMENT_RECOVERY.md** - Vercel deployment recovery details

### Current Production Code (Sprint 12 governance line; verify the active deployment before changes)
- **Admin Workspace**: `components/AdminWorkspace.tsx`
- **Database Connection**: `lib/db.ts`
- **Editorial Operations**: `lib/editorial.ts`
- **Content Scoring**: `lib/content-scoring.ts`
- **Admin Authentication**: `lib/admin-auth.ts`
- **Middleware**: `middleware.ts`

---

## CURRENT PRODUCTION STATE

### Successfully Completed Sprints (1-11)
- ✅ **Sprint 1**: Authentication Migration (token-based auth working, NextAuth deferred)
- ✅ **Sprint 2**: Database Connection Foundation (46 tables created, API routes database-backed)
- ✅ **Sprint 3**: Enhanced Admin Workspace (revision history, schema alignment)
- ✅ **Sprint 4**: Advanced Analytics Integration (geographic tracking, regional analytics)
- ✅ **Sprint 5**: Knowledge Sources System (GET/POST/DELETE production paths verified; delete blocks article-linked sources)
- ✅ **Sprint 6**: Media Library Enhancement (GET/POST/DELETE production paths verified)
- ✅ **Sprint 7**: Google Ads Foundation (placeholder data paths verified)
- ✅ **Sprint 8**: AdSense & Search Console (placeholder data paths verified)
- ✅ **Sprint 9**: Content Planning Intelligence (GET/POST production paths verified)

### Failed Sprint (10)
- ❌ **Sprint 10**: Cross-API Intelligence (build errors, force-rolled back)

### Remaining Sprints (11-13)
- ✅ **Sprint 11**: End-to-End Testing and production database-target remediation complete
- ⏳ **Sprint 12**: Production security/performance hardening and deployment audit
- ⏳ **Sprint 13**: Google API Production Integration & Legal App Brand Extension (research phase - REQUIRES USER DISCUSSION BEFORE ANY IMPLEMENTATION)

---

## KNOWN GAPS AND TECHNICAL DEBT

### Priority 1: Knowledge-source deletion safety
**Status**: Implemented in code and pending final deployment verification for this change. The admin UI confirms deletion. The API returns 404 for missing sources and 409 when `source_usage` protects an article-linked source.

### Priority 2: POST Endpoint Failures
**Affected Routes**: Google Ads, AdSense, and remaining integration scaffolds
**Pattern**: Some create paths remain placeholder or require future integration-specific validation. Knowledge sources, media, Search Console, and content opportunities now have successful production POST evidence.
**Hypotheses Tested**:
- ❌ UUID casting issue (disproven - fix attempt failed)
- ❌ Google credentials (disproven - not related)
- 🔍 Likely: Neon serverless foreign key constraint or runtime interaction
**Workaround**: Direct database operations work via SQL
**Recommendation**: Add detailed logging to capture real error messages from Vercel function logs

### Priority 3: NextAuth Integration
**Status**: Deferred from Sprint 1
**Issue**: NextAuth v5 compatibility - "Module 'next-auth' has no exported member 'NextAuthOptions'"
**Current State**: Token-based authentication working in production
**Recommendation**: Re-enable with v5-compatible setup when POST issues resolved

### Priority 4: Sprint 10 Build Errors
**Status**: Failed - force-rolled back
**Issues**:
- Dynamic imports causing type errors
- Missing function references in AdminWorkspace
- TypeScript compilation failures
**Recommendation**: Requires agent with direct platform access to diagnose type/import compatibility

### Priority 5: Google API Credentials
**Status**: Placeholders only
**Tables**: google_api_credentials with placeholder entries
**Requirements**: Real credentials from legal app (no blocking impact)
**Recommendation**: Coordinate with legal team for credential handoff

### Priority 6: Legal App Integration Planning (Sprint 13)
**Status**: Research phase only - NO implementation without user confirmation
**Legal App Production**: https://www.addiscrown.et
**Legal App Vercel**: studio-legacy-updates-ouodmtr72-jafers-projects-761b2f62.vercel.app
**Legal App GitHub**: github/jaja44-hub (branch: main, commit: 35b2ee5)
**Research Requirements**:
- Brand identity integration between blog and legal app
- Unified Google Ads API for both platforms
- Logo and brand asset sharing from Google Cloud project
- Vercel microfrontend integration options
- Revenue generation strategy across both platforms
- **CRITICAL**: All research requires user discussion and confirmation before any implementation
**Recommendation**: Sprint 13 is research-only phase. Do not implement without explicit user approval.

---

## REFACTORED SPRINT 11: END-TO-END TESTING

### Scope Enhancement for Next Agent
**Original Focus**: General end-to-end testing
**Enhanced Focus**: Interactive UI testing with direct browser access

#### Task 11.1: Interactive Admin Workflow Testing
**Requirements**:
- Login to admin panel using provided credentials
- Test all admin workspace features (drafts, research, analytics, etc.)
- Verify GET operations across all admin APIs
- Document UI behavior and any errors
- Test content planning dashboard
- Verify knowledge sources library
- Test media library operations
- Validate Google Ads dashboard (placeholder data)
- Test AdSense/Search Console dashboards (placeholder data)

**Success Criteria**:
- All admin UI sections load without errors
- GET operations return expected data
- UI interactions work as designed
- Error handling displays properly

#### Task 11.2: Reader-Facing Experience Testing
**Requirements**:
- Navigate to production site (https://blog.addiscrown.et)
- Test all reader-facing pages
- Verify navigation and search
- Test article reading experience
- Validate responsive design (mobile, tablet, desktop)
- Test contact forms
- Verify accessibility features

**Success Criteria**:
- All pages load without errors
- Navigation works correctly
- Responsive design validated
- Accessibility features functional

#### Task 11.3: POST Endpoint Deep Investigation
**Requirements**:
- Access Vercel deployment logs directly
- Capture real error messages from failing POST endpoints
- Test POST operations with detailed logging
- Compare successful editorial POST vs failing integration POSTs
- Identify exact database/runtime error
- Propose and test fix with direct platform access

**Success Criteria**:
- Real error messages captured
- Root cause identified
- Fix implemented and tested
- POST operations working

---

## REFACTORED SPRINT 12: PRODUCTION DEPLOYMENT

### Scope Enhancement for Next Agent
**Original Focus**: General production deployment
**Enhanced Focus**: Platform-level verification and finalization

#### Task 12.1: Platform Configuration Verification
**Requirements**:
- Verify Vercel project configuration
- Validate environment variables
- Check Neon database connection
- Verify domain configuration (blog.addiscrown.et)
- Test SSL certificate
- Validate CDN settings

**Success Criteria**:
- All platform configurations verified
- Environment variables correct
- Database connection stable
- Domain configuration correct

#### Task 12.2: Google API Placeholder Preparation
**Requirements**:
- Ensure all Google API placeholder functions are ready for Sprint 13
- Verify database tables for Google API integration are complete
- Document all Google API integration points
- Prepare credential storage mechanism for Sprint 13

**Success Criteria**:
- All placeholder functions documented
- Database tables verified
- Integration points mapped
- Ready for Sprint 13 research phase

**Note**: Actual Google API integration moved to Sprint 13 (research phase)

#### Task 12.3: Final Security and Performance Audit
**Requirements**:
- Security audit of all admin routes
- Performance testing under load
- Backup and recovery testing
- Monitor configuration
- Analytics verification
- SEO validation

**Success Criteria**:
- Security audit passed
- Performance meets requirements
- Backup/recovery tested
- Monitoring operational
- Analytics verified
- SEO validated

---

## PLATFORM CONNECTION DETAILS

### GitHub
- **Repository**: https://github.com/jaja44-hub/blog.git
- **Branch**: main
- **Current Commit**: 7c432b8 (Sprint 11 remediation)
- **Access**: User will authenticate agent via browser when needed

### Vercel
- **Project**: blog
- **Team**: jafer's projects
- **Team ID**: team_brr8I5k4O1GstQ81Ic0OfaF5
- **Project ID**: prj_Ox7kkCUN94CSR14j0I5D3Wjc8cWo
- **Latest Ready Deployment**: dpl_J62sQV5xPM32eMDSXphCyVhjN2Bg (Sprint 11 remediation)
- **Access**: User will authenticate agent via browser when needed

### Neon PostgreSQL
- **Project ID**: restless-cake-31725040
- **Branch ID**: br-orange-rain-awpyfg18
- **Branch Name**: production
- **Database**: neondb
- **Connection**: Configured in .env.local (git-ignored)
- **Access**: User will authenticate agent via browser when needed

---

## AGENT CAPABILITY RECOMMENDATIONS

### Manus AI
**Strengths**:
- Direct browser interaction for third-party platform authentication
- Can execute actions on Vercel, GitHub, Neon via browser
- Full UI testing capabilities
- Interactive workflow testing

**Limitations**:
- Free plan rate limits
- Requires billing information for extended use

### Devin CLI (Current Agent)
**Strengths**:
- Free plan available without billing
- Good for code analysis and local development
- MCP integrations for some platforms

**Limitations**:
- Limited direct third-party platform access
- Browser authentication capabilities restricted
- Cannot directly access Vercel/GitHub/Neon dashboards

### Recommendation
**For Sprints 11-12**: Use Manus AI or similar agent with full browser capabilities for:
- Direct Vercel log access
- Interactive UI testing
- Platform authentication
- Real-time debugging

**For Future Development**: Consider upgrading Devin CLI or using Manus AI for:
- Continuous platform access
- Real-time debugging
- Direct dashboard interaction

### Alternative Free Agentic Services
1. **Cursor AI**: Good for code analysis, limited platform access
2. **GitHub Copilot Workspace**: Good for code, limited platform access
3. **Codeium**: Free code assistance, limited platform access
4. **Replit AI**: Good for development, some platform access

**Note**: Most free services have limited direct third-party platform access. Full platform interaction typically requires paid tiers or browser-capable agents like Manus AI.

---

## SPRINT 13: GOOGLE API PRODUCTION INTEGRATION & LEGAL APP BRAND EXTENSION

### Critical Note: RESEARCH-ONLY SPRINT
**This sprint is for RESEARCH and DISCUSSION ONLY. NO implementation actions without explicit user confirmation.**

### Sprint 13 Scope
**Duration**: Week 7 (5 days)
**Status**: Not Started
**Type**: Research and Planning Phase

### Legal App Production Details
- **Production URL**: https://www.addiscrown.et
- **Vercel Deployment**: studio-legacy-updates-ouodmtr72-jafers-projects-761b2f62.vercel.app
- **GitHub Repository**: github/jaja44-hub
- **Branch**: main
- **Commit**: 35b2ee5
- **Last Update**: "fix: Restore original authentic Amharic legal rhetoric in preview sect…"

### Research Objectives (NEEDS USER CONFIRMATION)

#### 13.1 Brand Identity & Domain Integration Strategy
- How to maintain separate backend/database while sharing brand identity
- Domain ownership flags signaling both services owned by addiscrown.et
- Brand consistency across both platforms while maintaining independence
- User perception of connected vs. separate services

#### 13.2 Google Ads API Unified Integration
- Feasibility of using one Google Ads API for multiple domains
- How to share Google Ads campaign data across blog and legal app
- Targeting strategy: legal app users as potential blog revenue source
- Legal app UI integration for Google Ads display (when app is updated)
- Revenue sharing models between blog and legal app
- API credential management for shared access

#### 13.3 Logo & Brand Asset Sharing
- How to reference legal app's Google Cloud registered logo from blog site
- Avoiding duplicate logo setup for blog site
- Logo discoverability and theme handling through shared assets
- Brand asset management across separate backends

#### 13.4 Vercel Microfrontend Integration
- Vercel microfrontend capabilities and limitations
- How to connect blog site with legal app via microfrontends
- Common administration benefits of microfrontend architecture
- Security implications of microfrontend integration
- Performance impact of microfrontend architecture

#### 13.5 Google Cloud Project Integration
- How to connect blog site to existing Google Cloud project
- Authentication and authorization for shared Google Cloud resources
- Service account management for both platforms
- API access control and security boundaries

#### 13.6 Revenue Generation Strategy
- Google Ads revenue sharing between blog and legal app
- Ad placement strategy for legal app UI (when updated)
- User targeting across both platforms
- Performance tracking and attribution

### Sprint 13 Execution Approach
1. **Phase 1**: Research each objective above with feasibility analysis
2. **Phase 2**: Present findings to user for discussion and confirmation
3. **Phase 3**: Only after user approval, proceed with confirmed implementation path
4. **Critical Constraint**: NO implementation actions without explicit user confirmation

### Sprint 13 Success Criteria
- All research objectives completed with documented findings
- Feasibility analysis presented to user
- User confirmation received on preferred implementation path
- Implementation approach documented before any code changes
- Security implications reviewed and approved

### Agent Instructions for Sprint 13
- **DO NOT** implement any code changes during Sprint 13
- **DO** conduct thorough research on each objective
- **DO** present findings to user for discussion
- **DO** wait for explicit user confirmation before any implementation
- **DO** document all research findings and proposed approaches
- **DO NOT** proceed to implementation without user approval

---

## GETTING STARTED PROMPT FOR NEXT AGENT

When you engage the next agent, provide this prompt:

```
I need you to complete Sprints 11 and 12 for the Addis Crown Blog Platform project.

REPOSITORY: https://github.com/jaja44-hub/blog.git
PRODUCTION URL: https://blog.addiscrown.et
ADMIN AUTHENTICATION: Use token-based authentication (see NEXT_AGENT_GUIDE.md for details)

ESSENTIAL CONTEXT FILES TO READ FIRST:
1. EXECUTION_LOG.md - Complete execution history (13 sprints total)
2. NEXT_AGENT_GUIDE.md - Comprehensive guide with credentials and platform details
3. ENHANCED_ADMIN_ROADMAP.md - Project roadmap
4. EVIDENCE_SPRINT_9_CONTENT_PLANNING.md - Latest evidence
5. POST_ENDPOINT_INVESTIGATION_REPORT.md - Known POST issues

SPRINT 11: End-to-End Testing
- Interactive admin workflow testing with browser access
- Reader-facing experience testing
- POST endpoint deep investigation with Vercel log access

SPRINT 12: Production Deployment
- Platform configuration verification
- Google API placeholder preparation (NOT actual integration)
- Final security and performance audit

IMPORTANT: DO NOT TOUCH SPRINT 13
- Sprint 13 is for research and discussion with user only
- NO implementation actions in Sprint 13 without explicit user confirmation
- Sprint 13 involves legal app integration planning (www.addiscrown.et)
- Sprint 13 requires deep research and user approval before any implementation

I will authenticate you via browser for Vercel, GitHub, and Neon access when needed.

Platform Details:
- Vercel: team_brr8I5k4O1GstQ81Ic0OfaF5, project prj_Ox7kkCUN94CSR14j0I5D3Wjc8cWo
- Neon: project restless-cake-31725040, branch br-orange-rain-awpyfg18
- Current Production: Commit 7b25a22 (Sprint 9) - READY
- Legal App Production: https://www.addiscrown.et (for Sprint 13 research only)

Please read the context files first, then begin with Sprint 11.
```

---

## IMPORTANT NOTES FOR NEXT AGENT

1. **DO NOT** attempt Sprint 10 again until POST issues are resolved
2. **DO NOT** modify NextAuth integration until POST issues are resolved
3. **DO NOT** deploy without verifying Vercel deployment status first
4. **DO** read all evidence documents before troubleshooting
5. **DO** use provided admin credentials for interactive testing
6. **DO** request browser authentication for platform access
7. **DO** prioritize POST endpoint investigation (Priority 1 technical debt)
8. **DO** test against latest READY deployment, not just production domain
9. **DO** document all findings in evidence documents
10. **DO** coordinate with user for Google credential handoff

---

## PROJECT SUMMARY

**Project**: Addis Crown Blog Platform
**Objective**: Branded, reader-oriented publication platform covering law, rights, contracts, markets, technology, AI, policy, global affairs, Ethiopia, and East Africa
**Architecture**: Next.js/Vercel + Neon PostgreSQL + Google APIs
**Status**: 9/13 sprints complete (69%), Sprint 10 failed and rolled back
**Current Production**: Stable at Sprint 9 (commit 7b25a22)
**Known Issues**: POST endpoint failures (affects 5 sprints), NextAuth deferred, Sprint 10 build errors
**Next Steps**: Sprint 11 (End-to-End Testing) with agent capable of direct platform access
**Final Sprint**: Sprint 13 (Google API Production Integration & Legal App Brand Extension) - RESEARCH ONLY, requires user discussion before any implementation

**Contact**: User will provide browser authentication for platform access when needed.

---

**Generated by**: Devin CLI
**Date**: 2026-09-18
**Purpose**: Comprehensive guide for next agent to complete Sprints 11-12 with full context and platform access capabilities
