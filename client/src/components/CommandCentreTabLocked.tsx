import { Link } from "wouter";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMMAND_CENTRE_NAME, PRODUCT_COPY } from "@shared/product";

interface CommandCentreTabLockedProps {
  tabLabel: string;
  teaser: string;
  unlockHref?: string;
}

export function CommandCentreTabLocked({
  tabLabel,
  teaser,
  unlockHref = "/unlock",
}: CommandCentreTabLockedProps) {
  return (
    <div
      className="rounded-xl border border-amber-200/70 bg-gradient-to-br from-amber-50/50 to-white p-8 text-center"
      data-testid="command-centre-tab-locked"
    >
      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
        <Lock className="w-5 h-5 text-amber-700" />
      </div>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{COMMAND_CENTRE_NAME}</p>
      <p className="text-base font-semibold text-primary mb-2">{tabLabel}</p>
      <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-5">{teaser}</p>
      <Link href={unlockHref}>
        <Button className="btn-gold" size="sm" data-testid="button-unlock-command-tab">
          {PRODUCT_COPY.unlockCta}
        </Button>
      </Link>
      <p className="text-[10px] text-muted-foreground mt-3">{PRODUCT_COPY.unlockSupportingLine}</p>
    </div>
  );
}
