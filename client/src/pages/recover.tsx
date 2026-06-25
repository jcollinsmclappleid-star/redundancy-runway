import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, CheckCircle, AlertTriangle, Loader2, Receipt, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { useAccess } from "@/hooks/use-access";

type RecoverMode = "email" | "order";
type RecoverState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "sent"; email?: string; maskedEmail?: string }
  | { status: "not_found" }
  | { status: "no_email" }
  | { status: "error"; message: string };

const ERROR_MESSAGES: Record<string, string> = {
  invalid_link: "That sign-in link isn't valid.",
  link_used: "That link has already been used. Request a new one below.",
  link_expired: "That link has expired. Request a fresh sign-in link.",
  server_error: "Something went wrong. Please try again.",
};

export default function RecoverPage() {
  const search = useSearch();
  const { logout } = useAccess();
  const [mode, setMode] = useState<RecoverMode>("email");
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [state, setState] = useState<RecoverState>({ status: "idle" });

  useEffect(() => {
    const params = new URLSearchParams(search);
    const error = params.get("error");
    if (error && ERROR_MESSAGES[error]) {
      setState({ status: "error", message: ERROR_MESSAGES[error] });
    }
  }, [search]);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/auth/send-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.status === 429) {
        setState({ status: "error", message: "Too many attempts. Please wait an hour." });
        return;
      }
      setState({ status: "sent", email: email.trim() });
    } catch {
      setState({ status: "error", message: "Connection error. Please try again." });
    }
  }

  async function handleOrderSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId.trim()) return;
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/access/recover-by-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkoutSessionId: orderId.trim() }),
      });
      const data = await res.json();
      if (!data.found) setState({ status: "not_found" });
      else if (data.noEmail) setState({ status: "no_email" });
      else setState({ status: "sent", maskedEmail: data.maskedEmail });
    } catch {
      setState({ status: "error", message: "Connection error. Please try again." });
    }
  }

  const isLoading = state.status === "loading";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DisclaimerBanner />
      <header className="border-b px-6 py-4">
        <div className="max-w-2xl mx-auto"><Logo showTagline /></div>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/60 text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
            <p><strong className="text-foreground">No password needed.</strong> Enter your checkout email for a one-click sign-in link. Works on any device for 6 months.</p>
          </div>
          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-6">
                <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
                <h1 className="font-serif text-2xl font-bold">Sign in to your report</h1>
                <p className="text-sm text-muted-foreground mt-2">Update your figures, view scenarios, and download your summary.</p>
              </div>
              <div className="flex rounded-lg border overflow-hidden mb-5">
                <button type="button" className={`flex-1 py-2 text-sm font-medium ${mode === "email" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`} onClick={() => { setMode("email"); setState({ status: "idle" }); }}>By email</button>
                <button type="button" className={`flex-1 py-2 text-sm font-medium border-l ${mode === "order" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`} onClick={() => { setMode("order"); setState({ status: "idle" }); }}>By order ref</button>
              </div>
              {state.status === "sent" ? (
                <div className="text-center space-y-3">
                  <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="font-medium">Check your inbox</p>
                  <p className="text-sm text-muted-foreground">
                    {state.maskedEmail
                      ? `We've sent a link to ${state.maskedEmail}.`
                      : `If we have a purchase for ${state.email}, a sign-in link is on its way.`}
                  </p>
                </div>
              ) : mode === "email" ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                  {state.status === "error" && (
                    <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md p-3">{state.message}</p>
                  )}
                  <Button type="submit" className="btn-gold w-full" disabled={isLoading || !email.trim()}>
                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…</> : "Send sign-in link"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <Input placeholder="cs_live_..." value={orderId} onChange={(e) => setOrderId(e.target.value)} required disabled={isLoading} />
                  {state.status === "not_found" && <p className="text-sm text-muted-foreground">Order not found. Check the reference from your Stripe receipt.</p>}
                  {state.status === "no_email" && <p className="text-sm text-muted-foreground">Order found but no email on file. Contact support@redundancycalculatoruk.co.uk</p>}
                  <Button type="submit" className="btn-gold w-full" disabled={isLoading || !orderId.trim()}>
                    {isLoading ? "Looking up…" : "Send access link"}
                  </Button>
                </form>
              )}
              <Button variant="ghost" size="sm" className="w-full mt-4 text-muted-foreground" onClick={() => logout()}>
                Sign out on this device
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
