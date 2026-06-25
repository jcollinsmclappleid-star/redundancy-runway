import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthProjection } from "@shared/schema";
import { chartTheme } from "@/lib/chart-theme";
import { formatGBP } from "@/lib/engine";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";

interface PathScenario {
  scenarioKey: string;
  name: string;
  projections: MonthProjection[];
  color: string;
}

interface RunwayPathChartProps {
  scenarios: PathScenario[];
  commentary?: string;
}

export function RunwayPathChart({ scenarios, commentary }: RunwayPathChartProps) {
  const { chartData, displayMax } = useMemo(() => {
    const maxMonth = Math.min(
      60,
      Math.max(
        ...scenarios.flatMap((s) => {
          const depletion = s.projections.findIndex((p) => p.capital <= 0);
          return depletion > 0 ? depletion + 3 : 36;
        }),
        12,
      ),
    );

    const data = Array.from({ length: maxMonth + 1 }, (_, month) => {
      const point: Record<string, number> = { month };
      for (const s of scenarios) {
        const proj = s.projections.find((p) => p.month === month);
        point[s.scenarioKey] = proj?.capital ?? 0;
      }
      return point;
    });

    return { chartData: data, displayMax: maxMonth };
  }, [scenarios]);

  if (scenarios.length === 0) return null;

  return (
    <DashboardPanel
      title="Runway path"
      subtitle="Capital over time under each scenario — deterministic model output"
      testId="brief-runway-path-chart"
    >
      <ResponsiveContainer width="100%" height={280} className="print:bg-white">
        <LineChart data={chartData} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.color.grid} />
          <XAxis
            dataKey="month"
            tickFormatter={(v) => `M${v}`}
            tick={{ fill: "#64748b", fontSize: 11 }}
            domain={[0, displayMax]}
          />
          <YAxis tickFormatter={(v) => formatGBP(v)} tick={{ fill: "#64748b", fontSize: 11 }} width={72} />
          <RechartsTooltip
            formatter={(value: number, name: string) => {
              const scenario = scenarios.find((s) => s.scenarioKey === name);
              return [formatGBP(value), scenario?.name ?? name];
            }}
            labelFormatter={(label) => `Month ${label}`}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
            formatter={(value) => scenarios.find((s) => s.scenarioKey === value)?.name ?? value}
          />
          {scenarios.map((s) => (
            <Line
              key={s.scenarioKey}
              type="monotone"
              dataKey={s.scenarioKey}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              name={s.scenarioKey}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {commentary && (
        <div className="mt-4 p-3 rounded-lg border border-gold/15 bg-[hsl(40_30%_98%)]">
          <p className="text-[10px] uppercase tracking-wider text-gold font-semibold mb-1">What the range shows</p>
          <p className="text-sm text-foreground/80 leading-relaxed">{commentary}</p>
        </div>
      )}
    </DashboardPanel>
  );
}
