import { Lock } from "lucide-react";
import { RadialGauge } from "@/components/charts/radial-gauge";
import { gaugeColor } from "@/lib/chart-theme";

interface RriGaugeProps {
  score: number;
  size?: number;
  label?: string;
  animate?: boolean;
}

export function RriGauge({ score, size = 120, label, animate = true }: RriGaugeProps) {
  const c = gaugeColor(score);
  return (
    <RadialGauge
      score={score}
      size={size}
      label={label ?? c.label}
      tickMarks={size >= 90}
      animate={animate}
      testId="rri-gauge"
    />
  );
}

export function RriGaugeLocked({ size = 120 }: { size?: number }) {
  const height = size * 0.78;
  const cx = size / 2;
  const cy = size / 2 + size * 0.08;
  const r = size * 0.4;
  const sw = size * 0.085;
  const startA = Math.PI * 0.85;
  const endA = Math.PI * 2.15;
  const arc = () => {
    const sx = cx + r * Math.cos(startA);
    const sy = cy + r * Math.sin(startA);
    const ex = cx + r * Math.cos(endA);
    const ey = cy + r * Math.sin(endA);
    return `M ${sx} ${sy} A ${r} ${r} 0 1 1 ${ex} ${ey}`;
  };

  return (
    <div className="flex flex-col items-center gap-1" data-testid="rri-gauge-locked">
      <div className="relative">
        <svg width={size} height={height} viewBox={`0 0 ${size} ${height}`} className="opacity-50" aria-hidden>
          <path d={arc()} stroke="#E5E7EB" strokeWidth={sw} fill="none" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
          <Lock className="w-4 h-4 text-slate-400 mb-0.5" />
          <span className="text-[9px] font-semibold text-slate-400">Locked</span>
        </div>
      </div>
    </div>
  );
}
