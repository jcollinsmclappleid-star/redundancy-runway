import { Columns3, Lock } from "lucide-react";
import { formatGBP, formatMonths } from "@/lib/engine";
import { RriGauge, RriGaugeLocked } from "@/components/rri-gauge";
import type { ScenarioComparison } from "@shared/schema";

interface ScenarioLeaderboardProps {
  scenarios: ScenarioComparison[];
  locked?: boolean;
  onUnlock?: () => void;
  title?: string;
  testId?: string;
}

export function ScenarioLeaderboard({
  scenarios,
  locked = false,
  onUnlock,
  title = "Income recovery paths",
  testId = "scenario-leaderboard",
}: ScenarioLeaderboardProps) {
  if (scenarios.length === 0) return null;
  const blur = locked ? "blur-[5px] select-none pointer-events-none" : "";
  const maxRunway = Math.max(...scenarios.map((s) => s.result.monthsUntilDepletion), 1);

  return (
    <div data-testid={testId}>
      <div className="rounded-2xl bg-white dark:bg-white border border-slate-200 dark:border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Columns3 className="w-4 h-4 text-gold" />
            <p className="text-[12px] font-bold text-[#1a3357] tracking-tight">{title}</p>
            <span className="text-[10px] text-slate-500 font-mono">side-by-side</span>
          </div>
          {locked && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300/60 px-2 py-0.5 rounded-full">
              <Lock className="w-2.5 h-2.5" /> Preview locked
            </span>
          )}
        </div>

        <div className="px-4 py-2.5 bg-white border-b border-slate-100">
          <p className="text-[10px] text-slate-500 leading-snug">
            Each row shows one income recovery path under the assumptions you entered. No path is presented as recommended.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {scenarios.map((s, i) => {
            const runway = s.result.monthsUntilDepletion;
            const barPct = Math.min(100, (runway / maxRunway) * 100);
            return (
              <div key={i} className="px-4 py-3.5 hover:bg-slate-50/50 transition-colors" data-testid={`scenario-row-${i}`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#1a3357] truncate">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">{s.description}</p>
                  </div>
                  {locked ? <RriGaugeLocked size={88} /> : <RriGauge score={s.result.stabilityScore} size={88} animate={false} />}
                </div>
                <div className={`space-y-1 ${blur}`}>
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="text-muted-foreground">Runway</span>
                    <span className="font-bold tabular-nums">{formatMonths(runway)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden dark:bg-muted">
                    <div
                      className="h-full min-w-[4px] rounded-full transition-all duration-500"
                      style={{ width: `${barPct}%`, background: "hsl(var(--primary))" }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground gap-2">
                    <span>Monthly burn: {formatGBP(s.result.monthlyBurn)}</span>
                    <span>Ending capital: {formatGBP(s.result.projections[s.result.projections.length - 1]?.capital ?? 0)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {locked && onUnlock && (
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-center">
            <button
              type="button"
              onClick={onUnlock}
              className="text-xs font-semibold text-primary hover:underline"
              data-testid="button-leaderboard-unlock"
            >
              See full scenario analysis →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
