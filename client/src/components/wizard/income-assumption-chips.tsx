import { Briefcase, PiggyBank, UserX } from "lucide-react";

interface IncomeAssumptionChipsProps {
  onSelect: (patch: {
    replacementMonthlyIncome?: number;
    benefitSupportEstimate?: number;
  }) => void;
}

const CHIPS = [
  {
    id: "zero-gap",
    label: "No gap income",
    sub: "Model zero replacement income",
    icon: UserX,
    color: "#EF4444",
    patch: { replacementMonthlyIncome: 0, benefitSupportEstimate: 0 },
  },
  {
    id: "part-time",
    label: "Part-time ~£1,200/mo",
    sub: "Typical part-time net income",
    icon: Briefcase,
    color: "#06B6D4",
    patch: { replacementMonthlyIncome: 1200, benefitSupportEstimate: 0 },
  },
  {
    id: "benefits-estimate",
    label: "Benefits ~£350/mo",
    sub: "Planning assumption only",
    icon: PiggyBank,
    color: "#8B5CF6",
    patch: { benefitSupportEstimate: 350 },
  },
] as const;

export function IncomeAssumptionChips({ onSelect }: IncomeAssumptionChipsProps) {
  return (
    <div className="space-y-3" data-testid="income-assumption-chips">
      <div className="p-3 rounded-lg border-l-4 border-cyan-300 bg-muted/40">
        <p className="text-sm font-medium text-foreground mb-1">Common gap-period assumptions</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Tap to apply a starting assumption. Eligibility for benefits is not assessed here — use as a planning figure only.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {CHIPS.map((chip) => {
          const Icon = chip.icon;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onSelect(chip.patch)}
              className="rounded-lg border border-border bg-muted/40 p-3 text-left hover:border-primary/30 hover:bg-muted/60 transition-all"
              data-testid={`chip-income-${chip.id}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="w-3.5 h-3.5" style={{ color: chip.color }} />
                <span className="text-xs font-semibold text-foreground">{chip.label}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">{chip.sub}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
