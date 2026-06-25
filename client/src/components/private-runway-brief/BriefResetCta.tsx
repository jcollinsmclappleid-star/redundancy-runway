import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { PrivateRunwayBriefNarrative } from "@/lib/private-runway-brief/types";
import { RESET_CTA_DEFAULTS } from "@/lib/private-runway-brief/types";

interface BriefResetCtaProps {
  narrative: PrivateRunwayBriefNarrative;
}

export function BriefResetCta({ narrative }: BriefResetCtaProps) {
  const title = narrative.resetCta.title || RESET_CTA_DEFAULTS.title;
  const body = narrative.resetCta.body || RESET_CTA_DEFAULTS.body;

  return (
    <section className="break-inside-avoid" data-testid="brief-section-reset-cta">
      <Card className="border-2 border-gold/30 bg-gradient-to-br from-white to-[hsl(40_30%_98%)] rounded-xl">
        <CardContent className="pt-6 pb-6 text-center">
          <h3 className="font-serif text-base font-semibold text-primary mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-4 leading-relaxed">{body}</p>
          <Link href="/redundancy-reset">
            <Button variant="outline" size="sm" className="border-gold/40 btn-gold" data-testid="button-brief-reset-cta">
              {RESET_CTA_DEFAULTS.label}
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
          <p className="text-[10px] text-muted-foreground/70 mt-3">
            Separate paid service · Human-written support · Not part of this AI brief
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
