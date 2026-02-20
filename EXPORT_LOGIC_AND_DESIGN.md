# RedundancyRunway - Logic & Design Export

## 1. Product Overview

RedundancyRunway is a UK-focused income shock runway calculator. It models financial sustainability through job loss by projecting how long a person's savings and capital may last under various income disruption scenarios.

**Business model:** Freemium. Free preview shows approximate runway months. Full analysis (coming soon: payment integration) unlocks scenario comparisons, milestone timeline, spending impact analysis, sensitivity projections, monthly data table, and copy-to-clipboard export.

**Language framework:** All outputs use clinical, non-advisory language. Every projection is framed as "under these assumptions" rather than "you should" or "we recommend". This is illustrative financial modelling only, not advice.

---

## 2. Architecture

### Stack
- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui component library
- **State:** Custom hook with localStorage persistence (no Redux)
- **Charts:** Recharts (area charts, line charts)
- **Backend:** Express.js API server
- **Database:** PostgreSQL via Drizzle ORM
- **Routing:** wouter (lightweight React router)
- **Validation:** Zod schemas shared between frontend and backend

### Design Principle
All financial calculations run **client-side** in the browser. No sensitive financial data is sent to the server. The backend only manages session tokens, purchase records, and saved calculation snapshots.

### Colour Palette
Premium teal/sage palette built on HSL 185 degree hue, 65% saturation:
- Primary: `hsl(185, 65%, 30%)` (light mode) / `hsl(185, 65%, 35%)` (dark mode)
- Background: `hsl(195, 20%, 98%)` (light) / `hsl(200, 20%, 7%)` (dark)
- Card: `hsl(195, 18%, 96%)` (light) / `hsl(200, 16%, 10%)` (dark)
- Full dark mode support via CSS custom properties

---

## 3. Data Model

### User Inputs (RunwayInputs)

All monetary values are monthly GBP amounts unless noted.

**Capital (one-off amounts):**
| Field | Type | Description |
|-------|------|-------------|
| cashSavings | number | Bank accounts, cash ISAs, accessible savings |
| liquidInvestments | number | Stocks & shares ISAs, investment accounts |
| redundancyPayout | number | Redundancy payment (after tax) |
| otherOneOffIncome | number | Any other lump sums |

**Income:**
| Field | Type | Description |
|-------|------|-------------|
| currentMonthlyNetIncome | number | Previous take-home pay (for scenario modelling) |
| replacementMonthlyIncome | number | Current part-time/freelance/gig income during gap |
| benefitSupportEstimate | number | Estimated monthly benefits |
| monthsUntilNewJob | integer 0-60 | Estimated months until previous income level resumes |

**Essential Expenses (monthly):**
| Field | Type | Description |
|-------|------|-------------|
| mortgageOrRent | number | Housing costs |
| utilities | number | Gas, electric, water, broadband, phone |
| food | number | Food & groceries |
| insurance | number | Home, car, life, health |
| transport | number | Fuel, public transport, car finance |
| debtRepayments | number | Credit cards, loans, HP |
| childcare | number | Childcare costs |
| otherEssential | number | Other essential costs |

**Non-Essential Expenses (monthly):**
| Field | Type | Description |
|-------|------|-------------|
| subscriptions | number | Streaming, gym, software |
| leisure | number | Eating out, entertainment, hobbies |
| travel | number | Travel & holidays |
| discretionaryOther | number | Other discretionary |

**Settings:**
| Field | Type | Description |
|-------|------|-------------|
| includeNonEssential | boolean | Whether non-essential spending is included in burn rate |
| emergencyBuffer | number | Milestone marker threshold |
| sector | string | Employment sector for reemployment data context |

### Computed Output Types

**RunwayResult:**
- monthsUntilDepletion (0-60, capped)
- capitalAfter3Months, capitalAfter6Months, capitalAfter12Months
- startingCapital, monthlyBurn
- essentialExpenses, nonEssentialExpenses, totalExpenses
- projections (array of MonthProjection)
- stabilityScore (0-100), stabilityBand ("Stable" | "Watch" | "High Pressure")
- milestones (array with month, description, severity)

**MonthProjection:**
- month, capital, income, expenses, netBurn, milestones[]

**ScenarioComparison:**
- name, description, result (RunwayResult)

**SpendingImpact:**
- category, currentAmount, reductionAmount, runwayExtensionMonths, impactPerPound, effort

**SensitivityResult:**
- label, baseRunway, adjustedRunway, difference

---

## 4. Calculation Engine Logic

### 4.1 Core Runway Computation (`computeRunway`)

```
Starting Capital = cashSavings + liquidInvestments + redundancyPayout + otherOneOffIncome

Essential Expenses = mortgageOrRent + utilities + food + insurance + transport
                   + debtRepayments + childcare + otherEssential

Non-Essential Expenses = subscriptions + leisure + travel + discretionaryOther

Total Monthly Expenses = Essential + (Non-Essential if includeNonEssential is true)
```

**Month-by-month projection loop (0 to 60 months):**

For each month:
1. Calculate income for that month using the income model
2. Net burn = Total Expenses - Income
3. Capital = Previous Capital - Net Burn
4. Check milestone thresholds
5. If capital reaches zero, mark depletion month

**Income model per month:**
- If `monthsUntilNewJob > 0` and current month is within gap period:
  - Income = replacementMonthlyIncome + benefitSupportEstimate
- If `monthsUntilNewJob > 0` and current month exceeds gap period:
  - Income = currentMonthlyNetIncome (full previous income resumes)
- Otherwise (no new job timeline set):
  - Income = replacementMonthlyIncome + benefitSupportEstimate (indefinitely)

### 4.2 Stability Score (`computeStabilityScore`)

Starts at 100, deductions applied:

| Condition | Deduction |
|-----------|-----------|
| Runway < 3 months | -40 |
| Runway < 6 months | -30 |
| Runway < 9 months | -20 |
| Runway < 12 months | -10 |
| Housing > 45% of essential expenses | -10 |
| Housing > 35% of essential expenses | -5 |
| Debt > 25% of total expenses | -15 |
| Debt > 15% of total expenses | -8 |
| Gap income < 25% of previous income | -15 |
| Gap income < 50% of previous income | -10 |
| Starting capital covers < 3 months of expenses | -10 |
| Non-essential > 30% of total expenses | -5 |

**Bands:**
- Score >= 75: "Stable"
- Score >= 45: "Watch"
- Score < 45: "High Pressure"

### 4.3 Scenario Comparison (`computeScenarios`)

Three scenarios computed against identical expense assumptions:

1. **Zero Income:** replacementMonthlyIncome = 0, benefitSupportEstimate = 0, monthsUntilNewJob = 0. Models worst case: no income whatsoever for entire projection.

2. **50% Previous Income:** replacementMonthlyIncome = currentMonthlyNetIncome * 0.5, benefitSupportEstimate = 0, monthsUntilNewJob = 0. Models part-time or contract work at half previous rate, indefinitely.

3. **Full Income After X Months:** Uses user's monthsUntilNewJob value (defaults to 6 if not set). During gap months, uses replacement income + benefits. After gap, full previous income resumes.

### 4.4 Essential-Only Comparison (`computeEssentialOnlyComparison`)

Computes runway twice: once with all spending, once with only essential expenses. Returns:
- fullRunway: months with current spending
- essentialOnlyRunway: months with essentials only
- extraMonths: difference (how many months are gained by cutting all discretionary)
- monthlySaving: total non-essential spending per month

### 4.5 Spending Impact Analysis (`computeSpendingImpact`)

For each spending category, computes what happens to runway if that category is reduced:

| Category | Reduction | Effort Rating |
|----------|-----------|---------------|
| Subscriptions | Cancel all (100%) | Low |
| Leisure | Halve (50%) | Medium |
| Travel & holidays | Cancel all (100%) | Low |
| Other discretionary | Cancel all (100%) | Medium |
| Food & groceries | Reduce 25% | Medium |
| Transport | Reduce 30% | Medium |
| Insurance | Review, reduce 15% | High |
| Utilities | Reduce 10% | Medium |

**Edge case handling:** When both base runway and modified runway are 60+ months, runway extension is set to 0 and the UI displays annual savings instead (since the extension number would be meaningless).

Results are sorted by runway extension months (highest first), then by reduction amount.

### 4.6 Sensitivity Analysis (`computeSensitivity`)

Six "what if" scenarios:

1. Essential expenses increase by 10%
2. Essential expenses increase by 20%
3. Income resumes 3 months later than assumed
4. Income resumes 6 months later than assumed
5. All non-essential spending removed
6. Starting savings are 50% lower than assumed

Each returns the adjusted runway and the difference from base.

---

## 5. Sector Reemployment Data

12 UK sectors with ONS Labour Market Statistics data (2025-Q4):

| Sector | Faster (25th percentile) | Median | Slower (75th percentile) |
|--------|--------------------------|--------|--------------------------|
| Technology | 6 weeks | 12 weeks | 24 weeks |
| Finance & Banking | 8 weeks | 14 weeks | 28 weeks |
| Healthcare & NHS | 4 weeks | 8 weeks | 16 weeks |
| Retail & Hospitality | 3 weeks | 6 weeks | 14 weeks |
| Manufacturing | 8 weeks | 16 weeks | 30 weeks |
| Construction | 5 weeks | 10 weeks | 20 weeks |
| Education | 6 weeks | 12 weeks | 22 weeks |
| Professional Services | 7 weeks | 14 weeks | 26 weeks |
| Public Sector | 5 weeks | 10 weeks | 18 weeks |
| Transport & Logistics | 5 weeks | 10 weeks | 22 weeks |
| Media & Creative | 8 weeks | 16 weeks | 32 weeks |
| Energy & Utilities | 7 weeks | 14 weeks | 26 weeks |
| UK Average (All Sectors) | 6 weeks | 12 weeks | 24 weeks |

Month equivalents are displayed alongside weeks (weeks / 4.33).

---

## 6. User Flow

### Page Structure

```
Landing (/) --> Wizard (/wizard) --> Preview (/preview) --> Results (/results)
```

### Wizard Steps (5 steps)

1. **Savings & Capital** - Cash savings, liquid investments, redundancy payout, other one-off income. Shows running total of starting capital.

2. **Income Assumptions** - Previous monthly net income, replacement income, benefit support, months until new income. Shows running total of gap income.

3. **Essential Expenses** - 8 essential cost categories. Shows running total.

4. **Flexible Expenses** - 4 discretionary categories + toggle for including non-essential in burn rate. Shows running total.

5. **Settings** - Emergency buffer threshold, employment sector selector.

**Validation warnings** appear contextually:
- Zero starting capital warning
- Zero essential expenses warning
- Zero food budget warning
- Savings but no expenses warning

All inputs persist in localStorage between sessions.

### Preview Page (Free Tier)

Shows:
- Approximate runway in months (large headline number)
- Starting capital and monthly burn rate
- Stability score and band
- Capital at 3, 6, and 12 month checkpoints
- Essential-only spending insight (teaser)
- Locked cards showing what's behind the paywall

### Results Dashboard (Full Access)

6 tabs:

1. **Timeline** - Area chart of capital over time + month-by-month data table (expandable from 12 to 60 months) with income, expenses, net burn, and capital columns.

2. **Scenarios** - Line chart overlay comparing all 3 scenario trajectories on same axes + individual scenario cards with runway, capital at 3/6/12 months, and stability band.

3. **Milestones** - Timeline of threshold events (capital below 50%, below emergency buffer, one month of expenses remaining, fully depleted) with severity badges.

4. **Spending** - Ranked list of spending categories by runway impact, with reduction amounts, extension months or annual savings, and effort ratings.

5. **Sensitivity** - 6 "what if" scenarios showing how changes in assumptions affect the projection.

6. **More** - Accordion sections for:
   - Sector reemployment intelligence (with month equivalents)
   - Monthly check-in (compare actual vs projected capital at any month)
   - Assumptions summary (all entered values in a grid)

**Copy Summary** button generates a formatted text summary to clipboard covering assumptions, projection, scenarios, and milestones.

---

## 7. Backend API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/session | POST | Create or retrieve session by token |
| /api/access/:token | GET | Check if session has paid access |
| /api/calculations | POST | Save calculation inputs |
| /api/calculations/:token | GET | Retrieve saved calculations |

All request bodies validated with Zod schemas. Inputs schema shared between frontend and backend via `shared/schema.ts`.

---

## 8. Database Schema

Three tables (PostgreSQL):

**sessions:** id (UUID), session_token (unique), email (optional), created_at

**purchases:** id (UUID), session_token, stripe_session_id, amount, currency (default "gbp"), status (default "pending"), created_at, expires_at

**calculations:** id (UUID), session_token, inputs (JSONB), created_at

---

## 9. Design Decisions

1. **Client-side computation:** All financial calculations run in the browser. This means zero latency, no server load for projections, and no sensitive data transmitted. The backend only stores snapshots for retrieval.

2. **60-month projection cap:** Projections are capped at 60 months (5 years). Beyond this, projections become increasingly unreliable due to compounding assumption errors.

3. **Clinical language throughout:** Every piece of text is carefully worded to avoid advisory language. "Under these assumptions" rather than "you should". This is a legal and ethical requirement for a financial modelling tool.

4. **Freemium gating:** Free users see the headline runway number and basic capital checkpoints. The scenario comparison, spending analysis, sensitivity testing, and data table are behind the paywall to demonstrate clear value.

5. **localStorage persistence:** Wizard inputs persist between page loads and browser sessions. Users can return and refine their figures without re-entering everything.

6. **Sector data as context only:** Reemployment timelines are presented as historical averages with clear disclaimers. They do not feed into the projection calculations - they're contextual reference data only.

7. **Stability score is deterministic:** The score is computed from fixed rules applied to the user's inputs, not from any statistical model. This makes it reproducible and explainable.
