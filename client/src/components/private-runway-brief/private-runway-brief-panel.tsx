import { useState, useCallback } from "react";
import { Link } from "wouter";
import type { RunwayInputs } from "@shared/schema";
import type { PrivateRunwayBriefNarrative } from "@/lib/private-runway-brief/types";
import { buildPayload } from "@/lib/private-runway-brief/buildPayload";
import { buildBriefDashboardData } from "@/lib/private-runway-brief/buildBriefDashboardData";
import { formatBriefPlainText } from "@/lib/private-runway-brief/formatBriefPlainText";
import { usePrivateRunwayBrief } from "@/hooks/use-private-runway-brief";
import { getSessionToken } from "@/lib/sessionToken";
import { PrivateRunwayBriefReport } from "./private-runway-brief-report";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  FileText,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Printer,
  Loader2,
  LayoutDashboard,
} from "lucide-react";
import { RUNWAY_BRIEF_NAME } from "@shared/product";

function ConfidenceBadge({ inputs }: { inputs: RunwayInputs }) {
  const dashboard = buildBriefDashboardData(inputs);
  const cls =
    dashboard.confidence === "High"
      ? "bg-teal-50 text-teal-700 border-teal-200"
      : dashboard.confidence === "Medium"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-rose-50 text-rose-700 border-rose-200";
  return (
    <Badge variant="outline" className={`${cls} text-xs font-medium`}>
      {dashboard.confidenceDisplayLabel}
    </Badge>
  );
}

interface PrivateRunwayBriefPanelProps {
  inputs: RunwayInputs;
}

export function PrivateRunwayBriefPanel({ inputs }: PrivateRunwayBriefPanelProps) {
  const { narrative, status, setStatus, isStale, saveBrief, fingerprint } = usePrivateRunwayBrief(inputs);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(async () => {
    setErrorMessage(null);
    setStatus("loading");
    try {
      const payload = buildPayload(inputs);
      const res = await fetch("/api/private-runway-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken: getSessionToken(), payload }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Request failed (${res.status})`);
      }
      const data: { narrative: PrivateRunwayBriefNarrative } = await res.json();
      saveBrief(data.narrative, fingerprint);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMessage(msg);
      setStatus(narrative ? "stale" : "error");
    }
  }, [inputs, fingerprint, saveBrief, setStatus, narrative]);

  const handleGenerate = () => {
    if (narrative && (status === "done" || status === "stale")) {
      setConfirmRegenerate(true);
    } else {
      generate();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    if (!narrative) return;
    await navigator.clipboard.writeText(formatBriefPlainText(inputs, narrative));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showReport = narrative && (status === "done" || status === "stale");

  return (
    <div className="space-y-5" data-testid="section-private-runway-brief">
      <div className="bg-gradient-to-r from-primary to-[hsl(220_52%_28%)] rounded-xl px-5 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gold/20 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-gold" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">{RUNWAY_BRIEF_NAME}</h2>
            <p className="text-xs text-white/50 mt-0.5">
              Your Command Centre shows the model. Your Brief explains the figures in plain English.
            </p>
          </div>
        </div>
        <ConfidenceBadge inputs={inputs} />
      </div>

      {isStale && narrative && (
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200"
          data-testid="banner-brief-stale"
        >
          <p className="text-sm text-amber-900">
            Your assumptions have changed. Regenerate your {RUNWAY_BRIEF_NAME} to reflect the latest figures.
          </p>
          <Button size="sm" variant="outline" className="border-amber-300 shrink-0" onClick={() => setConfirmRegenerate(true)}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Regenerate brief
          </Button>
        </div>
      )}

      {status === "idle" || (status === "error" && !narrative) ? (
        <Card className="border-gold/20" data-testid="card-brief-generate">
          <CardContent className="p-5 space-y-4">
            {errorMessage && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-sm text-rose-700">{errorMessage}</p>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-2 text-xs">
              {[
                "Dashboard metric cards",
                "Runway path chart",
                "Scenario range bars",
                "Capital composition",
                "Monthly pressure map",
                "Sensitivity drivers",
                "Assumption checklist",
                "Professional questions",
              ].map((label) => (
                <div key={label} className="flex items-center gap-2 text-foreground/70">
                  <span className="w-1 h-1 rounded-full bg-gold" />
                  {label}
                </div>
              ))}
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-primary/5 border border-primary/10">
              <Sparkles className="w-4 h-4 text-primary/60 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Only de-identified model figures are sent when you click generate — no names, contact details, employers or documents. Stored locally in your browser only.
              </p>
            </div>
            <Button className="btn-gold" onClick={handleGenerate} data-testid="button-generate-brief">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate {RUNWAY_BRIEF_NAME}
            </Button>
            <p className="text-[10px] text-muted-foreground">Usually takes 10–20 seconds · Max 3 generations per hour</p>
          </CardContent>
        </Card>
      ) : status === "loading" ? (
        <Card className="border-gold/20" data-testid="card-brief-loading">
          <CardContent className="p-6 flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Generating your {RUNWAY_BRIEF_NAME} — this usually takes 10–20 seconds…</p>
          </CardContent>
        </Card>
      ) : null}

      {showReport && narrative && (
        <>
          <div
            className="sticky top-0 z-20 flex flex-wrap gap-2 p-3 -mx-1 mb-2 bg-background/95 backdrop-blur border border-gold/20 rounded-lg print:hidden"
            data-testid="brief-action-bar"
          >
            <Button variant="outline" size="sm" onClick={handlePrint} data-testid="button-brief-print">
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy} data-testid="button-brief-copy">
              {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
              {copied ? "Copied" : "Copy summary"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setConfirmRegenerate(true)} data-testid="button-brief-regenerate">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Regenerate brief
            </Button>
            <Link href="/results">
              <Button variant="outline" size="sm" data-testid="button-brief-command-centre">
                <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
                Command Centre
              </Button>
            </Link>
          </div>
          <PrivateRunwayBriefReport inputs={inputs} narrative={narrative} />
        </>
      )}

      <AlertDialog open={confirmRegenerate} onOpenChange={setConfirmRegenerate}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate {RUNWAY_BRIEF_NAME}?</AlertDialogTitle>
            <AlertDialogDescription>
              Regenerating will replace the current brief with a new version based on your latest figures.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmRegenerate(false);
                generate();
              }}
            >
              Regenerate brief
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
