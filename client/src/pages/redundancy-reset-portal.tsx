import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { ArrowLeft, Clock, Copy, Download, FileText, Loader2, MessageSquare, Printer, RefreshCw, Shield } from "lucide-react";

const BOUNDARY_NOTE = "This is practical written support only. It is not financial, legal, debt, employment, medical or mental health advice.";

type ResetStatus =
  | "Intake needed"
  | "Intake submitted"
  | "First response in preparation"
  | "Reply 1 ready"
  | "Follow-up check-in ready"
  | "Final plan ready"
  | "Closed"
  | "Signposting needed";

interface PortalReset {
  portalToken: string;
  name: string;
  contactMethod: string;
  intakeAnswers: Record<string, string>;
  status: ResetStatus;
  riskFlags: Record<string, unknown>;
  reply1: Record<string, string>;
  followUp: Record<string, string>;
  finalPlan: Record<string, string>;
  submittedAt?: string;
  reply1ReadyAt?: string;
  followUpReadyAt?: string;
  finalPlanReadyAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

function usePortalToken() {
  const [location] = useLocation();
  return useMemo(() => {
    const parts = location.split("/").filter(Boolean);
    const portalIdx = parts.indexOf("portal");
    if (portalIdx >= 0 && parts[portalIdx + 1]) return parts[portalIdx + 1];
    return parts[parts.length - 1] ?? "";
  }, [location]);
}

function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function hasContent(record?: Record<string, unknown>) {
  return !!record && Object.values(record).some((value) => String(value ?? "").trim().length > 0);
}

const reply1Labels: Record<string, string> = {
  hearing: "What I'm hearing",
  important: "What seems most important",
  notPanic: "What not to panic about yet",
  firstAction: "Your first 24-hour action",
  clarification: "One clarification question",
};

const followUpLabels: Record<string, string> = {
  clearer: "What has become clearer",
  focus: "What still needs focus",
  beforeFinal: "What to do before the final plan",
};

const finalPlanLabels: Record<string, string> = {
  situationSummary: "Situation summary",
  mainPressurePoint: "Main pressure point",
  mattersThisWeek: "What matters most this week",
  notToRush: "What not to rush",
  sevenDayPlan: "7-day plan",
  thirtyDayDirection: "30-day direction",
  jobIncomeConfidence: "Job-search / income / confidence next steps",
  scriptsTemplates: "Scripts/templates",
  signposting: "Professional signposting",
  nextSupportRoute: "Optional next support route",
};

function getNextStep(status: ResetStatus) {
  if (status === "Intake needed") return { step: "Complete your private intake.", expected: "Your Reset begins once the intake is submitted." };
  if (status === "Intake submitted" || status === "First response in preparation") return { step: "Your first written response is being prepared.", expected: "Within 1 working day after intake submission." };
  if (status === "Reply 1 ready") return { step: "Read your first written response below.", expected: "Your follow-up check-in comes during the 7-day reset." };
  if (status === "Follow-up check-in ready") return { step: "Review the follow-up check-in below.", expected: "Your final plan is prepared by Day 7." };
  if (status === "Final plan ready") return { step: "Your Redundancy Next-Step Plan is ready.", expected: "You can copy, download or print it below." };
  if (status === "Signposting needed") return { step: "Professional signposting may be useful.", expected: "Your written response will keep the support boundaries clear." };
  return { step: "Your 7-Day Reset is closed.", expected: "You can still review your written plan here." };
}

function buildPlanText(reset: PortalReset) {
  const lines = ["Your Redundancy Next-Step Plan", `Generated: ${formatDate(reset.finalPlanReadyAt ?? reset.updatedAt)}`, ""];
  Object.entries(finalPlanLabels).forEach(([key, label]) => {
    const value = reset.finalPlan[key];
    if (value) {
      lines.push(label.toUpperCase(), value, "");
    }
  });
  return lines.join("\n");
}

function ResponseCard({ title, data, labels }: { title: string; data: Record<string, string>; labels: Record<string, string> }) {
  if (!hasContent(data)) return null;
  return (
    <Card className="border-primary/15 bg-card shadow-sm" data-testid={`card-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
      <CardHeader className="pb-3 border-b border-primary/10 bg-[hsl(40_30%_98%)] rounded-t-lg">
        <CardTitle className="font-serif text-lg text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        {Object.entries(labels).map(([key, label]) => (
          data[key] ? (
            <div key={key} className="rounded-lg border border-primary/10 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">{label}</p>
              <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">{data[key]}</p>
            </div>
          ) : null
        ))}
      </CardContent>
    </Card>
  );
}

function AwaitingCard({ title, body }: { title: string; body: string }) {
  return (
    <Card className="border-dashed border-primary/25 bg-[hsl(40_30%_98%)]/50" data-testid="card-awaiting-response">
      <CardContent className="pt-6 pb-6">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <p className="font-medium text-primary">{title}</p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{body}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RedundancyResetPortalPage() {
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState(false);
  const portalToken = usePortalToken();
  const { data, isLoading, isError, isFetching, refetch, dataUpdatedAt } = useQuery<{ reset: PortalReset }>({
    queryKey: [`/api/reset-portal/${portalToken}`],
    enabled: !!portalToken,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    staleTime: 15_000,
  });
  const reset = data?.reset;
  const next = reset ? getNextStep(reset.status) : null;
  const finalReady = !!reset && (reset.status === "Final plan ready" || reset.status === "Closed") && hasContent(reset.finalPlan);
  const reply1Ready = hasContent(reset?.reply1);
  const followUpReady = hasContent(reset?.followUp);
  const awaitingReply1 =
    !!reset &&
    !reply1Ready &&
    (reset.status === "Intake submitted" || reset.status === "First response in preparation");
  const awaitingFollowUp = !!reset && reply1Ready && !followUpReady && reset.status === "Reply 1 ready";

  const copyPlan = async () => {
    if (!reset) return;
    await navigator.clipboard.writeText(buildPlanText(reset));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const downloadPlan = () => {
    if (!reset) return;
    const blob = new Blob([buildPlanText(reset)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "redundancy-next-step-plan.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Helmet>
        <title>Private Reset Portal | RedundancyCalculatorUK</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-[hsl(40_30%_98%)] flex flex-col">
        <DisclaimerBanner />
        <header
          className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-primary/10 shadow-sm"
          data-testid="header-reset-portal"
        >
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Button variant="ghost" size="icon" className="shrink-0" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Logo showTagline />
            </div>
            <Badge variant="outline" className="shrink-0 bg-gold/10 text-primary border-gold/30">
              Private Reset Portal
            </Badge>
          </div>
        </header>

        <main className="max-w-5xl mx-auto w-full px-4 py-8">
          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                Loading your private portal…
              </CardContent>
            </Card>
          ) : isError || !reset ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  This portal link could not be found. Check you are using the full link from your intake confirmation or email.
                </p>
                <Button onClick={() => navigate("/redundancy-reset")}>Return to Reset page</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground" data-testid="text-portal-last-updated">
                  Last checked {formatDateTime(new Date(dataUpdatedAt).toISOString())}
                  {isFetching ? " · refreshing…" : " · auto-refreshes every 30 seconds"}
                </p>
                <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} data-testid="button-portal-refresh">
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_18rem] gap-6 items-start">
                <div>
                  <Badge variant="outline" className="mb-3 bg-white text-primary border-primary/20">
                    Your 7-Day Reset
                  </Badge>
                  <h1 className="font-serif text-3xl font-bold text-primary mb-1">
                    {reset.name ? `Hi ${reset.name.split(" ")[0]}` : "Private Reset Portal"}
                  </h1>
                  <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                    Your written responses appear here as they are prepared. This is not live chat — return anytime or
                    refresh to see new messages.
                  </p>
                </div>
                <Card className="border-primary/15 bg-white shadow-sm" data-testid="card-current-status">
                  <CardContent className="pt-5 pb-5">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Current status</p>
                    <Badge className="bg-primary/90 text-primary-foreground hover:bg-primary mb-3">{reset.status}</Badge>
                    <p className="text-sm font-medium">{next?.step}</p>
                    <p className="text-xs text-muted-foreground mt-1">Expected: {next?.expected}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-6 items-start">
                <aside className="space-y-4">
                  <Card className="border-primary/15 bg-white shadow-sm" data-testid="card-portal-timeline">
                    <CardContent className="pt-5 pb-5 space-y-4">
                      {[
                        { label: "Intake", value: reset.submittedAt ? "Submitted" : "Needed", icon: Shield },
                        { label: "Reply 1", value: reset.reply1ReadyAt ? formatDate(reset.reply1ReadyAt) : "In preparation", icon: MessageSquare },
                        { label: "Follow-up", value: reset.followUpReadyAt ? formatDate(reset.followUpReadyAt) : "During reset", icon: Clock },
                        { label: "Final plan", value: reset.finalPlanReadyAt ? formatDate(reset.finalPlanReadyAt) : "By Day 7", icon: FileText },
                      ].map((item) => (
                        <div key={item.label} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-primary/15 bg-white shadow-sm" data-testid="card-intake-summary">
                    <CardHeader className="pb-3">
                      <CardTitle className="font-serif text-base">Intake summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(reset.intakeAnswers).length === 0 ? (
                        <p className="text-xs text-muted-foreground">No intake answers on file yet.</p>
                      ) : (
                        Object.entries(reset.intakeAnswers).slice(0, 6).map(([key, value]) => (
                          value ? (
                            <div key={key}>
                              <p className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, " ")}</p>
                              <p className="text-sm">{value}</p>
                            </div>
                          ) : null
                        ))
                      )}
                    </CardContent>
                  </Card>

                  <div className="rounded-md border border-primary/15 bg-white p-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">{BOUNDARY_NOTE}</p>
                  </div>
                </aside>

                <section className="space-y-5">
                  {awaitingReply1 && (
                    <AwaitingCard
                      title="First written response in preparation"
                      body="Your intake has been received. The first response is usually prepared within one working day. This page will update automatically when it is ready."
                    />
                  )}

                  <ResponseCard title="Private written response" data={reset.reply1} labels={reply1Labels} />

                  {awaitingFollowUp && (
                    <AwaitingCard
                      title="Follow-up check-in coming during your reset"
                      body="Your first response is below. A shorter follow-up check-in will appear here later in the 7-day reset."
                    />
                  )}

                  <ResponseCard title="Follow-up check-in" data={reset.followUp} labels={followUpLabels} />

                  {finalReady ? (
                    <Card className="border-primary/20 bg-white shadow-lg" data-testid="card-final-plan">
                      <CardHeader className="bg-[hsl(220_52%_22%)] text-white rounded-t-lg">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-white/60">Final plan</p>
                            <CardTitle className="font-serif text-2xl">Your Redundancy Next-Step Plan</CardTitle>
                            <p className="text-xs text-white/70 mt-1">Generated {formatDate(reset.finalPlanReadyAt ?? reset.updatedAt)}</p>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <Button size="sm" variant="secondary" onClick={copyPlan}>
                              <Copy className="w-3.5 h-3.5 mr-1.5" />
                              {copied ? "Copied" : "Copy"}
                            </Button>
                            <Button size="sm" variant="secondary" onClick={downloadPlan}>
                              <Download className="w-3.5 h-3.5 mr-1.5" />
                              Download
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => window.print()}>
                              <Printer className="w-3.5 h-3.5 mr-1.5" />
                              Print
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        {Object.entries(finalPlanLabels).map(([key, label]) => (
                          reset.finalPlan[key] ? (
                            <div key={key} className="rounded-lg border bg-muted/20 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">{label}</p>
                              <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">{reset.finalPlan[key]}</p>
                            </div>
                          ) : null
                        ))}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-primary/15 bg-white shadow-sm" data-testid="card-final-plan-pending">
                      <CardContent className="pt-6 pb-6">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">Your Redundancy Next-Step Plan will appear here</p>
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                              By Day 7, your polished plan will show here with copy, download and print options. This page
                              updates automatically when it is ready.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </section>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
