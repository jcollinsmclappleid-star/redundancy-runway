import { useMemo } from "react";
import { Briefcase, Ban, Calendar, HelpCircle, Layers, TrendingUp } from "lucide-react";
import { buildEnhancedPackageAssumptions, type EnhancedAssumptionId } from "@/lib/enhanced-package-assumptions";
import type { RedundancyPackageInputs } from "@shared/schema";

const CHIP_ICONS: Record<EnhancedAssumptionId, typeof Briefcase> = {
  none: Ban,
  "month-per-year": Calendar,
  "two-weeks-per-year": TrendingUp,
  "one-week-per-year": Briefcase,
  "three-months-flat": Layers,
  "unknown-default": HelpCircle,
};

const CHIP_COLORS: Record<EnhancedAssumptionId, string> = {
  none: "#64748B",
  "month-per-year": "#C9A84C",
  "two-weeks-per-year": "#06B6D4",
  "one-week-per-year": "#8B5CF6",
  "three-months-flat": "#10B981",
  "unknown-default": "#94A3B8",
};

interface EnhancedPackageChipsProps {
  pkg: RedundancyPackageInputs;
  selectedId?: EnhancedAssumptionId | null;
  onSelect: (
    patch: { enhancedPackage: boolean; enhancedAmount: number },
    id: EnhancedAssumptionId,
  ) => void;
}

export function EnhancedPackageAssumptionChips({ pkg, selectedId, onSelect }: EnhancedPackageChipsProps) {
  const assumptions = useMemo(() => buildEnhancedPackageAssumptions(pkg), [pkg]);
  const hasPay = pkg.weeklyGrossPay > 0;

  return (
    <div className="space-y-3" data-testid="enhanced-package-chips">
      <div className="p-3 rounded-lg border-l-4 border-gold/60 bg-muted/40">
        <p className="text-sm font-medium text-foreground mb-1">Common enhanced package assumptions</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {hasPay
            ? "Tap an assumption — amounts use your gross pay and years of service. Enhanced pay replaces the statutory redundancy element; notice and holiday are added separately."
            : "Enter gross pay first. If you are unsure, choose no enhanced package (£0) or a planning default."}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {assumptions.map((chip) => {
          const Icon = CHIP_ICONS[chip.id];
          const active = selectedId === chip.id;
          const disabled = !hasPay && chip.enhancedAmount > 0;
          return (
            <button
              key={chip.id}
              type="button"
              disabled={disabled}
              onClick={() =>
                onSelect(
                  { enhancedPackage: chip.enhancedPackage, enhancedAmount: chip.enhancedAmount },
                  chip.id,
                )
              }
              className={`rounded-lg border p-3 text-left transition-all ${
                active
                  ? "border-gold bg-gold/10 ring-1 ring-gold/40"
                  : "border-border bg-muted/40 hover:border-primary/30 hover:bg-muted/60"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              data-testid={`chip-enhanced-${chip.id}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: CHIP_COLORS[chip.id] }} />
                <span className="text-xs font-semibold text-foreground leading-snug">{chip.label}</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{chip.sub}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
