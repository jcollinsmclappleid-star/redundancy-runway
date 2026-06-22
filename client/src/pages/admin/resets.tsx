import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo } from "@/components/Logo";
import { AlertTriangle, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Reset } from "@shared/schema";

const STATUS_OPTIONS = [
  "New",
  "Replied",
  "Follow-up Sent",
  "Plan Sent",
  "Complete",
  "Needs Signposting",
];

const STATUS_COLOURS: Record<string, string> = {
  "New": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "Replied": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "Follow-up Sent": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "Plan Sent": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "Complete": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  "Needs Signposting": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

function formatDate(dateString: string | Date) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ResetRow({ reset }: { reset: Reset }) {
  const [expanded, setExpanded] = useState(false);
  const [editNotes, setEditNotes] = useState(reset.adminNotes ?? "");
  const qc = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (payload: { status?: string; adminNotes?: string }) => {
      const res = await apiRequest("PATCH", `/api/resets/${reset.id}`, payload);
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/resets"] });
    },
  });

  const intakeAnswers = reset.intakeAnswers as Record<string, string> ?? {};

  return (
    <Card className="mb-3" data-testid={`card-reset-${reset.id}`}>
      <CardHeader
        className="cursor-pointer flex flex-row items-center justify-between gap-3 pb-3"
        onClick={() => setExpanded((v) => !v)}
        data-testid={`button-expand-reset-${reset.id}`}
      >
        <div className="flex items-center gap-3 flex-wrap min-w-0">
          <span className="font-medium text-sm truncate" data-testid={`text-name-${reset.id}`}>{reset.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOURS[reset.status] ?? "bg-muted text-muted-foreground"}`} data-testid={`badge-status-${reset.id}`}>
            {reset.status}
          </span>
          <Badge variant="outline" className="text-xs" data-testid={`badge-contact-${reset.id}`}>
            {reset.contactMethod === "whatsapp" ? "WhatsApp" : "Web message"}
          </Badge>
          {reset.paid === "paid" && (
            <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-0" data-testid={`badge-paid-${reset.id}`}>
              Paid
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-muted-foreground hidden sm:block" data-testid={`text-date-${reset.id}`}>
            {formatDate(reset.createdAt)}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0" data-testid={`content-reset-${reset.id}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Submitted</p>
              <p className="text-sm">{formatDate(reset.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Last updated</p>
              <p className="text-sm">{formatDate(reset.updatedAt)}</p>
            </div>
            {reset.sessionToken && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Calculator session token</p>
                <p className="text-xs font-mono break-all text-muted-foreground" data-testid={`text-token-${reset.id}`}>{reset.sessionToken}</p>
              </div>
            )}
            {reset.stripeSessionId && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Stripe session ID</p>
                <p className="text-xs font-mono break-all text-muted-foreground">{reset.stripeSessionId}</p>
              </div>
            )}
          </div>

          {/* Intake answers */}
          <div className="rounded-md border p-3 mb-4 space-y-3" data-testid={`intake-answers-${reset.id}`}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Intake responses</p>
            {Object.entries(intakeAnswers).map(([key, value]) => (
              value ? (
                <div key={key}>
                  <p className="text-xs text-muted-foreground mb-0.5 capitalize">{key.replace(/_/g, " ")}</p>
                  <p className="text-sm leading-relaxed">{value}</p>
                </div>
              ) : null
            ))}
          </div>

          {/* Status update */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Update status</p>
              <Select
                defaultValue={reset.status}
                onValueChange={(val) => updateMutation.mutate({ status: val })}
                data-testid={`select-status-${reset.id}`}
              >
                <SelectTrigger className="h-8 text-sm" data-testid={`trigger-status-${reset.id}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s} data-testid={`option-status-${s}`}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Admin notes */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Internal notes (not shown to user)</p>
            <Textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Add internal notes here..."
              rows={3}
              className="resize-none text-sm mb-2"
              data-testid={`input-notes-${reset.id}`}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateMutation.mutate({ adminNotes: editNotes })}
              disabled={updateMutation.isPending}
              data-testid={`button-save-notes-${reset.id}`}
            >
              {updateMutation.isPending ? "Saving…" : "Save notes"}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function AdminResetsPage() {
  const { data, isLoading, refetch } = useQuery<{ resets: Reset[] }>({
    queryKey: ["/api/resets"],
  });

  const resets = data?.resets ?? [];
  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = resets.filter((r) => r.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-4" data-testid="header-admin">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="text-sm text-muted-foreground font-medium">/ Admin · Resets</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            data-testid="button-refresh"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Security warning */}
        <div className="rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 p-4 mb-6 flex gap-3" data-testid="banner-security-warning">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">This page is unprotected</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              This admin queue has no authentication gate. It should be secured before going live.
              Add authentication (password, IP allowlist, or session-based access control) before publishing.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-serif text-xl font-bold" data-testid="text-page-title">7-Day Redundancy Reset — Admin Queue</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {resets.length} submission{resets.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>

        {/* Status summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6" data-testid="status-summary">
          {STATUS_OPTIONS.map((s) => (
            <div key={s} className="rounded-md border p-2.5 text-center" data-testid={`summary-${s}`}>
              <p className="text-lg font-bold">{counts[s] ?? 0}</p>
              <p className="text-xs text-muted-foreground">{s}</p>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground text-sm" data-testid="text-loading">
            Loading submissions…
          </div>
        ) : resets.length === 0 ? (
          <div className="text-center py-16 border rounded-lg" data-testid="text-empty">
            <p className="text-muted-foreground text-sm">No Reset submissions yet.</p>
          </div>
        ) : (
          <div data-testid="list-resets">
            {resets.map((reset) => (
              <ResetRow key={reset.id} reset={reset} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
