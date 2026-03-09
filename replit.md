# RedundancyRunway

## Overview
UK-focused institutional capital modelling platform for income disruption scenarios. Redundancy-native intake with UK statutory calculation, capital trajectory projections with recovery modelling, 3-scenario income comparisons, milestone timeline, conditional spending analysis, mortgage sensitivity testing, and stability classification with explanatory factors.

**Positioning:** Institutional capital modelling (not consumer budgeting). Clinical, non-advisory language throughout. "Private wealth dashboard" aesthetic.

**Freemium model:** Free preview shows runway estimate, stability classification, 3/6/12 month capital snapshots. £49 unlock reveals full analysis including projection range, scenario overlay chart, capital recovery timeline, monthly data table, mortgage sensitivity, expense sensitivity ranking, stress testing, UK benchmark context, and export (payment integration pending).

## Architecture
- **Frontend:** React + Vite + TypeScript, Tailwind CSS, shadcn/ui components
- **Backend:** Express.js API, PostgreSQL (Drizzle ORM)
- **Calculations:** All financial computations run client-side in `client/src/lib/engine.ts`
- **Design:** Deep navy-teal palette (192° hue, 40% saturation), serif accent headings (Georgia), institutional whitespace
- **Layout:** Each page manages its own header/footer/disclaimer (no app-level wrapper)

## Key Files
- `shared/schema.ts` - Database tables, RunwayInputs Zod schema with context layer, redundancy package, and all result type interfaces
- `client/src/lib/engine.ts` - computeRunway(), computeScenarios(), computeSpendingImpact(), computeSensitivity(), computeEssentialOnlyComparison(), computeRedundancyEstimate(), computeMortgageSensitivity(), computeProjectionRange()
- `client/src/lib/sectorData.ts` - UK sector reemployment data constants
- `client/src/lib/ukBenchmarks.ts` - ONS redundancy context, savings benchmarks, housing burden, age-band reemployment data
- `client/src/lib/wizardStore.ts` - Wizard state management with localStorage persistence (6-step wizard)
- `client/src/lib/sessionToken.ts` - Session token management
- `client/src/pages/landing.tsx` - Landing page with institutional positioning, methodology section, access tiers, FAQ
- `client/src/pages/wizard.tsx` - 6-step wizard: Context Layer, Redundancy Package, Capital Snapshot, Income Assumptions, Essential Expenses, Flexible Spending
- `client/src/pages/preview.tsx` - Free preview showing runway, stability classification, capital snapshots, essential-only insight
- `client/src/pages/results.tsx` - Full results dashboard with 8 tabs: Capital Trajectory, Income Recovery Scenarios, Capital Threshold Events, Expense Sensitivity Ranking, Stress Testing, Mortgage Sensitivity, Supplementary (UK benchmark context)
- `client/src/components/DisclaimerBanner.tsx` - Persistent institutional disclaimer
- `client/src/components/Logo.tsx` - Logo with serif font and "Capital Modelling Platform" tagline
- `server/routes.ts` - API endpoints with Zod validation
- `server/storage.ts` - DatabaseStorage class

## Engine Features
- UK statutory redundancy calculator (age bands 0.5/1/1.5, £643/week cap, 20yr service cap, notice/holiday pay, enhanced override)
- Capital recovery projection (tracks when capital returns to starting baseline post-reemployment)
- Projection range engine (p25/p50/p75 trajectories using combined sector + age-band percentile data)
- Mortgage sensitivity module (+1%/+2%/custom% housing cost increases)
- Stability classification with explanatory factors (runway, housing %, debt %, gap income %, capital cover, non-essential %)
- 3-scenario income comparison (zero income, 50% income, full recovery after gap)
- Spending impact with conditional language ("If X were £0" / "If X were 50% lower")
- 6 sensitivity scenarios (expense inflation, income delay, savings variation)
- UK benchmark data module (ONS redundancy context, savings position comparison, housing burden benchmarks, age-band reemployment data)

## Language Rules
- ALL outputs must be assumption-framed ("under these assumptions...")
- NEVER use "should", "must", "recommended", or prescriptive advice
- Clinical, non-advisory institutional language throughout
- Conditional framing: "If X were £0" not "Cancel X"
- Persistent disclaimer banner on every page

## User Preferences
- Visual quality is paramount - institutional "private wealth dashboard" aesthetic
- Conservative Enhanced MVP approach
- Build immediately, not phased
- Deep navy-teal palette with serif accent headings

## Recent Changes
- Mar 2026: Landing page visual redesign — "actual website" treatment
  - Hero: Full-width dark navy (bg-primary) background, large serif headline, white/inverted CTA buttons, subtle dot-grid texture overlay
  - Header: Now sticky with backdrop-blur, includes ThemeToggle alongside CTA button
  - Trust strip: 4 icon+label+subtitle callouts with primary-tinted icon squares
  - How it works: Numbered connected steps with large circle step indicators and connecting line on desktop
  - Product preview panel: New dark section showing stylised output mockup (runway figure, stability badge, capital snapshots + full feature list)
  - Pricing: Paid card highlighted with ring-2 ring-primary, "Full Access" floating badge, shadow elevation; free card visually quieter
  - FAQ: Trigger text scaled up to text-base for proper readability
  - Bottom CTA: Bold dark navy section matching hero energy with dual CTA buttons
  - Footer: Upgraded to proper 3-column layout using Footer.tsx (Logo in brand column, Legal links, Disclaimer); split bottom row with copyright + data attribution

- Feb 2026: Data Authority Layer & Projection Range
  - New module: ukBenchmarks.ts with ONS redundancy context, savings benchmarks, housing burden, age-band reemployment data
  - Engine: computeProjectionRange() for p25/p50/p75 trajectories using combined sector + age-band percentile data
  - Schema: Added ProjectionRange and ProjectionRangeScenario types
  - Wizard: Inline benchmarks on Capital (savings position), Income (reemployment context with "Set Typical Timeline"), Expenses (housing burden)
  - Landing: Complete rewrite with £49 pricing, institutional copy, comparison table, methodology, refund clarity
  - Results: Projection Range panel, savings position card, housing exposure card, Supplementary tab (UK redundancy environment, savings benchmark, housing detail), data attribution footer
  - Preview: £49 pricing, Projection Range + UK Benchmark Context locked cards added
  - Disclaimer: Updated to reference historical statistics
- Feb 2026: Complete product rewrite - repositioned from consumer SaaS to institutional capital modelling platform
  - Schema: Added context layer (employment status, housing, household, dependents, confidence), redundancy package inputs, capital recovery outputs, stability explanation, mortgage sensitivity results
  - Engine: UK statutory redundancy calculator, capital recovery projection, mortgage sensitivity module, stability explanation factors
  - Design: Deep navy-teal palette (192°/40%), serif accent headings, increased whitespace, institutional aesthetic
  - Wizard: Restructured to 6 steps (Context Layer, Redundancy Package, Capital Snapshot, Income Assumptions, Essential Expenses, Flexible Spending)
  - Landing: Complete rewrite with institutional positioning, methodology section, access tiers
  - Preview: Updated locked card names to institutional terminology
  - Results: 7 tabs with institutional names, capital recovery content, mortgage sensitivity tab
  - Language: Hardened to clinical/conditional throughout
  - App: Removed app-level Header/Footer wrapper, each page manages own layout
- Feb 2026: Initial build - schema, engine, all pages, backend API, database
