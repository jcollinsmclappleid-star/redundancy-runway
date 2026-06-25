import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatGBP } from "@/lib/engine";
import { chartTheme } from "@/lib/chart-theme";
import { CapitalCompositionBar, CapitalCompositionLegend } from "@/components/capital-composition-bar";

const COLORS = [chartTheme.color.s1, chartTheme.color.s2, chartTheme.color.cash, chartTheme.color.s3];

interface CapitalCompositionChartProps {
  segments: { name: string; value: number }[];
}

export function CapitalCompositionChart({ segments }: CapitalCompositionChartProps) {
  const data = segments.filter((s) => s.value > 0);
  if (data.length === 0) return null;
  const total = data.reduce((s, d) => s + d.value, 0);

  const barSegments = data.map((d, i) => ({
    label: d.name,
    value: d.value,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="w-full space-y-4" data-testid="capital-composition-chart">
      <CapitalCompositionBar segments={barSegments} />
      <CapitalCompositionLegend segments={barSegments} maxItems={6} />

      <div className="hidden sm:block">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              stroke="#fff"
              strokeWidth={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: number) => formatGBP(v)}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[10px] text-center text-muted-foreground sm:hidden">
        Total modelled capital: {formatGBP(total)}
      </p>
    </div>
  );
}
