import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo } from "@/components/Logo";
import { AlertTriangle, ChevronDown, ChevronUp, Copy, RefreshCw, Wand2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { computeRunway, formatGBP, formatMonths } from "@/lib/engine";
import { RESET_STATUS_OPTIONS, type Reset, type RunwayInputs } from "@shared/schema";

const STATUS_COLOURS: Record<string, string> = {
  "Intake needed": "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
  "Intake submitted": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "First response in preparation": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "Reply 1 ready": "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  "Follow-up check-in ready": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "Final plan ready": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "Closed": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  "Signposting needed": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "New": "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
};

const reply1Labels = {
  hearing: "What I'm hearing",
  important: "What seems most important",
  notPanic: "What not to panic about yet",
  firstAction: "Your first 24-hour action",
  clarification: "One clarification question",
};

const reply1Templates: Record<keyof typeof reply1Labels, string> = {
  hearing: "From your intake, the main thing I am hearing is...",
  important: "The most useful priority appears to be...",
  notPanic: "You do not need to solve everything today. For now, it is reasonable to avoid rushing...",
  firstAction: "For the next 24 hours, focus on...",
  clarification: "One point that would help sharpen the final plan is...",
};

const followUpLabels = {
  clearer: "What has become clearer",
  focus: "What still needs focus",
  beforeFinal: "What to do before the final plan",
};

const followUpTemplates: Record<keyof typeof followUpLabels, string> = {
  clearer: "Since the first response, the useful clearer point is...",
  focus: "The area that still needs focus is...",
  beforeFinal: "Before the final plan, it would help to...",
};

const finalPlanLabels = {
  situationSummary: "Situation summary",
  mainPressurePoint: "Main pressure point",
  mattersThisWeek: "What matters most this week",
  notToRush: "What not to rush",
  sevenDayPlan: "7-day action plan",
  thirtyDayDirection: "30-day direction",
  jobIncomeConfidence: "Job-search / income / confidence next steps",
  scriptsTemplates: "Useful scripts/templates if relevant",
  signposting: "Professional signposting if needed",
  nextSupportRoute: "Optional next support route",
};

const finalPlanTemplates: Record<keyof typeof finalPlanLabels, string> = {
  situationSummary: "Your situation in brief:",
  mainPressurePoint: "The main pressure point appears to be:",
  mattersThisWeek: "This week, the most useful focus is:",
  notToRush: "For now, it may be better not to rush:",
  sevenDayPlan: "Day 1-2:\nDay 3-4:\nDay 5-7:",
  thirtyDayDirection: "Over the next 30 days, the direction is:",
  jobIncomeConfidence: "For job-search, income and confidence:",
  scriptsTemplates: "Useful wording you could adapt:",
  signposting: "If this area needs professional support, consider:",
  nextSupportRoute: "A possible next support route is:",
};

const boundaryLabels = {
  noFinancialAdvice: "No financial advice",
  noLegalAdvice: "No legal advice",
  noDebtAdvice: "No debt advice",
  noEmploymentLawAdvice: "No employment law advice",
  noMedicalMentalHealthAdvice: "No medical/mental health advice",
  noGuaranteedOutcomes: "No guaranteed outcomes",
  signpostingAddedIfNeeded: "Signposting added if needed",
};

const riskFlagLabels = {
  signpostingNeeded: "Professional signposting may be needed",
  employerProcessConcern: "Employer process or consultation concern",
  moneyDebtPressure: "Money or debt pressure mentioned",
  wellbeingConcern: "Wellbeing concern mentioned",
};

function formatDate(dateString: string | Date | null) {
  if (!dateString) return "Not set";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function asRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, val]) => [key, String(val ?? "")]));
}

function asBooleanRecord(value: unknown): Record<string, boolean> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, val]) => [key, Boolean(val)]));
}

function StructuredBuilder({
  title,
  labels,
  templates,
  values,
  onChange,
}: {
  title: string;
  labels: Record<string, string>;
  templates: Record<string, string>;
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}) {
  return (
    <Card className="border-primary/10" data-testid={`builder-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
      <CardHeader className="pb-3">
        <CardTitle className="font-serif text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(labels).map(([key, label]) => (
          <div key={key}>
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => onChange({ ...values, [key]: values[key] || templates[key] || "" })}
              >
                <Wand2 className="w-3 h-3 mr-1" />
                Insert template
              </Button>
            </div>
            <Textarea
              value={values[key] ?? ""}
              onChange={(event) => onChange({ ...values, [key]: event.target.value })}
              rows={3}
              className="resize-y text-sm"
              data-testid={`textarea-${key}`}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ResetRow({ reset }: { reset: Reset }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(reset.status === "New" ? "Intake needed" : reset.status);
  const [adminNotes, setAdminNotes] = useState(reset.adminNotes ?? "");
  const [riskFlags, setRiskFlags] = useState(asBooleanRecord(reset.riskFlags));
  const [reply1, setReply1] = useState(asRecord(reset.reply1));
  const [followUp, setFollowUp] = useState(asRecord(reset.followUp));
  const [finalPlan, setFinalPlan] = useState(asRecord(reset.finalPlan));
  const [boundaryChecklist, setBoundaryChecklist] = useState(asBooleanRecord(reset.boundaryChecklist));
  const qc = useQueryClient();

  const { data: calculationData } = useQuery<{ calculations: Array<{ inputs: RunwayInputs; createdAt: string }> }>({
    queryKey: [`/api/calculations/${reset.sessionToken}`],
    enabled: !!reset.sessionToken,
  });

  const latestCalculation = calculationData?.calculations?.[0];
  const calculationSummary = useMemo(() => {
    if (!latestCalculation?.inputs) return null;
    try {
      const result = computeRunway(latestCalculation.inputs);
      return {
        runway: formatMonths(result.monthsUntilDepletion),
        burn: formatGBP(result.monthlyBurn),
        capital: formatGBP(result.startingCapital),
        band: result.stabilityBand,
      };
    } catch {
      return null;
    }
  }, [latestCalculation]);

  const updateMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const adminPassword = sessionStorage.getItem("rruk_admin_password") ?? "";
      const res = await fetch(`/api/resets/${reset.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(adminPassword ? { Authorization: `Bearer ${adminPassword}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/resets"] });
    },
  });

  const boundaryComplete = Object.keys(boundaryLabels).every((key) => boundaryChecklist[key]);
  const portalUrl = reset.portalToken ? `/redundancy-reset/portal/${reset.portalToken}` : "";
  const intakeAnswers = asRecord(reset.intakeAnswers);

  const saveCase = (nextStatus = status) => {
    updateMutation.mutate({
      status: nextStatus,
      riskFlags,
      reply1,
      followUp,
      finalPlan,
      boundaryChecklist,
      adminNotes,
    });
    setStatus(nextStatus);
  };

  return (
    <Card className="mb-4" data-testid={`card-reset-${reset.id}`}>
      <CardHeader
        className="cursor-pointer flex flex-row items-center justify-between gap-3 pb-3"
        onClick={() => setExpanded((value) => !value)}
        data-testid={`button-expand-reset-${reset.id}`}
      >
        <div className="flex items-center gap-3 flex-wrap min-w-0">
          <span className="font-medium text-sm truncate" data-testid={`text-name-${reset.id}`}>{reset.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOURS[status] ?? "bg-muted text-muted-foreground"}`} data-testid={`badge-status-${reset.id}`}>
            {status}
          </span>
          <Badge variant="outline" className="text-xs" data-testid={`badge-contact-${reset.id}`}>
            {reset.contactMethod === "whatsapp" ? "WhatsApp" : "Private Reset Portal"}
          </Badge>
          {reset.paid === "paid" && <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-0">Paid</Badge>}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-muted-foreground hidden sm:block">{formatDate(reset.createdAt)}</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 space-y-5" data-testid={`content-reset-${reset.id}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3"><CardTitle className="font-serif text-base">Case overview</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Submitted:</span> {formatDate(reset.submittedAt ?? reset.createdAt)}</p>
                <p><span className="text-muted-foreground">Updated:</span> {formatDate(reset.updatedAt)}</p>
                <p><span className="text-muted-foreground">Contact:</span> {reset.contactMethod === "whatsapp" ? "WhatsApp" : "Private Reset Portal"}</p>
                {portalUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}${portalUrl}`)}
                  >
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Copy portal link
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader className="pb-3"><CardTitle className="font-serif text-base">Calculator result summary</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {calculationSummary ? (
                  <>
                    <p><span className="text-muted-foreground">Runway:</span> {calculationSummary.runway}</p>
                    <p><span className="text-muted-foreground">Monthly burn:</span> {calculationSummary.burn}</p>
                    <p><span className="text-muted-foreground">Starting capital:</span> {calculationSummary.capital}</p>
                    <p><span className="text-muted-foreground">Band:</span> {calculationSummary.band}</p>
                  </>
                ) : (
                  <p className="text-muted-foreground">No calculator result linked yet.</p>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader className="pb-3"><CardTitle className="font-serif text-base">Status controls</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {RESET_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" className="w-full" onClick={() => saveCase()} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save status and case"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="font-serif text-base">Intake answers</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(intakeAnswers).map(([key, value]) => (
                value ? (
                  <div key={key} className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground mb-1 capitalize">{key.replace(/_/g, " ")}</p>
                    <p className="text-sm whitespace-pre-wrap">{value}</p>
                  </div>
                ) : null
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="font-serif text-base">Risk/signposting flags</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(riskFlagLabels).map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 rounded-md border p-3 text-sm">
                  <Checkbox checked={!!riskFlags[key]} onCheckedChange={(checked) => setRiskFlags((prev) => ({ ...prev, [key]: checked === true }))} />
                  {label}
                </label>
              ))}
            </CardContent>
          </Card>

          <StructuredBuilder title="Reply 1 builder" labels={reply1Labels} templates={reply1Templates} values={reply1} onChange={setReply1} />
          <StructuredBuilder title="Follow-up builder" labels={followUpLabels} templates={followUpTemplates} values={followUp} onChange={setFollowUp} />
          <StructuredBuilder title="Final plan builder" labels={finalPlanLabels} templates={finalPlanTemplates} values={finalPlan} onChange={setFinalPlan} />

          <Card>
            <CardHeader className="pb-3"><CardTitle className="font-serif text-base">Boundary review before sending</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(boundaryLabels).map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 rounded-md border p-3 text-sm">
                  <Checkbox checked={!!boundaryChecklist[key]} onCheckedChange={(checked) => setBoundaryChecklist((prev) => ({ ...prev, [key]: checked === true }))} />
                  {label}
                </label>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="font-serif text-base">Internal notes</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={adminNotes} onChange={(event) => setAdminNotes(event.target.value)} rows={4} className="resize-y text-sm" placeholder="Internal notes only. Not shown in the portal." />
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => saveCase()} disabled={updateMutation.isPending}>Save case</Button>
            <Button variant="outline" onClick={() => saveCase("Reply 1 ready")} disabled={!boundaryComplete || updateMutation.isPending}>Mark Reply 1 ready</Button>
            <Button variant="outline" onClick={() => saveCase("Follow-up check-in ready")} disabled={!boundaryComplete || updateMutation.isPending}>Mark follow-up ready</Button>
            <Button className="btn-gold" onClick={() => saveCase("Final plan ready")} disabled={!boundaryComplete || updateMutation.isPending}>Mark final plan ready</Button>
          </div>
          {!boundaryComplete && (
            <p className="text-xs text-muted-foreground">Complete the boundary review checklist before marking a response or final plan ready.</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default function AdminResetsPage() {
  const [adminPassword, setAdminPassword] = useState(() => sessionStorage.getItem("rruk_admin_password") ?? "");
  const [passwordInput, setPasswordInput] = useState("");

  const { data, isLoading, refetch, error } = useQuery<{ resets: Reset[] }>({
    queryKey: ["/api/resets", adminPassword],
    queryFn: async () => {
      const res = await fetch("/api/resets", {
        headers: adminPassword ? { Authorization: `Bearer ${adminPassword}` } : {},
        credentials: "include",
      });
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
    enabled: !!adminPassword,
  });

  const resets = data?.resets ?? [];
  const counts = RESET_STATUS_OPTIONS.reduce((acc, status) => {
    acc[status] = resets.filter((reset) => (reset.status === "New" ? "Intake needed" : reset.status) === status).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-4" data-testid="header-admin">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="text-sm text-muted-foreground font-medium">/ Admin · Resets</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => refetch()} data-testid="button-refresh">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 p-4 mb-6 flex gap-3" data-testid="banner-security-warning">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Admin password required</p>
            <p className="text-xs text-muted-foreground mt-0.5 mb-3">
              Set ADMIN_PASSWORD in your environment, then enter it here to manage Reset fulfilment.
            </p>
            <div className="flex gap-2 max-w-md">
              <input
                type="password"
                className="flex-1 h-9 rounded-md border px-3 text-sm bg-background"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Admin password"
              />
              <Button
                size="sm"
                onClick={() => {
                  sessionStorage.setItem("rruk_admin_password", passwordInput);
                  setAdminPassword(passwordInput);
                }}
              >
                Unlock
              </Button>
            </div>
            {error && <p className="text-xs text-destructive mt-2">Could not load queue. Check your password.</p>}
          </div>
        </div>

        {!adminPassword ? null : (
        <>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-serif text-xl font-bold" data-testid="text-page-title">7-Day Redundancy Reset - Fulfilment Queue</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {resets.length} case{resets.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-6" data-testid="status-summary">
          {RESET_STATUS_OPTIONS.map((status) => (
            <div key={status} className="rounded-md border p-2.5 text-center" data-testid={`summary-${status}`}>
              <p className="text-lg font-bold">{counts[status] ?? 0}</p>
              <p className="text-[11px] text-muted-foreground leading-tight">{status}</p>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground text-sm" data-testid="text-loading">Loading submissions...</div>
        ) : resets.length === 0 ? (
          <div className="text-center py-16 border rounded-lg" data-testid="text-empty">
            <p className="text-muted-foreground text-sm">No Reset submissions yet.</p>
          </div>
        ) : (
          <div data-testid="list-resets">
            {resets.map((reset) => <ResetRow key={reset.id} reset={reset} />)}
          </div>
        )}
        </>
        )}
      </main>
    </div>
  );
}
