import { DASHBOARD_DISCLAIMER, FREE_STATUTORY_BOUNDARY, PACKAGE_DISCLAIMER, TAX_SENSITIVE_DISCLAIMER } from "@shared/complianceCopy";

export function LegalDisclaimerBox({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl border border-amber-200 bg-amber-50/80 px-5 py-4 not-prose space-y-2 ${className}`}
      data-testid="legal-disclaimer-box"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">Important — read before using outputs</p>
      <p className="text-sm text-amber-950/90 leading-relaxed">{DASHBOARD_DISCLAIMER}</p>
      <p className="text-sm text-amber-950/80 leading-relaxed">{FREE_STATUTORY_BOUNDARY}</p>
      <p className="text-sm text-amber-950/80 leading-relaxed">{PACKAGE_DISCLAIMER}</p>
    </div>
  );
}

export function MethodologyDisclaimerSection() {
  return (
    <section data-testid="section-methodology-disclaimers">
      <h2 className="text-xl font-semibold text-foreground">10. Important disclaimers</h2>
      <p className="mb-3">{DASHBOARD_DISCLAIMER}</p>
      <p className="mb-3">{FREE_STATUTORY_BOUNDARY}</p>
      <p className="mb-3">{PACKAGE_DISCLAIMER}</p>
      <p className="mb-3">{TAX_SENSITIVE_DISCLAIMER}</p>
      <p>
        All runway months, resilience scores, scenario comparisons, and brief narrative text are illustrative model
        outputs only. They do not predict employment outcomes, benefit decisions, lender forbearance, or personal tax
        liability. Independent professional review may be warranted before acting on any figure shown.
      </p>
    </section>
  );
}
