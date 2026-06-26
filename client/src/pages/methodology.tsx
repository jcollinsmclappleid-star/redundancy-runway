import { Link } from "wouter";
import { LegalDocLayout } from "@/components/LegalDocLayout";
import { LegalDisclaimerBox, MethodologyDisclaimerSection } from "@/components/legal/LegalDisclaimerBox";
import { UK_STATUTORY_REDUNDANCY, formatGBP } from "@/lib/engine";

export default function MethodologyPage() {
  return (
    <LegalDocLayout
      title="Calculation Methodology | RedundancyCalculatorUK"
      metaDescription="How RedundancyCalculatorUK models statutory redundancy pay, package components, household runway, scenarios, and resilience scores."
      canonicalPath="/methodology"
      heroLabel="Methodology"
      heroTitle="Model methodology & limitations"
      heroSubtitle="A transparent description of what the calculator does, how figures are derived, and what it deliberately does not model."
    >
      <p className="text-foreground font-medium">Last updated: {UK_STATUTORY_REDUNDANCY.lastChecked}</p>

      <LegalDisclaimerBox className="mb-2" />

      <p>
        RedundancyCalculatorUK uses a deterministic arithmetic model. Identical inputs produce identical outputs. Core
        calculations run in your browser; optional brief generation uses a server-assisted language model as described
        in the{" "}
        <Link href="/privacy" className="underline text-primary">
          Privacy Policy
        </Link>
        .
      </p>

      <section>
        <h2 className="text-xl font-semibold text-foreground">1. Model framework</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Pure arithmetic — no machine learning in core payout or runway maths</li>
          <li>User assumptions drive all outputs</li>
          <li>Not predictive — does not forecast job search duration, markets, or policy changes</li>
          <li>Not validated against individual employer payroll or court outcomes</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">2. Statutory redundancy estimate</h2>
        <p>Where qualifying service is met, the statutory component uses UK rules in simplified form:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Minimum qualifying service: {UK_STATUTORY_REDUNDANCY.minServiceYears} years</li>
          <li>Maximum service counted: {UK_STATUTORY_REDUNDANCY.maxServiceYears} years</li>
          <li>
            Weekly pay cap: {formatGBP(UK_STATUTORY_REDUNDANCY.weeklyPayCap)} (redundancies on or after{" "}
            {UK_STATUTORY_REDUNDANCY.effectiveFrom})
          </li>
          <li>Age-band multipliers: 0.5 weeks per year under 22, 1 week for 22–40, 1.5 weeks for 41+</li>
          <li>
            Reference threshold for tax discussion: {formatGBP(UK_STATUTORY_REDUNDANCY.taxFreeThreshold)} — not a
            personal tax calculation
          </li>
        </ul>
        <p>
          Source reference:{" "}
          <a href={UK_STATUTORY_REDUNDANCY.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline text-primary">
            GOV.UK redundancy pay guidance
          </a>
          . Rules in force at the time of use may differ from those modelled until we update the config.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">3. Wider package components</h2>
        <p>Beyond statutory redundancy, the model may include under your assumptions:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Enhanced or employer package amounts (replacing statutory in the model when entered that way)</li>
          <li>Manual package override</li>
          <li>Notice pay / PILON from weeks and weekly pay assumptions</li>
          <li>Holiday pay from accrued weeks</li>
          <li>Unpaid wages and other one-off income</li>
        </ul>
        <p>Package completeness scoring measures how many model fields are filled — not legal fairness or completeness of an employer offer.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">4. Starting capital & runway</h2>
        <p>Baseline runway generally combines:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Cash savings and liquid investments entered</li>
          <li>Modelled redundancy package total</li>
          <li>Other one-off income where included</li>
          <li>Less essential and non-essential monthly spending</li>
          <li>Plus replacement income and job-gap assumptions where entered</li>
        </ul>
        <p>
          Net monthly burn is the monthly shortfall after income included in the model. Month-by-month projections
          deplete capital until it reaches zero or the projection horizon (up to 60 months).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">5. Scenarios & resilience</h2>
        <p>Paid reports include additional scenarios such as:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Slower income recovery or longer job gap</li>
          <li>More severe spending or income stress</li>
          <li>Essential-only spending comparison</li>
          <li>Sensitivity rankings (which assumption moves runway most in the model)</li>
          <li>Runway Resilience Index (RRI) — a 0–100 score from modelled runway length and assumptions</li>
        </ul>
        <p>Scenario labels describe model changes, not predictions of what will happen.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">6. Plain-English brief</h2>
        <p>
          The optional Redundancy Runway Brief translates calculated outputs into narrative text. It explains figures
          already in the model; it does not add new calculations or provide advice. Generation may use a third-party
          language model on de-identified numerical outputs only.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">7. Known exclusions</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Personal income tax, NI, or benefit entitlement calculations</li>
          <li>Pension actuarial adjustments or drawdown modelling</li>
          <li>Mortgage lending decisions or lender-specific forbearance rules</li>
          <li>Share options, LTIPs, or complex deferred compensation unless manually modelled</li>
          <li>Inflation, investment returns on cash, or variable interest rates unless scenario assumptions imply otherwise</li>
          <li>Employment tribunal outcomes or legal disputes</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">8. Labour market benchmarks</h2>
        <p>
          Some UI references use Office for National Statistics and sector benchmark data as context only. Benchmarks do
          not override your entered assumptions or determine model outputs unless explicitly stated in a scenario.
        </p>
      </section>

      <MethodologyDisclaimerSection />

      <section>
        <h2 className="text-xl font-semibold text-foreground">11. Further reading</h2>
        <p>
          <Link href="/legal" className="underline text-primary">
            Legal &amp; Regulatory Notice
          </Link>
          {" · "}
          <Link href="/terms" className="underline text-primary">
            Terms of Use
          </Link>
          {" · "}
          <Link href="/privacy" className="underline text-primary">
            Privacy Policy
          </Link>
          {" · "}
          <Link href="/statutory-redundancy-pay-calculator" className="underline text-primary">
            Statutory redundancy calculator guide
          </Link>
        </p>
      </section>
    </LegalDocLayout>
  );
}
