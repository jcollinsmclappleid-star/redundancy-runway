import { useLocation } from "wouter";
import { Check, Lock, ArrowRight, TrendingUp, Shield, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PRODUCT_COPY, RUNWAY_REPORT_FULL, RUNWAY_REPORT_PRICE_GBP } from "@shared/product";

const PILLAR_ICONS = {
  package: TrendingUp,
  runway: Shield,
  brief: BookOpen,
} as const;

export function LandingWhatsIncluded() {
  const [, navigate] = useLocation();
  const pkg = PRODUCT_COPY.reportPackage;

  return (
    <section className="py-14 px-5 bg-surface border-b" id="whats-included" data-testid="section-whats-included">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">What you get</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">{pkg.sectionTitle}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed">{pkg.sectionSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,240px)_1fr] gap-5 items-start">
          <Card className="border shadow-sm h-full">
            <CardContent className="pt-6 pb-6">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                {pkg.free.label}
              </p>
              <p className="text-3xl font-bold mb-1">{pkg.free.price}</p>
              <p className="text-xs text-muted-foreground mb-5">{pkg.free.summary}</p>
              <ul className="space-y-2.5">
                {pkg.free.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-foreground/85">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full mt-6 rounded-lg btn-gold whitespace-normal h-auto min-h-10 py-2.5 inline-flex items-center justify-center text-center text-sm sm:text-base"
                onClick={() => navigate("/wizard")}
                data-testid="button-whats-included-free"
              >
                <span className="sm:hidden">{PRODUCT_COPY.buildCtaMobile}</span>
                <span className="hidden sm:inline">{PRODUCT_COPY.buildCta}</span>
              </Button>
            </CardContent>
          </Card>

          <Card
            className="border-2 shadow-lg overflow-hidden h-full"
            style={{ borderColor: "hsl(38 72% 52% / 0.55)" }}
            data-testid="card-full-report-package"
          >
            <div
              className="px-5 py-3 border-b"
              style={{ background: "linear-gradient(135deg, hsl(38 72% 52% / 0.12), hsl(40 30% 98%))" }}
            >
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                {pkg.paid.label}
              </p>
              <p className="text-sm font-semibold text-primary">{RUNWAY_REPORT_FULL}</p>
            </div>
            <CardContent className="pt-5 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pkg.paid.pillars.map((pillar) => {
                  const Icon = PILLAR_ICONS[pillar.id as keyof typeof PILLAR_ICONS];
                  return (
                    <div
                      key={pillar.id}
                      className="rounded-xl border border-slate-200 bg-white p-4"
                      data-testid={`package-pillar-${pillar.id}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-gold shrink-0" />
                        <p className="text-sm font-semibold text-primary">{pillar.title}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground mb-3">{pillar.tagline}</p>
                      <ul className="space-y-2">
                        {pillar.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-[11px] text-foreground/80 leading-snug">
                            <Check className="w-3 h-3 text-gold shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-4 leading-relaxed">
                {PRODUCT_COPY.positioningSupporting} · No outcome guarantees.
              </p>
              <div className="mt-5 pt-5 border-t border-slate-200/80 text-center space-y-3">
                <div>
                  <p className="text-2xl font-bold">{pkg.paid.price}</p>
                  <p className="text-[10px] text-muted-foreground">{pkg.paid.summary}</p>
                </div>
                <Button
                  className="btn-gold w-full rounded-lg whitespace-normal h-auto min-h-10 py-3 inline-flex items-center justify-center text-center text-sm sm:text-base"
                  onClick={() => navigate("/wizard")}
                  data-testid="button-whats-included-paid"
                >
                  <span className="sm:hidden">{PRODUCT_COPY.unlockCtaMobile}</span>
                  <span className="hidden sm:inline">{PRODUCT_COPY.unlockCta}</span>
                  <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3" />
          Paid tools unlock after your free preview — one-off payment, not a subscription.
        </p>
      </div>
    </section>
  );
}
