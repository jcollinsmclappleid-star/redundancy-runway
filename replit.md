# RedundancyRunway

## Overview
UK-focused income shock runway calculator that models financial sustainability through job loss. Provides monthly capital depletion projections, scenario comparisons, milestone timelines, spending impact rankings, sensitivity analysis, and sector-specific reemployment intelligence.

**Freemium model:** Free preview shows runway estimate. £39 unlock reveals full analysis including decision scenarios, spending optimizer, and PDF export (payment integration pending).

## Architecture
- **Frontend:** React + Vite + TypeScript, Tailwind CSS, shadcn/ui components
- **Backend:** Express.js API, PostgreSQL (Drizzle ORM)
- **Calculations:** All financial computations run client-side in `client/src/lib/engine.ts`
- **Design:** Premium teal/sage palette (185° hue, 65% saturation)

## Key Files
- `shared/schema.ts` - Database tables (sessions, purchases, calculations) and RunwayInputs Zod schema
- `client/src/lib/engine.ts` - computeRunway(), computeScenarios(), computeSpendingImpact(), computeSensitivity(), computeEssentialOnlyComparison()
- `client/src/lib/sectorData.ts` - UK sector reemployment data constants
- `client/src/lib/wizardStore.ts` - Wizard state management with localStorage persistence
- `client/src/lib/sessionToken.ts` - Session token management
- `client/src/pages/landing.tsx` - Landing page with hero, features, FAQ
- `client/src/pages/wizard.tsx` - 5-step financial data input wizard with validation warnings and running totals
- `client/src/pages/preview.tsx` - Free preview showing approximate runway, stability score, essential-only insight
- `client/src/pages/results.tsx` - Full results dashboard with 6 tabs, scenario overlay chart, monthly data table, copy-to-clipboard
- `server/routes.ts` - API endpoints with Zod validation
- `server/storage.ts` - DatabaseStorage class

## Language Rules
- ALL outputs must be assumption-framed ("under these assumptions...")
- NEVER use "should", "must", "recommended"
- Clinical, non-advisory language throughout
- Persistent disclaimer banner on every page

## User Preferences
- Visual quality is paramount
- Conservative Enhanced MVP approach
- Build immediately, not phased

## Recent Changes
- Feb 2026: Engine accuracy enhancements - fixed scenario comparison (50% income, new job timing), granular stability scoring, spending impact edge cases for 60+ runway, essential-only comparison, 6 sensitivity scenarios, scenario overlay chart, monthly data table, wizard validation warnings, copy-to-clipboard summary, sector month equivalents
- Feb 2026: Initial build - schema, engine, all pages, backend API, database
