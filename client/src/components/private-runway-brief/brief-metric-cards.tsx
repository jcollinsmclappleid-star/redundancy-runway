import { Card, CardContent } from "@/components/ui/card";

interface MetricCard {
  label: string;
  value: string;
  context?: string;
}

export function BriefMetricCards({ metrics }: { metrics: MetricCard[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" data-testid="brief-metric-cards">
      {metrics.slice(0, 4).map((m) => (
        <Card key={m.label} className="border-gold/20 bg-white shadow-sm rounded-xl">
          <CardContent className="pt-4 pb-4 px-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">{m.label}</p>
            <p className="text-xl font-bold text-primary tabular-nums">{m.value}</p>
            {m.context && (
              <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug line-clamp-2">{m.context}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
