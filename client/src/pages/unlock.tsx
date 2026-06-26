import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/SiteHeader";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Footer } from "@/components/Footer";
import { useAccess } from "@/hooks/use-access";
import { getSessionToken } from "@/lib/sessionToken";
import { ArrowRight, BookOpen, CheckCircle, Loader2, Lock, Shield, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import {
  PRODUCT_COPY,
  PRIVACY_COPY,
  REDUNDANCY_PAY_MAXIMISER_NAME,
  RUNWAY_REPORT_FULL,
  RUNWAY_REPORT_PRICE_GBP,
} from "@shared/product";
import { useWizardStore } from "@/lib/wizardStore";
import { LockedPackagePreviewGrid } from "@/components/package-dashboard/LockedPackagePreviewGrid";

const PAID_PILLAR_ICONS = {
  package: TrendingUp,
  runway: Shield,
  brief: BookOpen,
} as const;

export default function UnlockPage() {
  const [, navigate] = useLocation();
  const { inputs } = useWizardStore();
  const { hasAccess, isLoading } = useAccess();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && hasAccess) {
      navigate("/results");
    }
  }, [isLoading, hasAccess, navigate]);

  if (!isLoading && hasAccess) {
    return null;
  }

  const startCheckout = async () => {
    setCheckingOut(true);
    setError("");
    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken: getSessionToken() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Checkout failed");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout");
      setCheckingOut(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Unlock {RUNWAY_REPORT_FULL} — RedundancyCalculatorUK</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <DisclaimerBanner />
        <SiteHeader showCta={false} />
        <main className="flex-1 px-6 py-12">
          <div className="max-w-3xl mx-auto space-y-8">
          <Card className="w-full border-2 border-gold/40 overflow-hidden">
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-6">
                <Lock className="w-10 h-10 text-gold mx-auto mb-4" />
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  {RUNWAY_REPORT_FULL}
                </p>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold mb-2">
                  Unlock the {REDUNDANCY_PAY_MAXIMISER_NAME} and full private report.
                </h1>
                <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  Check what could be in your redundancy package, see how many months it may cover, and prepare questions before HR or signing.
                </p>
              </div>

              <div className="rounded-xl border border-gold/30 bg-gold/10 p-4 mb-5 text-center">
                <p className="text-sm font-semibold text-primary mb-1">Flagship unlock: {REDUNDANCY_PAY_MAXIMISER_NAME}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Map statutory, notice, holiday, enhanced pay and missing lines. See what to verify and how each package outcome could change your runway.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {PRODUCT_COPY.reportPackage.paid.pillars.map((pillar) => {
                  const Icon = PAID_PILLAR_ICONS[pillar.id as keyof typeof PAID_PILLAR_ICONS];
                  return (
                    <div key={pillar.id} className="rounded-xl border bg-white p-4" data-testid={`unlock-pillar-${pillar.id}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-gold shrink-0" />
                        <p className="text-sm font-semibold text-primary">{pillar.title}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground mb-3">{pillar.tagline}</p>
                      <ul className="space-y-1.5">
                        {pillar.items.slice(0, 5).map((item) => (
                          <li key={item} className="flex items-start gap-2 text-[11px] text-muted-foreground leading-snug">
                            <CheckCircle className="w-3 h-3 text-gold shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <p className="text-3xl font-bold text-center mb-1">£{RUNWAY_REPORT_PRICE_GBP}</p>
              <p className="text-xs text-muted-foreground text-center mb-6">One-off payment · 6 months access · Return on any device via email sign-in</p>
              <p className="text-xs text-muted-foreground text-center mb-6 px-2 leading-relaxed">{PRIVACY_COPY.exportDelivery}</p>
              <Button className="btn-gold w-full" onClick={startCheckout} disabled={checkingOut} data-testid="button-unlock-checkout">
                {checkingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Redirecting…
                  </>
                ) : (
                  <>
                    Unlock my maximiser and full report — £{RUNWAY_REPORT_PRICE_GBP}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              {error && <p className="text-xs text-destructive mt-3 text-center">{error}</p>}
              <Button variant="ghost" className="mt-4 text-sm text-primary underline w-full" onClick={() => navigate("/recover")}>
                Already purchased? Sign in
              </Button>
              <Button variant="ghost" className="w-full mt-2" onClick={() => navigate("/preview")}>
                Back to free preview
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-4 pt-4 border-t">
                Want to see a sample first?{" "}
                <Link href="/brief-example" className="text-primary underline font-medium">
                  View example brief
                </Link>
              </p>
            </CardContent>
          </Card>

          <LockedPackagePreviewGrid inputs={inputs} />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
