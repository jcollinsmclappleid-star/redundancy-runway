import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PoundSterling, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldHelp } from "@/components/ui/field-help";
import { formatGBP, computeRedundancyEstimate, UK_STATUTORY_REDUNDANCY } from "@/lib/engine";
import { PRODUCT_COPY, RUNWAY_REPORT_PRICE_GBP } from "@shared/product";
import type { RunwayInputs } from "@shared/schema";
import { EnhancedPackageAssumptionChips } from "@/components/wizard/enhanced-package-chips";
import { GrossPayInput } from "@/components/wizard/gross-pay-input";
import type { EnhancedAssumptionId } from "@/lib/enhanced-package-assumptions";

function CurrencyInput({ label, value, onChange, tooltip, id }: {
  label: string; value: number; onChange: (v: number) => void; tooltip?: string; id: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Label htmlFor={id} className="text-sm">{label}</Label>
        {tooltip && <FieldHelp text={tooltip} />}
      </div>
      <div className="relative">
        <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          id={id}
          type="number"
          min={0}
          step="1"
          value={value || ""}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="pl-8"
          placeholder="0"
          data-testid={`input-${id}`}
        />
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange, tooltip, id, min = 0, max, placeholder }: {
  label: string; value: number; onChange: (v: number) => void; tooltip?: string; id: string; min?: number; max?: number; placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Label htmlFor={id} className="text-sm">{label}</Label>
        {tooltip && <FieldHelp text={tooltip} />}
      </div>
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        value={value > 0 ? String(value) : ""}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d]/g, "");
          if (raw === "") {
            onChange(0);
            return;
          }
          let v = Number(raw);
          if (!Number.isFinite(v)) return;
          if (max !== undefined) v = Math.min(max, v);
          onChange(v);
        }}
        onBlur={(e) => {
          const raw = e.target.value.replace(/[^\d]/g, "");
          if (raw === "") return;
          let v = Number(raw);
          if (!Number.isFinite(v) || v === 0) return;
          if (v < min) v = min;
          if (max !== undefined) v = Math.min(max, v);
          onChange(v);
        }}
        placeholder={placeholder || "0"}
        data-testid={`input-${id}`}
      />
    </div>
  );
}

interface RedundancyPackageCalculatorProps {
  inputs: RunwayInputs;
  setInputs: (u: ((prev: RunwayInputs) => RunwayInputs) | Partial<RunwayInputs>) => void;
  /** Compact mode hides intro copy for SEO embeds */
  compact?: boolean;
  /** Wizard step 0 — hide unlock teaser to reduce friction */
  hideUnlockTeaser?: boolean;
}

export function RedundancyPackageCalculator({ inputs, setInputs, compact = false, hideUnlockTeaser = false }: RedundancyPackageCalculatorProps) {
  const [, navigate] = useLocation();
  const pkg = inputs.redundancyPackage;
  const isVoluntaryRedundancy = inputs.context.employmentStatus === "voluntary_redundancy";
  const [enhancedAssumptionId, setEnhancedAssumptionId] = useState<EnhancedAssumptionId | null>(null);

  const updatePkg = (field: string, value: number | boolean) => {
    setInputs((prev) => ({ ...prev, redundancyPackage: { ...prev.redundancyPackage, [field]: value } }));
  };

  const estimate = useMemo(() => computeRedundancyEstimate(pkg), [pkg]);
  const hasPackageDetails = pkg.noticeWeeks > 0 || pkg.holidayWeeks > 0 || pkg.enhancedPackage || pkg.useManualOverride;

  return (
    <div className="space-y-4">
      {!compact && !hideUnlockTeaser && (
        <div className="rounded-lg border border-gold/25 bg-gold/5 p-3 space-y-3" data-testid="panel-wizard-unlock-teaser">
          <div>
            <p className="text-xs font-semibold text-primary leading-snug">
              {PRODUCT_COPY.previewUnlockHeadline}
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
              {PRODUCT_COPY.previewUnlockSub}
            </p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {PRODUCT_COPY.previewUnlockAngles.map((angle) => (
              <li
                key={angle.id}
                className="rounded-md bg-background/60 border border-gold/15 px-2.5 py-2"
                data-testid={`wizard-unlock-angle-${angle.id}`}
              >
                <p className="text-[10px] font-semibold text-primary leading-snug">{angle.title}</p>
                <p className="text-[10px] text-muted-foreground leading-snug mt-0.5 line-clamp-2">{angle.desc}</p>
              </li>
            ))}
          </ul>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-auto min-h-8 whitespace-normal py-1.5 text-xs border-gold/40"
            onClick={() => navigate("/unlock")}
            data-testid="button-wizard-whats-in-full-report"
          >
            See what unlocks — £{RUNWAY_REPORT_PRICE_GBP}
            <ArrowRight className="w-3 h-3 ml-1.5 shrink-0" />
          </Button>
        </div>
      )}

      {!compact && (
        <div className="rounded-md bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">
            Use best estimates. You can refine these figures later. If you have a confirmed package, use the manual override below.
          </p>
        </div>
      )}

      <NumberInput label="Your age" value={pkg.age} onChange={(v) => updatePkg("age", v)} id="age" min={16} max={100} placeholder="35" />
      <NumberInput
        label="Years of continuous service"
        value={pkg.yearsOfService}
        onChange={(v) => updatePkg("yearsOfService", v)}
        id="yearsOfService"
        min={0}
        max={20}
        tooltip="Complete years of continuous employment with this employer. Capped at 20 for statutory calculation. You need at least 2 years to qualify for statutory redundancy pay."
        placeholder="5"
      />

      {!estimate.qualifyingServiceMet && pkg.yearsOfService > 0 && (
        <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Under these assumptions, fewer than {UK_STATUTORY_REDUNDANCY.minServiceYears} years of service means no statutory redundancy entitlement. Notice pay and holiday pay are still included. Last checked: {UK_STATUTORY_REDUNDANCY.lastChecked}. Source: GOV.UK.
            </p>
          </div>
        </div>
      )}

      <GrossPayInput
        weeklyGrossPay={pkg.weeklyGrossPay}
        onWeeklyChange={(v) => updatePkg("weeklyGrossPay", v)}
        weeklyCapHint={`Gross pay before deductions. Statutory redundancy is capped at ${formatGBP(UK_STATUTORY_REDUNDANCY.weeklyPayCap)}/week for redundancies on or after ${UK_STATUTORY_REDUNDANCY.effectiveFrom}.`}
      />
      <NumberInput label="Notice period (weeks)" value={pkg.noticeWeeks} onChange={(v) => updatePkg("noticeWeeks", v)} id="noticeWeeks" min={0} max={52} tooltip="Contractual or statutory notice period in weeks. Notice pay is subject to income tax and National Insurance." />
      <NumberInput label="Accrued untaken holiday (weeks)" value={pkg.holidayWeeks} onChange={(v) => updatePkg("holidayWeeks", v)} id="holidayWeeks" min={0} max={10} tooltip="Untaken holiday to be paid out. Holiday pay is subject to income tax and National Insurance." />
      <CurrencyInput
        label="Unpaid wages (if any)"
        value={inputs.unpaidWages ?? 0}
        onChange={(v) => setInputs({ unpaidWages: v })}
        id="unpaidWages"
        tooltip="Any wages owed but not yet paid. These are subject to income tax and National Insurance."
      />

      <EnhancedPackageAssumptionChips
        pkg={pkg}
        selectedId={enhancedAssumptionId}
        onSelect={(patch, id) => {
          setEnhancedAssumptionId(id);
          setInputs((prev) => ({
            ...prev,
            redundancyPackage: { ...prev.redundancyPackage, ...patch },
          }));
        }}
      />
      <CurrencyInput
        label="Enhanced redundancy amount (optional override)"
        value={pkg.enhancedAmount}
        onChange={(v) => {
          setEnhancedAssumptionId(null);
          setInputs((prev) => ({
            ...prev,
            redundancyPackage: {
              ...prev.redundancyPackage,
              enhancedPackage: v > 0,
              enhancedAmount: v,
            },
          }));
        }}
        id="enhancedAmount"
        tooltip="Total enhanced redundancy payment (replaces the statutory redundancy element). Leave at £0 if you have no enhancement."
      />

      <div className="flex items-center justify-between gap-4 p-3 rounded-md bg-muted/50">
        <div>
          <p className="text-sm font-medium">Use actual package amount instead</p>
          <p className="text-xs text-muted-foreground">Override with a known confirmed total</p>
        </div>
        <Switch
          checked={pkg.useManualOverride}
          onCheckedChange={(v) => updatePkg("useManualOverride", v)}
          data-testid="switch-useManualOverride"
        />
      </div>

      {pkg.useManualOverride && (
        <CurrencyInput label="Confirmed package total" value={pkg.manualOverrideAmount} onChange={(v) => updatePkg("manualOverrideAmount", v)} id="manualOverrideAmount" tooltip="The total redundancy package amount you have been offered or received" />
      )}

      {isVoluntaryRedundancy && (
        <CurrencyInput
          label="Voluntary redundancy offer amount"
          value={inputs.voluntaryRedundancyAmount ?? 0}
          onChange={(v) => setInputs({ voluntaryRedundancyAmount: v })}
          id="voluntaryRedundancyAmount"
          tooltip="The VR package being offered. The full report will compare this against your statutory entitlement under these assumptions."
        />
      )}

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mt-4 space-y-3" data-testid="panel-redundancy-summary">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Your estimated statutory redundancy pay</p>
          <p className="text-2xl font-bold text-primary tabular-nums" data-testid="text-statutory-reveal">
            {estimate.qualifyingServiceMet ? formatGBP(estimate.statutoryRedundancy) : formatGBP(0)}
          </p>
        </div>
        <p className="text-sm font-semibold text-foreground" data-testid="text-redundancy-total">
          Estimated package total: {formatGBP(estimate.totalEstimated)}
        </p>
        <p className="text-xs text-muted-foreground" data-testid="text-redundancy-breakdown">
          Notice pay: {formatGBP(estimate.noticePay)} · Holiday pay: {formatGBP(estimate.holidayPay)}
        </p>
        {!hasPackageDetails && pkg.weeklyGrossPay > 0 && (
          <p className="text-xs text-primary font-medium">
            Add notice, holiday or enhanced package details to build the full picture — or continue to see how long it could last.
          </p>
        )}
        <div className="rounded-md bg-amber-500/8 border border-amber-500/15 p-2.5">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Tax treatment note:</span> Statutory redundancy pay up to {formatGBP(UK_STATUTORY_REDUNDANCY.taxFreeThreshold)} is generally tax-free. Notice pay, holiday pay and unpaid wages are subject to income tax and National Insurance. This tool does not calculate exact personal tax liability — the amounts above are gross figures. Last checked: {UK_STATUTORY_REDUNDANCY.lastChecked}. Source: GOV.UK.
          </p>
        </div>
      </div>
    </div>
  );
}
