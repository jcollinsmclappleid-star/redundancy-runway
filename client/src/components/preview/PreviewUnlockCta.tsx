import { useLocation } from "wouter";
import { Check, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PRODUCT_COPY, RUNWAY_REPORT_PRICE_GBP } from "@shared/product";
import { DASHBOARD_DISCLAIMER } from "@shared/complianceCopy";

export function PreviewUnlockCta() {
  const [, navigate] = useLocation();

  return (
    <Card className="border-primary/20 bg-surface" data-testid="card-unlock-cta">
      <CardContent className="pt-8 pb-8 text-center">
        <h3 className="font-display font-semibold text-xl mb-2">{PRODUCT_COPY.unlockHeadline}</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">{PRODUCT_COPY.unlockSubcopy}</p>
        <ul className="text-xs text-muted-foreground max-w-md mx-auto mb-6 space-y-1.5 text-left">
          {PRODUCT_COPY.unlockOutcomes.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
        <Button className="btn-gold w-full max-w-sm" onClick={() => navigate("/unlock")} data-testid="button-unlock">
          Unlock full report — £{RUNWAY_REPORT_PRICE_GBP}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <p className="text-xs text-muted-foreground mt-4 max-w-sm mx-auto leading-relaxed">
          {PRODUCT_COPY.unlockSupportingLine} {DASHBOARD_DISCLAIMER}
        </p>
      </CardContent>
    </Card>
  );
}
