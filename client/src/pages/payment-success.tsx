import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAccess } from "@/hooks/use-access";
import { setSessionToken } from "@/lib/sessionToken";
import { COMMAND_CENTRE_NAME, RUNWAY_BRIEF_NAME } from "@shared/product";

export default function PaymentSuccessPage() {
  const [, navigate] = useLocation();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const { refresh } = useAccess();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (!sessionId) {
      navigate("/unlock");
      return;
    }

    async function verify() {
      try {
        const res = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkoutSessionId: sessionId }),
        });
        const data = await res.json();
        if (data.status === "paid" && data.sessionToken) {
          setSessionToken(data.sessionToken);
          setVerified(true);
          refresh();
        }
      } catch (err) {
        console.error("Verification error:", err);
      } finally {
        setVerifying(false);
      }
    }

    verify();
  }, [navigate, refresh]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <Logo showTagline />
          {verifying ? (
            <>
              <Loader2 className="w-12 h-12 animate-spin text-muted-foreground mx-auto" />
              <h2 className="text-xl font-semibold">Confirming your payment…</h2>
            </>
          ) : verified ? (
            <>
              <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto" />
              <h2 className="text-xl font-semibold">Payment confirmed</h2>
              <p className="text-sm text-muted-foreground">
                Your {COMMAND_CENTRE_NAME} and {RUNWAY_BRIEF_NAME} are unlocked for 6 months. A confirmation email is on its way with your access link.
              </p>
              <Button className="btn-gold w-full" onClick={() => navigate("/results")}>
                Open my report
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold">Payment not yet confirmed</h2>
              <p className="text-sm text-muted-foreground">
                If you were charged, access usually activates within a few minutes. You can also sign in at /recover with your checkout email.
              </p>
              <Button className="w-full" onClick={() => navigate("/recover")}>Recover access</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
