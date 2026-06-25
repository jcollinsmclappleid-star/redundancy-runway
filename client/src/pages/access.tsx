import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { setSessionToken } from "@/lib/sessionToken";
import type { RunwayInputs } from "@shared/schema";

export default function AccessPage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const [status, setStatus] = useState<"loading" | "success" | "preview" | "error">("loading");

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    async function restore() {
      try {
        const accessRes = await fetch(`/api/access/${encodeURIComponent(token!)}`);
        const accessData = await accessRes.json();

        const calcRes = await fetch(`/api/calculations/${encodeURIComponent(token!)}`);
        const calcData = calcRes.ok ? await calcRes.json() : { calculations: [] };
        const latest = calcData.calculations?.[0] as { inputs: RunwayInputs } | undefined;

        if (latest?.inputs) {
          setSessionToken(token!);
          window.localStorage.setItem("redundancy_runway_inputs", JSON.stringify(latest.inputs));
        } else if (accessData.hasAccess) {
          setSessionToken(token!);
        } else {
          setStatus("error");
          return;
        }

        if (accessData.hasAccess) {
          setStatus("success");
          setTimeout(() => navigate("/results"), 1200);
        } else {
          setStatus("preview");
        }
      } catch {
        setStatus("error");
      }
    }

    restore();
  }, [search, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DisclaimerBanner />
      <header className="border-b px-6 py-4">
        <div className="max-w-2xl mx-auto"><Logo showTagline /></div>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center space-y-4 max-w-sm">
          {status === "loading" && (
            <>
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
              <h1 className="font-serif text-xl font-semibold">Restoring your access…</h1>
            </>
          )}
          {status === "success" && (
            <>
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h1 className="font-serif text-xl font-semibold">Access restored</h1>
              <p className="text-sm text-muted-foreground">Opening your full report…</p>
            </>
          )}
          {status === "preview" && (
            <>
              <CheckCircle className="w-10 h-10 text-primary mx-auto" />
              <h1 className="font-serif text-xl font-semibold">Assumptions restored</h1>
              <p className="text-sm text-muted-foreground mb-4">Your saved figures are back. Unlock the full report to view all scenarios and download your summary.</p>
              <Button className="btn-gold w-full" onClick={() => navigate("/preview")}>Continue to preview</Button>
              <Button variant="outline" className="w-full" onClick={() => navigate("/unlock")}>Unlock full report — £39</Button>
            </>
          )}
          {status === "error" && (
            <>
              <AlertTriangle className="w-10 h-10 text-gold mx-auto" />
              <h1 className="font-serif text-xl font-semibold">Link not valid</h1>
              <p className="text-sm text-muted-foreground">This link may have expired or is not linked to an active purchase.</p>
              <Button className="w-full mt-2" onClick={() => navigate("/recover")}>Sign in or recover access</Button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
