# RedundancyRunway — Comprehensive Project Rundown

> **Purpose:** Institutional capital modelling platform for UK income disruption scenarios. All calculations run client-side in the browser. No financial data transmitted to the server.

---

## 1. Project Overview

**Positioning:** Institutional capital modelling (not consumer budgeting). Clinical, non-advisory language throughout. "Private wealth dashboard" aesthetic.

**Freemium Model:**
- **Free Preview:** Shows runway estimate, stability classification (0-100), capital at 3/6/12 months, and essential-only spending insight.
- **Paid Unlock (£49 one-time, 6 months access):** Full analysis including 60-month trajectory chart, projection range (p25/p50/p75), income recovery scenario overlay, capital recovery timeline, monthly data table, expense sensitivity ranking, stress testing (6 scenarios), mortgage sensitivity analysis, UK ONS benchmark context layer, and structured export.

**Design System:**
- Deep navy-teal palette (192deg hue, 40% saturation)
- Serif accent headings (Georgia / font-serif)
- Institutional whitespace, clinical language
- Dark mode supported via ThemeToggle
- No app-level Header/Footer wrapper — each page manages its own layout

**Tech Stack:**
- Frontend: React + Vite + TypeScript, Tailwind CSS, shadcn/ui components, Recharts for charts
- Backend: Express.js API, PostgreSQL (Drizzle ORM)
- Routing: wouter
- State: TanStack Query, localStorage-based wizard store
- Icons: lucide-react, react-icons/si

---

## 2. Pages & Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/` | LandingPage | Professional product website — hero, trust signals, how it works, product preview, pricing, FAQ, CTA |
| `/wizard` | WizardPage | 6-step data collection wizard |
| `/preview` | PreviewPage | Free preview — headline figures, stability band, capital snapshots, unlock CTA |
| `/results` | ResultsPage | Full dashboard — 7 tabs of analysis |

**Landing Page Sections:**
1. Sticky header with Logo, ThemeToggle, CTA
2. Hero — dark navy bg, dot-grid texture, serif headline, dual CTA buttons
3. Trust strip — 4 icon+label callouts (data privacy, ONS context, statutory calc, deterministic modelling)
4. How it works — 3 numbered steps with connecting line
5. Product preview — dark section showing sample output (free vs full model)
6. Pricing — free card vs paid card (ring-2 ring-primary, floating "Full Access" badge)
7. FAQ — 5 questions in accordion
8. Bottom CTA — dark section matching hero energy
9. Footer — 3-column layout (Logo, Legal, Disclaimer)

---

## 3. The 7-Step Wizard

**Step 1: Redundancy Package**
- Age, Years of Service (capped at 20 for statutory)
- Weekly Gross Pay (statutory cap £751/week)
- Notice Period (weeks), Accrued Holiday (weeks)
- Enhanced Package toggle + amount
- Manual Override toggle + amount (replaces estimate)
- **Live estimate:** Shows statutory redundancy + notice pay + holiday pay, with tax-free threshold (£30,000)

**Step 2: Your Current Position (Context Layer)**
- Employment status: Redundant / At Risk / Other Disruption
- Housing type: Mortgage / Renting / Owned Outright / Other
- Household structure: Single / Couple / Family
- Dependents: yes/no switch
- Confidence level: Comfortable / Uncertain / Under Pressure
- *Note: Context does not affect financial projection — purely for user framing*

**Step 3: Capital Snapshot**
- Cash Savings, Liquid Investments, Other One-Off Income
- Auto-pulls redundancy total from previous step
- Shows starting capital total
- Inline UK household savings benchmark (median £8,500, upper quartile £35,000)

**Step 4: Income Assumptions**
- Previous Monthly Net Income, Replacement Monthly Income, Benefit Support Estimate
- Sector selector (12 UK sectors + "All Sectors")
- **Inline reemployment context:** Shows p25/p50/p75 weeks for selected sector + age band
- "Set Typical Timeline" button — applies median to monthsUntilNewJob
- Months Until New Income (estimate) — 0-60 range

**Step 5: Essential Expenses**
- Mortgage/Rent, Utilities, Food, Insurance, Transport, Debt Repayments, Childcare, Other Essential
- Running total + housing % of essentials
- Inline UK housing burden benchmark (typical 32%, stress threshold 45%)

**Step 6: Flexible Spending Assumptions**
- Subscriptions, Leisure, Travel, Discretionary Other
- Running total + toggle for "Include non-essential spending in projection"
- Emergency Buffer selector (£0, £2,500, £5,000, £10,000)
- Mortgage Sensitivity Percent (custom % for housing cost increase testing)

---

## 4. Engine Calculations (`client/src/lib/engine.ts`)

All calculations are deterministic, client-side, and assumption-framed.

### Core Functions

**`computeRedundancyEstimate(pkg)`** — UK statutory redundancy calculator
- Age-band multipliers: <22 = 0.5x, 22-40 = 1x, 41+ = 1.5x weeks per year of service
- Weekly pay capped at £751, years capped at 20
- Adds notice pay + holiday pay
- Enhanced override replaces statutory element
- Tax-free threshold: £30,000

**`computeRunway(inputs)`** — Core capital depletion model
- 60-month projection loop (MAX_PROJECTION_MONTHS = 60)
- Tracks: capital, income, expenses, netBurn per month
- Milestones: Capital below 50%, below emergency buffer, one month expenses remaining, fully depleted
- Capital recovery: tracks when capital returns to starting baseline post-reemployment
- Stability score: 0-100 heuristic based on runway, housing %, debt %, gap income %, capital cover, non-essential %
- Three stability bands: Stable (>=75), Watch (>=45), High Pressure (<45)

**`computeScenarios(inputs)`** — 3-scenario income comparison
- Zero Income: no replacement income, no benefits
- 50% Previous Income: ongoing partial income
- Full Income after X months: income resumes after gap period

**`computeEssentialOnlyComparison(inputs)`** — What if non-essential spending were removed?
- Compares full runway vs essential-only runway
- Shows extra months gained and monthly saving amount

**`computeSpendingImpact(inputs)`** — Expense sensitivity ranking
- Tests 8 categories with conditional reductions:
  - Subscriptions: 100% removal (Low effort)
  - Leisure: 50% reduction (Medium effort)
  - Travel: 100% removal (Low effort)
  - Discretionary Other: 100% removal (Medium effort)
  - Food: 25% reduction (Medium effort)
  - Transport: 30% reduction (Medium effort)
  - Insurance: 15% reduction (High effort)
  - Utilities: 10% reduction (Medium effort)
- Ranks by runway extension months, impact per pound

**`computeSensitivity(inputs)`** — 6 stress scenarios
- Essential expenses +10%
- Essential expenses +20%
- Income delay +3 months
- Income delay +6 months
- All non-essential removed
- Starting savings 50% lower

**`computeMortgageSensitivity(inputs)`** — Housing cost increase testing
- Tests +1%, +2%, and custom % increases to mortgage/rent
- Shows adjusted runway and difference from base

**`computeProjectionRange(inputs)`** — p25/p50/p75 trajectory modelling
- Combines sector-specific + age-band reemployment data
- Fast (25th percentile), Typical (median), Slow (75th percentile)
- Each scenario gets its own runway, depletion month, recovery month

### Formatting
- `formatGBP(amount)` — Intl.NumberFormat en-GB, currency GBP, 0 decimals
- `formatMonths(months)` — "60+ months" for ceiling, "1 month" for singular

---

## 5. Schema & Data Types (`shared/schema.ts`)

### Database Tables
- **sessions:** id, sessionToken, email, createdAt
- **purchases:** id, sessionToken, stripeSessionId, amount, currency, status, createdAt, expiresAt (6 months)
- **calculations:** id, sessionToken, inputs (JSONB), createdAt

### Input Schema (RunwayInputs)
- **context:** employmentStatus, housingType, householdStructure, hasDependents, confidenceLevel
- **redundancyPackage:** age, yearsOfService, weeklyGrossPay, noticeWeeks, holidayWeeks, enhancedPackage, enhancedAmount, useManualOverride, manualOverrideAmount
- **capital:** cashSavings, liquidInvestments, otherOneOffIncome
- **income:** currentMonthlyNetIncome, replacementMonthlyIncome, monthsUntilNewJob, benefitSupportEstimate, sector
- **essential expenses:** mortgageOrRent, utilities, food, insurance, transport, debtRepayments, childcare, otherEssential
- **flexible spending:** subscriptions, leisure, travel, discretionaryOther
- **flags:** includeNonEssential, emergencyBuffer, mortgageSensitivityPercent

### Result Types
- **RunwayResult:** monthsUntilDepletion, capitalAfter3/6/12, startingCapital, monthlyBurn, essential/nonEssential/totalExpenses, projections[], stabilityScore, stabilityBand, stabilityExplanation, milestones[], capitalRecovery
- **StabilityExplanation:** runwayMonths, housingPercent, debtPercent, gapIncomePercent, capitalCoverMonths, nonEssentialPercent, factors[]
- **CapitalRecovery:** recoveryMonth, rebuildDuration, capitalAt12MonthsPostReemployment, recovers
- **ScenarioComparison:** name, description, result
- **SpendingImpact:** category, currentAmount, reductionAmount, runwayExtensionMonths, impactPerPound, effort
- **SensitivityResult:** label, baseRunway, adjustedRunway, difference
- **MortgageSensitivityResult:** label, increasePercent, adjustedRunway, difference, newHousingCost
- **ProjectionRange:** fast, typical, slow (each a ProjectionRangeScenario)
- **ProjectionRangeScenario:** label, percentileLabel, reemploymentWeeks, reemploymentMonths, runwayMonths, depletionMonth, recoveryMonth
- **SectorData:** sector, medianWeeks, p25Weeks, p75Weeks, source, lastUpdated

---

## 6. API Routes (`server/routes.ts`)

- **POST /api/session** — Validates/creates session by sessionToken
- **GET /api/access/:token** — Checks if session has active, non-expired purchase
- **POST /api/calculations** — Persists user inputs (JSONB) linked to session
- **GET /api/calculations/:token** — Retrieves saved calculations for a session

All financial calculations run client-side. The backend only handles session management and access control.

---

## 7. UK Data Authority Layer

### Sector Reemployment Data (`client/src/lib/sectorData.ts`)
12 UK sectors with p25/median/p75 reemployment weeks (ONS Q4 2025):
- Technology: 6/12/24 weeks
- Finance & Banking: 8/14/28 weeks
- Healthcare & NHS: 4/8/16 weeks
- Retail & Hospitality: 3/6/14 weeks
- Manufacturing: 8/16/30 weeks
- Construction: 5/10/20 weeks
- Education: 6/12/22 weeks
- Professional Services: 7/14/26 weeks
- Public Sector: 5/10/18 weeks
- Transport & Logistics: 5/10/22 weeks
- Media & Creative: 8/16/32 weeks
- Energy & Utilities: 7/14/26 weeks
- UK Average: 6/12/24 weeks

### UK Benchmarks (`client/src/lib/ukBenchmarks.ts`)
- **Redundancy Context:** 98,000 total redundancies (Q4 2025), +14% YoY. Sector highlights: Technology +22%, Finance +18%, Retail +11%.
- **Savings Benchmarks:** Median household savings £8,500, upper quartile £35,000 (ONS Wealth and Assets Survey, 2025)
- **Housing Burden:** Typical 32% of net income, stress threshold 45% (ONS Household Expenditure Data, 2025)
- **Reemployment by Age Band:**
  - Under 25: 4/8/14 weeks
  - 25-34: 5/10/20 weeks
  - 35-44: 6/12/24 weeks
  - 45-54: 8/16/30 weeks
  - 55+: 10/22/38 weeks

### How Projection Range Works
Combines sector median + age-band median, then takes min/max for p25/p75. For example:
- Technology sector median: 12 weeks
- Age 35-44 median: 12 weeks
- Combined typical: 12 weeks (~2.8 months)
- Fast: min(6, 6) = 6 weeks
- Slow: max(24, 24) = 24 weeks

---

## 8. Free vs Paid Feature Split

### Free Preview
- Runway estimate in months
- Stability classification (0-100 score + band)
- Capital at 3 / 6 / 12 months
- Essential-only spending insight ("If all non-essential spending were removed...")
- £49 unlock CTA with locked feature list

### Paid Full Model (£49)
- 60-month capital trajectory chart (AreaChart with gradient)
- Projection range panel (p25 / p50 / p75) with depletion/recovery months
- Income recovery scenario overlay (ComposedChart with 3 lines)
- Capital threshold events (milestone timeline)
- Expense sensitivity ranking (sorted by runway extension)
- Stress testing (6 scenarios with base vs adjusted)
- Mortgage sensitivity analysis (+1%/+2%/custom%)
- UK benchmark context (savings position, housing exposure, ONS data)
- Monthly data table (expandable, 12/60 months)
- Capital recovery projection (when capital returns to baseline)
- Stability factors explanation
- Structured export (copy to clipboard)

---

## 9. Results Page Dashboard (7 Tabs)

1. **Capital Trajectory** — Stability badge, metric cards, area chart, capital recovery card, monthly data table
2. **Income Recovery Scenarios** — Scenario overlay chart (3 lines), individual scenario cards
3. **Capital Threshold Events** — Milestone list with severity badges
4. **Expense Sensitivity Ranking** — Sorted table of spending impact items
5. **Stress Testing** — 6 sensitivity scenarios with difference highlighting
6. **Mortgage Sensitivity** — Housing cost increase scenarios (conditional on mortgage/rent > 0)
7. **Supplementary** — UK redundancy environment, savings benchmark, housing detail, ONS data attribution

---

## 10. Language & Tone Rules

- ALL outputs must be assumption-framed ("under these assumptions...")
- NEVER use "should", "must", "recommended", or prescriptive advice
- Conditional framing: "If X were £0" not "Cancel X"
- Clinical, non-advisory institutional language throughout
- Persistent disclaimer banner on every page
- All benchmarks are "contextual only" and "do not constitute advice"

---

## 11. Enhancement Ideas for AI Job Displacement Angle

The current platform is positioned broadly for "income disruption" but the landing page and wizard primarily reference redundancy. Below are concrete enhancements to capture the AI job displacement narrative:

### A. Wizard Enhancements
1. **Add "AI Impact Risk" to Context Layer**
   - New field: `aiRiskLevel` — "None / Low / Medium / High"
   - New field: `roleAutomationPotential` — "Yes / No / Uncertain"
   - These are contextual (don't affect calculation) but frame the user's situation

2. **Add "Disruption Type" to Employment Status**
   - Currently: Redundant / At Risk / Other Disruption
   - Add: "AI/Automation Displacement" as a distinct option
   - This changes the language throughout the flow

3. **Sector-Specific AI Risk Scores**
   - For each of the 12 sectors, add an `aiDisplacementRisk` field
   - Technology: High, Finance: Medium-High, Retail: High, Manufacturing: High, etc.
   - Display in the reemployment context panel alongside ONS data
   - Use language like: "This sector has been identified in labour market literature as having elevated exposure to automation-related workforce transition"

### B. Results Page Enhancements
4. **AI Risk Panel in Supplementary Tab**
   - Show sector's AI displacement risk classification
   - Reference: "Based on ONS and academic research on task automation potential"
   - Keep it contextual — no predictions, just classification

5. **"Displacement-Specific" Scenario**
   - Add a 4th scenario: "Structural Transition" — models income at 30% for 12 months then 80% (reflecting lower-paying replacement roles common in displacement)

6. **Re-skilling Runway Metric**
   - New metric: "If retraining costs were £X/month, runway would be Y months"
   - Add a "retrainingMonthlyCost" input to the wizard

### C. Landing Page & Marketing
7. **Hero Copy Refinement**
   - Current: "Model your capital runway under redundancy or income loss"
   - Enhanced: "Model your capital runway under redundancy, AI displacement, or structural income loss"

8. **AI Displacement Section**
   - Add a section between "How it works" and "Product preview" titled "The AI Displacement Context"
   - Reference ONS/academic data on sectors most affected
   - Keep institutional tone — no fear-mongering, just factual context

9. **Trust Signal Addition**
   - Add: "AI displacement risk modelling" as a trust signal
   - Subtitle: "Sector-specific automation exposure context"

### D. Data Layer Enhancements
10. **New Data Module: `aiDisplacementData.ts`**
    - Sector-by-sector AI displacement risk classification
    - Source: ONS, McKinsey, PwC, or academic papers on UK task automation
    - Risk levels: Low / Medium / High / Very High
    - Keep it as a contextual layer — no calculation impact

11. **Enhanced Projection Range for AI Displacement**
    - Add a 4th scenario: "Extended Transition" — uses p90 reemployment timeline (not just p25/p50/p75)
    - Rationale: AI displacement may have longer recovery curves than traditional redundancy

### E. Institutional Tone Preservation
12. **Language Rules for AI Content**
    - "This sector has been identified in workforce transition literature as having elevated exposure to automation-related displacement"
    - NOT: "Your job is at risk from AI"
    - "Structural transition timeline" not "AI job loss"
    - "Workforce automation context" not "AI takeover"
    - All AI-related content must be framed as "contextual classification based on published research" not "prediction"

### F. Freemium Considerations
13. **Free Tier AI Context**
    - Show sector AI risk classification in the free preview
    - This is a strong conversion hook — users want to know their sector's exposure

14. **Paid Tier AI Deep-Dive**
    - Full AI displacement risk panel with sector comparison
    - "Structural transition" scenario (the 4th scenario mentioned above)
    - Re-skilling runway metric

---

## 12. Key Files Reference

| File | Purpose |
|------|---------|
| `shared/schema.ts` | All database tables, Zod schemas, type interfaces |
| `client/src/lib/engine.ts` | All financial computations (deterministic, client-side) |
| `client/src/lib/sectorData.ts` | 12 UK sector reemployment data constants |
| `client/src/lib/ukBenchmarks.ts` | ONS redundancy context, savings benchmarks, housing burden, age-band data |
| `client/src/lib/wizardStore.ts` | Wizard state management with localStorage persistence |
| `client/src/pages/landing.tsx` | Professional product website (hero, trust, pricing, FAQ) |
| `client/src/pages/wizard.tsx` | 6-step wizard with inline benchmarks |
| `client/src/pages/preview.tsx` | Free preview with unlock CTA |
| `client/src/pages/results.tsx` | Full dashboard with 7 tabs |
| `server/routes.ts` | API endpoints (session, access, calculations) |
| `server/storage.ts` | DatabaseStorage class (Drizzle ORM) |
| `client/src/components/DisclaimerBanner.tsx` | Persistent institutional disclaimer |
| `client/src/components/Logo.tsx` | Logo with image mark + serif tagline |
| `client/src/components/Footer.tsx` | 3-column footer layout |

---

## 13. GitHub Repository

All 103 files pushed to: `github.com/jcollinsmclappleid-star/redundancy-runway`
- Uses GitHub Contents API + Git Data API (git push is blocked in main agent)
- GITHUB_PERSONAL_ACCESS_TOKEN secret configured

---

*End of rundown. This document covers all pages, engine functions, schema types, API routes, UK benchmark data, freemium split, and concrete enhancement ideas for the AI job displacement angle.*
