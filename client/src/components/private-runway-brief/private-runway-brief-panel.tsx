import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { RunwayInputs } from "@shared/schema";
import type { PrivateRunwayBriefNarrative } from "@/lib/private-runway-brief/types";
import type { BriefNarrativeLite } from "@/lib/private-runway-brief/briefDocumentTypes";
import { buildPayload } from "@/lib/private-runway-brief/buildPayload";
import { buildBriefDashboardData } from "@/lib/private-runway-brief/buildBriefDashboardData";
import { buildBriefDocument } from "@/lib/private-runway-brief/buildBriefDocument";
import { buildTemplateNarrativeForPanels } from "@/lib/private-runway-brief/buildBriefDocument";
import { formatBriefPlainText } from "@/lib/private-runway-brief/formatBriefPlainText";
import { usePrivateRunwayBrief } from "@/hooks/use-private-runway-brief";
import { getSessionToken } from "@/lib/sessionToken";
import { PrivateRunwayBriefReport } from "./private-runway-brief-report";
import { Button } from "@/components/ui/button";
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
import { RUNWAY_BRIEF_NAME, PRIVACY_COPY, BRIEF_OPENAI_CONSENT_KEY } from "@shared/product";
import type { BriefAiMode } from "@shared/briefAiPolicy";
import { useAccess } from "@/hooks/use-access";

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
  prefilledNarrative?: PrivateRunwayBriefNarrative;
  prefilledLite?: BriefNarrativeLite;
  demoMode?: boolean;
}

export function PrivateRunwayBriefPanel({
  inputs,
  prefilledNarrative,
  prefilledLite,
  demoMode = false,
}: PrivateRunwayBriefPanelProps) {
  const { hasAccess: paidAccess } = useAccess();
  const hasPaidAccess = demoMode ? false : paidAccess;

  const {
    narrative: storedNarrative,
    narrativeLite: storedLite,
    status,
    setStatus,
    isStale,
    saveBrief,
    saveBriefLite,
    fingerprint,
  } = usePrivateRunwayBrief(inputs);

  const narrativeLite = prefilledLite ?? storedLite;
  const legacyNarrative = prefilledNarrative ?? storedNarrative;

  const { data: briefConfig } = useQuery<{ aiMode: BriefAiMode }>({
    queryKey: ["/api/brief-config"],
    queryFn: async () => {
      const res = await fetch("/api/brief-config");
      if (!res.ok) return { aiMode: "lite" as const };
      return res.json();
    },
    staleTime: 300_000,
  });

  const aiMode = briefConfig?.aiMode ?? "lite";
  const showAiEnhance = aiMode !== "off" && !prefilledNarrative && hasPaidAccess;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);
  const [showOpenAiConsent, setShowOpenAiConsent] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasOpenAiConsent = () => {
    try {
      return localStorage.getItem(BRIEF_OPENAI_CONSENT_KEY) === "1";
    } catch {
      return false;
    }
  };

  const saveOpenAiConsent = () => {
    try {
      localStorage.setItem(BRIEF_OPENAI_CONSENT_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const enhanceSummary = useCallback(async () => {
    setErrorMessage(null);
    setStatus("loading");
    try {
      const payload = buildPayload(inputs);
      const res = await fetch("/api/private-runway-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken: getSessionToken(), payload }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message ?? `Request failed (${res.status})`);

      if (data.narrativeLite) {
        saveBriefLite(data.narrativeLite as BriefNarrativeLite, fingerprint);
      } else if (data.narrative) {
        saveBrief(data.narrative as PrivateRunwayBriefNarrative, fingerprint);
      } else {
        throw new Error("Unexpected brief response");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMessage(msg);
      setStatus(narrativeLite ? "stale" : "error");
    }
  }, [inputs, fingerprint, saveBrief, saveBriefLite, setStatus, narrativeLite]);

  const handleEnhance = () => {
    if (!hasOpenAiConsent()) {
      setShowOpenAiConsent(true);
      return;
    }
    if (narrativeLite && (status === "done" || status === "stale")) {
      setConfirmRegenerate(true);
    } else {
      enhanceSummary();
    }
  };

  const handleOpenAiConsent = () => {
    saveOpenAiConsent();
    setShowOpenAiConsent(false);
    if (narrativeLite && (status === "done" || status === "stale")) {
      setConfirmRegenerate(true);
    } else {
      enhanceSummary();
    }
  };

  const handlePrint = () => window.print();

  const handleCopy = async () => {
    const dashboard = buildBriefDashboardData(inputs);
    const document = buildBriefDocument(inputs, { narrativeLite: narrativeLite ?? undefined });
    const panelNarrative =
      legacyNarrative ?? buildTemplateNarrativeForPanels(inputs, document, dashboard);
    await navigator.clipboard.writeText(formatBriefPlainText(inputs, panelNarrative));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              Structured report from your figures — expert guidance, interactive navigation.
            </p>
          </div>
        </div>
        <ConfidenceBadge inputs={inputs} />
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700">{errorMessage}</p>
        </div>
      )}

      {isStale && !prefilledNarrative && (
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200"
          data-testid="banner-brief-stale"
        >
          <p className="text-sm text-amber-900">
            Your assumptions have changed. The report below updates automatically; re-enhance the executive summary if you use AI.
          </p>
        </div>
      )}

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
        {showAiEnhance && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleEnhance}
            disabled={status === "loading"}
            data-testid="button-brief-enhance"
          >
            {status === "loading" ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            )}
            {narrativeLite?.aiEnhanced ? "Re-enhance summary" : "Enhance summary (optional)"}
          </Button>
        )}
        <Link href="/results">
          <Button variant="outline" size="sm" data-testid="button-brief-command-centre">
            <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
            Command Centre
          </Button>
        </Link>
      </div>

      {!prefilledNarrative && aiMode === "off" && (
        <p className="text-xs text-muted-foreground print:hidden">
          Report built from expert templates and your model figures. AI enhancement is off.
        </p>
      )}

      {showAiEnhance && hasOpenAiConsent() && (
        <p className="text-xs text-muted-foreground print:hidden" data-testid="brief-openai-notice">
          Optional AI enhancement uses OpenAI with de-identified model figures only — not your name or employer.
        </p>
      )}

      <PrivateRunwayBriefReport
        inputs={inputs}
        narrative={legacyNarrative}
        narrativeLite={narrativeLite}
        demoMode={demoMode}
      />

      <AlertDialog open={showOpenAiConsent} onOpenChange={setShowOpenAiConsent}>
        <AlertDialogContent data-testid="dialog-brief-openai-consent">
          <AlertDialogHeader>
            <AlertDialogTitle>{PRIVACY_COPY.briefOpenAiConsentTitle}</AlertDialogTitle>
            <AlertDialogDescription className="text-left space-y-3">
              <span className="block">{PRIVACY_COPY.briefOpenAi}</span>
              <span className="block text-muted-foreground">
                You only need to confirm this once on this device. The report works without AI — templates and your figures always render the numbers.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not now</AlertDialogCancel>
            <AlertDialogAction onClick={handleOpenAiConsent} data-testid="button-brief-openai-consent">
              I understand — enhance summary
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmRegenerate} onOpenChange={setConfirmRegenerate}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Re-enhance executive summary?</AlertDialogTitle>
            <AlertDialogDescription>
              This replaces only the AI executive headline and key observations. The rest of the report stays on expert templates and your figures.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmRegenerate(false);
                enhanceSummary();
              }}
            >
              Re-enhance
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
