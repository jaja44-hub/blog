# Addis Crown Admin System Execution Schedule

**Version**: 1.0  
**Date**: 2026-09-16  
**Approach**: Test-Driven Development (TDD)  
**Cloud Strategy**: Option A - Reuse Existing Google Cloud Project  
**Integration**: Full-stack development with Google API intelligence  
**Timeline**: 12 weeks  
**Status**: Ready for Execution

---

## Execution Philosophy

**Test-Driven Development Approach**:
- Every feature requires test definition before implementation
- Evidence collection before marking tasks complete
- No assumptions - verify each component before proceeding
- Progressive development with continuous validation
- **REMOTE TESTING ONLY** - All tests against https://blog.addiscrown.et
- **NO LOCAL DEV SERVER** - Deploy to Vercel immediately for testing
- **Production as Test Environment** - Use genuine environment for verification

**Parallel Development Strategy**:
- Admin system development and Google API integration proceed in parallel
- Database schema and UI development synchronized
- Backend and frontend developed in coordinated sprints
- Testing integrated throughout development cycle
- **Vercel as Deployment Target** - Push to GitHub, deploy, test production

**Placeholder Credentials Strategy**:
- Google Cloud credentials left as placeholders until provided
- Environment variables configured with empty values
- Code scaffolding complete without real credentials
- Integration testing deferred until credentials available
- **Remote Verification** - Test scaffolding against production

---

## Sprint Schedule

### Sprint 1: Authentication Migration (Week 1, Days 1-3)

**Objective**: Transition from token-based to NextAuth authentication while preserving existing admin functionality

#### Task 1.1: Restore Original AdminLoginForm Component
**File**: `components/AdminLoginForm.tsx`  
**Test**: Verify token-based authentication still works  
**Evidence**: Successful login with existing admin token  
**Dependencies**: None  
**Estimated Time**: 2 hours

#### Task 1.2: Integrate NextAuth with Existing Admin-Auth
**File**: `lib/admin-auth.ts` (modify), `lib/auth.ts` (modify)
**Test**: Verify both authentication systems work during transition
**Evidence**: Dual authentication capability confirmed
**Test Environment**: https://blog.addiscrown.et/admin/login (production only)
**Dependencies**: Task 1.1
**Estimated Time**: 4 hours

#### Task 1.3: Update AdminLoginForm to Use NextAuth Credentials
**File**: `components/AdminLoginForm.tsx` (modify)  
**Test**: NextAuth login works with database user (admin@addiscrown.et)  
**Evidence**: Successful login with email/password  
**Dependencies**: Task 1.2  
**Estimated Time**: 3 hours

#### Task 1.4: Remove /admin/dashboard Route, Keep /admin
**Files**: `app/admin/dashboard/page.tsx` (delete), `app/admin/page.tsx` (modify)  
**Test**: Verify /admin redirects correctly to main dashboard  
**Evidence**: Redirect functionality preserved  
**Dependencies**: Task 1.3  
**Estimated Time**: 1 hour

#### Task 1.5: Update Middleware for Role-Based Access
**File**: `middleware.ts` (modify)  
**Test**: Verify role hierarchy enforcement (8 role levels)  
**Evidence**: Access control by role functional  
**Dependencies**: Task 1.4  
**Estimated Time**: 3 hours

**Sprint 1 Success Criteria**:
- ✅ Existing admin features preserved
- ✅ NextAuth authentication functional
- ✅ Role-based access control working
- ✅ Addis Crown design system maintained
- ✅ No disruption to existing admin workflow

---

### Sprint 2: Database Connection Foundation (Week 1, Days 4-5)

**Objective**: Migrate existing API routes to use new database schema and add Google API tables

#### Task 2.1: Migrate Existing API Routes to Use New Database
**Files**: `app/api/admin/drafts/route.ts`, `app/api/admin/research/route.ts` (modify)  
**Test**: Verify draft management works with database  
**Evidence**: Draft CRUD operations functional with Neon database  
**Dependencies**: Sprint 1 complete  
**Estimated Time**: 6 hours

#### Task 2.2: Add 22 New Database Tables (Google API Schema)
**File**: Database migration script  
**Test**: Verify all tables created successfully  
**Evidence**: Database schema validation passed (46 total tables)  
**Dependencies**: Task 2.1  
**Estimated Time**: 4 hours

#### Task 2.3: Create Credential Placeholder Tables
**File**: Database migration script  
**Test**: Verify table structure matches API requirements  
**Evidence**: Schema validation passed for credential tables  
**Dependencies**: Task 2.2  
**Estimated Time**: 2 hours

**Sprint 2 Success Criteria**:
- ✅ Existing API routes database-backed
- ✅ All 46 database tables created and validated
- ✅ Credential placeholder tables ready for Google API integration
- ✅ Database connection stable and performant

---

### Sprint 3: Enhanced Admin Workspace (Week 2, Days 1-3)

**Objective**: Integrate existing AdminWorkspace with new database and add database persistence

#### Task 3.1: Integrate AdminWorkspace with New Database
**File**: `components/AdminWorkspace.tsx` (modify)  
**Test**: Verify all existing features still work with database  
**Evidence**: Draft management, research briefs, import/export functional  
**Dependencies**: Sprint 2 complete  
**Estimated Time**: 5 hours

#### Task 3.2: Add Database Persistence to Research Briefs
**Files**: `app/api/admin/research/route.ts` (modify), database functions  
**Test**: Verify research briefs save to database  
**Evidence**: Research brief CRUD operations functional  
**Dependencies**: Task 3.1  
**Estimated Time**: 4 hours

#### Task 3.3: Create Database-Backed Draft Management
**Files**: `app/api/admin/drafts/route.ts` (modify), database functions  
**Test**: Verify drafts persist correctly in database  
**Evidence**: Draft operations database-backed and validated  
**Dependencies**: Task 3.2  
**Estimated Time**: 4 hours

**Sprint 3 Success Criteria**:
- ✅ AdminWorkspace fully database-integrated
- ✅ Research briefs persistent and manageable
- ✅ Draft management database-backed
- ✅ All existing features preserved and enhanced

---

### Sprint 4: Geographic Analytics Foundation (Week 2, Days 4-5)

**Objective**: Implement geographic tracking and regional analytics infrastructure

#### Task 4.1: Implement IP-Based Geographic Tracking
**Files**: `lib/geographic-tracker.ts` (new), database functions  
**Test**: Verify geographic data captured correctly  
**Evidence**: Location data accuracy confirmed (country/region level)  
**Dependencies**: Sprint 3 complete  
**Estimated Time**: 6 hours

#### Task 4.2: Create Regional Analytics Tables and Functions
**Files**: Database migration, `lib/analytics.ts` (new)  
**Test**: Verify regional data aggregation works  
**Evidence**: Regional analytics calculations correct  
**Dependencies**: Task 4.1  
**Estimated Time**: 4 hours

#### Task 4.3: Build Geographic Dashboard Components
**Files**: `app/admin/analytics/geographic/page.tsx` (new)  
**Test**: Verify geographic dashboard displays data  
**Evidence**: Regional performance visualization functional  
**Dependencies**: Task 4.2  
**Estimated Time**: 5 hours

**Sprint 4 Success Criteria**:
- ✅ Geographic tracking operational
- ✅ Regional analytics data captured and processed
- ✅ Geographic dashboard functional
- ✅ Privacy-conscious data collection

---

### Sprint 5: Knowledge Sources System (Week 3, Days 1-3)

**Objective**: Build reusable knowledge sources library with credibility scoring

#### Task 5.1: Create Knowledge Sources Database Tables
**File**: Database migration  
**Test**: Verify source management schema works  
**Evidence**: Source CRUD operations functional  
**Dependencies**: Sprint 4 complete  
**Estimated Time**: 3 hours

#### Task 5.2: Build Source Library UI Components
**Files**: `app/admin/sources/page.tsx` (new), `components/SourceLibrary.tsx` (new)  
**Test**: Verify source library interface works  
**Evidence**: Source management UI functional  
**Dependencies**: Task 5.1  
**Estimated Time**: 6 hours

#### Task 5.3: Implement Source Credibility Scoring
**Files**: `lib/source-scoring.ts` (new)  
**Test**: Verify credibility scoring algorithm works  
**Evidence**: Score calculations accurate  
**Dependencies**: Task 5.2  
**Estimated Time**: 4 hours

**Sprint 5 Success Criteria**:
- ✅ Knowledge sources database operational
- ✅ Source library UI functional
- ✅ Credibility scoring system working
- ✅ Source management integrated with content creation

---

### Sprint 6: Media Library Enhancement (Week 3, Days 4-5)

**Objective**: Enhance media assets with performance tracking and smart tagging

#### Task 6.1: Enhance Media Assets with Performance Tracking
**Files**: Database migration, `lib/media-analytics.ts` (new)  
**Test**: Verify media usage tracking works  
**Evidence**: Media performance data captured correctly  
**Dependencies**: Sprint 5 complete  
**Estimated Time**: 4 hours

#### Task 6.2: Implement Smart Tagging System
**Files**: `lib/media-tagging.ts` (new)  
**Test**: Verify automatic tagging functions correctly  
**Evidence**: Tag assignment accuracy confirmed  
**Dependencies**: Task 6.1  
**Estimated Time**: 5 hours

#### Task 6.3: Build Media Management Dashboard
**Files**: `app/admin/media/page.tsx` (new)  
**Test**: Verify media library interface works  
**Evidence**: Media management operations functional  
**Dependencies**: Task 6.2  
**Estimated Time**: 5 hours

**Sprint 6 Success Criteria**:
- ✅ Media performance tracking operational
- ✅ Smart tagging system functional
- ✅ Media management dashboard working
- ✅ Media library integrated with content creation

---

### Sprint 7: Google Ads Foundation (Week 4, Days 1-3)

**Objective**: Set up Google Ads integration scaffolding with placeholder credentials

#### Task 7.1: Install google-ads-kit and Set Up Authentication Scaffolding
**Files**: `package.json` (modify), `lib/google-ads.ts` (new)  
**Test**: Verify SDK installation and configuration works  
**Evidence**: SDK connectivity test passed (with placeholder)  
**Dependencies**: Sprint 6 complete  
**Estimated Time**: 3 hours

#### Task 7.2: Create Google Ads Service with Placeholder Credentials
**File**: `lib/google-ads.ts` (new)  
**Test**: Verify service structure is correct  
**Evidence**: Service architecture validated  
**Dependencies**: Task 7.1  
**Estimated Time**: 4 hours

#### Task 7.3: Build Campaign Management UI Scaffolding
**Files**: `app/admin/google-ads/campaigns/page.tsx` (new)  
**Test**: Verify UI components render correctly  
**Evidence**: Campaign interface structure confirmed  
**Dependencies**: Task 7.2  
**Estimated Time**: 5 hours

**Sprint 7 Success Criteria**:
- ✅ google-ads-kit installed and configured
- ✅ Google Ads service scaffolding complete
- ✅ Campaign management UI structure ready
- ✅ Placeholder credentials in place (awaiting real credentials)

---

### Sprint 8: AdSense & Search Console Foundation (Week 4, Days 4-5)

**Objective**: Set up AdSense and Search Console integration scaffolding

#### Task 8.1: Set Up AdSense Service Scaffolding
**Files**: `lib/adsense.ts` (new)  
**Test**: Verify AdSense service structure works  
**Evidence**: Service architecture validated  
**Dependencies**: Sprint 7 complete  
**Estimated Time**: 3 hours

#### Task 8.2: Set Up Search Console Service Scaffolding
**Files**: `lib/search-console.ts` (new)  
**Test**: Verify Search Console service structure works  
**Evidence**: Service architecture validated  
**Dependencies**: Task 8.1  
**Estimated Time**: 3 hours

#### Task 8.3: Create Unified Authentication Service
**File**: `lib/google-auth.ts` (new)  
**Test**: Verify unified OAuth management works  
**Evidence**: Token refresh mechanism functional  
**Dependencies**: Task 8.2  
**Estimated Time**: 4 hours

**Sprint 8 Success Criteria**:
- ✅ AdSense service scaffolding complete
- ✅ Search Console service scaffolding complete
- ✅ Unified authentication service operational
- ✅ All Google API services ready for credential injection

---

### Sprint 9: Content Planning Intelligence (Week 5, Days 1-3)

**Objective**: Implement content opportunity scoring and planning intelligence

#### Task 9.1: Implement Content Opportunity Scoring Algorithm
**Files**: `lib/content-scoring.ts` (new)  
**Test**: Verify scoring logic produces valid results  
**Evidence**: Scoring accuracy validated  
**Dependencies**: Sprint 8 complete  
**Estimated Time**: 6 hours

#### Task 9.2: Build Content Planning Dashboard
**Files**: `app/admin/planning/page.tsx` (new)  
**Test**: Verify planning interface works correctly  
**Evidence**: Content planning UI functional  
**Dependencies**: Task 9.1  
**Estimated Time**: 5 hours

#### Task 9.3: Integrate Search Console Data for Recommendations
**Files**: `lib/seo-intelligence.ts` (new)  
**Test**: Verify SEO-driven suggestions work  
**Evidence**: SEO recommendations accurate  
**Dependencies**: Task 9.2  
**Estimated Time**: 4 hours

**Sprint 9 Success Criteria**:
- ✅ Content opportunity scoring functional
- ✅ Planning dashboard operational
- ✅ SEO-driven recommendations working
- ✅ Content planning intelligence integrated

---

### Sprint 10: Cross-API Intelligence (Week 5, Days 4-5)

**Objective**: Implement cross-API data correlation and unified intelligence

#### Task 10.1: Implement Data Correlation Algorithms
**Files**: `lib/data-correlation.ts` (new)  
**Test**: Verify cross-API data merging works  
**Evidence**: Data correlation accuracy confirmed  
**Dependencies**: Sprint 9 complete  
**Estimated Time**: 6 hours

#### Task 10.2: Build Unified Intelligence Dashboard
**Files**: `app/admin/intelligence/page.tsx` (new)  
**Test**: Verify dashboard displays integrated data  
**Evidence**: Cross-API visualization functional  
**Dependencies**: Task 10.1  
**Estimated Time**: 5 hours

#### Task 10.3: Create Automated Recommendation System
**Files**: `lib/recommendations.ts` (new)  
**Test**: Verify recommendation logic works  
**Evidence**: Automated suggestions validated  
**Dependencies**: Task 10.2  
**Estimated Time**: 4 hours

**Sprint 10 Success Criteria**:
- ✅ Cross-API data correlation functional
- ✅ Unified intelligence dashboard operational
- ✅ Automated recommendation system working
- ✅ Intelligence loops between APIs established

---

### Sprint 11: End-to-End Testing (Week 6, Days 1-3)

**Objective**: Comprehensive testing of complete admin system

#### Task 11.1: Perform Full Admin Workflow Testing
**Test**: Verify complete admin user journey works  
**Evidence**: End-to-end workflow validated  
**Dependencies**: Sprint 10 complete  
**Estimated Time**: 8 hours

#### Task 11.2: Test Database Integrity and Performance
**Test**: Verify database operations under load  
**Evidence**: Performance benchmarks met  
**Dependencies**: Task 11.1  
**Estimated Time**: 4 hours

#### Task 11.3: Security and Permission Testing
**Test**: Verify role-based access control works  
**Evidence**: Security validation passed  
**Dependencies**: Task 11.2  
**Estimated Time**: 4 hours

**Sprint 11 Success Criteria**:
- ✅ Complete admin workflow validated
- ✅ Database performance meets requirements
- ✅ Security controls verified
- ✅ All features tested and documented

---

### Sprint 12: Production Deployment (Week 6, Days 4-5)

**Objective**: Deploy to production and verify functionality

#### Task 12.1: Configure Production Environment Variables
**Files**: Vercel environment variables, `.env.production.example`  
**Test**: Verify production configuration works  
**Evidence**: Production environment validated  
**Dependencies**: Sprint 11 complete  
**Estimated Time**: 2 hours

#### Task 12.2: Deploy to Vercel and Verify Functionality
**Test**: Verify all features work in production  
**Evidence**: Production deployment successful  
**Dependencies**: Task 12.1  
**Estimated Time**: 3 hours

#### Task 12.3: Final Documentation and Handoff
**Files**: Documentation updates, user guides  
**Test**: Verify documentation is complete  
**Evidence**: Documentation review passed  
**Dependencies**: Task 12.2  
**Estimated Time**: 3 hours

**Sprint 12 Success Criteria**:
- ✅ Production environment configured
- ✅ All features working in production
- ✅ Documentation complete and accurate
- ✅ System ready for Google API credential injection

---

## Google API Credential Injection Plan

### Phase 1: Credential Collection (To Be Triggered by User)
**Trigger**: User provides existing Google Cloud project credentials
**Action**: Update environment variables with real credentials
**Test**: Verify API connectivity with real credentials
**Evidence**: Successful API calls to Google services

### Phase 2: Google Ads Activation
**Trigger**: Google Ads developer token approved
**Action**: Enable Google Ads API functionality
**Test**: Verify campaign management operations
**Evidence**: Successful Google Ads API calls

### Phase 3: AdSense Activation
**Trigger**: AdSense account approved for blog.addiscrown.et
**Action**: Enable AdSense API functionality
**Test**: Verify revenue tracking operations
**Evidence**: Successful AdSense API calls

### Phase 4: Search Console Activation
**Trigger**: Search Console property verified for blog.addiscrown.et
**Action**: Enable Search Console API functionality
**Test**: Verify SEO analytics operations
**Evidence**: Successful Search Console API calls

---

## Risk Mitigation & Contingency Plans

### Risk 1: Google Cloud Project Access Delay
**Contingency**: Continue with all scaffolding and development using placeholder credentials
**Impact**: No impact on development timeline
**Resolution**: Inject real credentials when available

### Risk 2: Developer Token Approval Delay
**Contingency**: Build complete Google Ads integration without live API calls
**Impact**: Can test with mock data until token approved
**Resolution**: Enable live API calls when token approved

### Risk 3: AdSense Domain Approval Delay
**Contingency**: Build AdSense integration with mock revenue data
**Impact**: Can test all functionality without real revenue
**Resolution**: Enable live revenue tracking when domain approved

### Risk 4: Next.js/Google Ads Compatibility Issues
**Contingency**: Use google-ads-kit (designed for Next.js/Vercel)
**Impact**: Minimal - chosen solution specifically addresses this
**Resolution**: Alternative approaches tested if needed

---

## Success Metrics

### Technical Success
- ✅ All 46 database tables operational
- ✅ Admin system fully functional with NextAuth
- ✅ Google API integration scaffolding complete
- ✅ Geographic analytics operational
- ✅ Content intelligence system functional
- ✅ All features tested and validated

### Business Success
- ✅ Admin workflow efficient and intuitive
- ✅ Content planning data-driven
- ✅ Geographic insights actionable
- ✅ System ready for Google API activation
- ✅ $500 Google Ads credit ready for optimization
- ✅ AdSense integration ready for revenue tracking

### Development Success
- ✅ Test-driven development approach followed
- ✅ No assumptions - all features verified
- ✅ Progressive development with continuous validation
- ✅ Complete documentation and evidence collection

---

## Next Immediate Actions

1. **Begin Sprint 1**: Start authentication migration
2. **Execute Task 1.1**: Restore original AdminLoginForm component
3. **Test Driven Development**: Verify each task before proceeding
4. **Evidence Collection**: Document all test results
5. **Progress Tracking**: Update EXECUTION_LOG.md after each sprint

**Ready to begin Sprint 1 execution with test-driven development approach.**