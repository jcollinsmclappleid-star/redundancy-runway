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
import { ArrowRight, CheckCircle, Loader2, Lock } from "lucide-react";
import { Link } from "wouter";
import {
  COMMAND_CENTRE_NAME,
  PRODUCT_COPY,
  PRIVACY_COPY,
  RUNWAY_BRIEF_NAME,
  RUNWAY_REPORT_FULL,
  RUNWAY_REPORT_PRICE_GBP,
} from "@shared/product";
import { useWizardStore } from "@/lib/wizardStore";
import { LockedPackagePreviewGrid } from "@/components/package-dashboard/LockedPackagePreviewGrid";

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
        <SiteHeader />
        <main className="flex-1 px-6 py-12">
          <div className="max-w-3xl mx-auto space-y-8">
          <Card className="w-full border-gold/30">
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-6">
                <Lock className="w-10 h-10 text-gold mx-auto mb-4" />
                <h1 className="font-serif text-2xl font-bold mb-2">{PRODUCT_COPY.unlockHeadline}</h1>
                <p className="text-sm text-muted-foreground">
                  {RUNWAY_REPORT_FULL} — £{RUNWAY_REPORT_PRICE_GBP}. One payment unlocks the {COMMAND_CENTRE_NAME} and a plain-English {RUNWAY_BRIEF_NAME} from your figures.
                </p>
              </div>

              <p className="text-sm text-center text-foreground/80 mb-4 px-2">
                {PRODUCT_COPY.dualProductLine}
              </p>

              <ul className="text-xs text-muted-foreground space-y-2 mb-6 px-2">
                {PRODUCT_COPY.unlockModules.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="text-3xl font-bold text-center mb-1">£{RUNWAY_REPORT_PRICE_GBP}</p>
              <p className="text-xs text-muted-foreground text-center mb-6">One-off payment · 6 months access · Return on any device via email sign-in</p>
              <p className="text-xs text-muted-foreground text-center mb-6 px-2 leading-relaxed">{PRIVACY_COPY.exportDelivery}</p>
              <Button className="btn-gold w-full" onClick={startCheckout} disabled={checkingOut} data-testid="button-unlock-checkout">
                {checkingOut ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redirecting…</> : <>{PRODUCT_COPY.fullScenarioCta} <ArrowRight className="w-4 h-4 ml-2" /></>}
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
