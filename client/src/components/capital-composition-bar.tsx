import { fmtK } from "@/lib/chart-theme";

interface CompositionSegment {
  label: string;
  value: number;
  color: string;
}

interface CapitalCompositionBarProps {
  segments: CompositionSegment[];
  className?: string;
  locked?: boolean;
}

/** Segmented horizontal bar — uses flex ratios so segments render at correct proportions. */
export function CapitalCompositionBar({ segments, className = "", locked = false }: CapitalCompositionBarProps) {
  const filtered = segments.filter((s) => s.value > 0);
  const total = filtered.reduce((s, c) => s + c.value, 0);
  if (total <= 0) return null;

  return (
    <div
      className={`flex w-full h-5 rounded-full overflow-hidden bg-slate-100 border border-slate-200/80 shadow-inner ${className}`}
      role="img"
      aria-label="Capital composition bar chart"
      data-testid="capital-composition-bar"
    >
      {filtered.map((c) => (
        <div
          key={c.label}
          className={`h-full transition-[flex-grow] duration-700 ease-out ${locked ? "opacity-80" : ""}`}
          style={{
            flexGrow: c.value,
            flexBasis: 0,
            minWidth: "6px",
            backgroundColor: c.color,
          }}
          title={`${c.label}: ${fmtK(c.value)} (${Math.round((c.value / total) * 100)}%)`}
        />
      ))}
    </div>
  );
}

export function CapitalCompositionLegend({
  segments,
  locked = false,
  maxItems = 4,
}: {
  segments: CompositionSegment[];
  locked?: boolean;
  maxItems?: number;
}) {
  const filtered = segments.filter((s) => s.value > 0).slice(0, maxItems);
  if (filtered.length === 0) return null;

  return (
    <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
      {filtered.map((c) => (
        <div key={c.label} className="flex items-center gap-1.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-sm shrink-0 ring-1 ring-black/5" style={{ background: c.color }} />
          <div className="min-w-0">
            <p className={`text-[10px] text-slate-700 font-semibold tabular-nums truncate ${locked ? "blur-[5px] select-none" : ""}`}>
              {fmtK(c.value)}
            </p>
            <p className="text-[9px] text-slate-500 truncate">{c.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
