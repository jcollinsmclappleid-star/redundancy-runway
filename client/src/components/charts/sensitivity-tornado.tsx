import { chartTheme } from "@/lib/chart-theme";
import { formatMonths } from "@/lib/engine";

export interface TornadoItem {
  label: string;
  baseRunway: number;
  adjustedRunway: number;
  difference: number;
}

export function SensitivityTornado({ items }: { items: TornadoItem[] }) {
  const maxAbs = Math.max(...items.map((i) => Math.abs(i.difference)), 0.1);

  return (
    <div className="space-y-3" data-testid="sensitivity-tornado">
      {items.map((item, i) => {
        const pct = (Math.abs(item.difference) / maxAbs) * 50;
        const negative = item.difference < 0;
        return (
          <div key={i} data-testid={`tornado-row-${i}`}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs text-[#1a3357] font-medium truncate flex-1">{item.label}</span>
              <span
                className={`text-xs font-bold tabular-nums shrink-0 ${negative ? "text-red-600" : item.difference > 0 ? "text-emerald-600" : "text-slate-500"}`}
              >
                {item.difference === 0 ? "—" : `${item.difference > 0 ? "+" : ""}${item.difference.toFixed(1)} mo`}
              </span>
            </div>
            <div className="relative h-3 rounded-full bg-slate-100 overflow-hidden">
              <div className="absolute inset-y-0 left-1/2 w-px bg-slate-300" />
              <div
                className="absolute top-0 bottom-0 rounded-full"
                style={{
                  width: `${pct}%`,
                  left: negative ? `${50 - pct}%` : "50%",
                  background: negative ? chartTheme.color.pressure : chartTheme.color.s2,
                }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 mt-0.5 tabular-nums">
              <span>{formatMonths(item.adjustedRunway)} adjusted</span>
              <span>Base {formatMonths(item.baseRunway)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
