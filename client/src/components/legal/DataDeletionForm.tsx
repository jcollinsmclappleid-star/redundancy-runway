import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SUPPORT_EMAIL } from "@shared/site";

export function DataDeletionForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/gdpr/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Your data has been removed.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage(`Unable to process your request. Please email ${SUPPORT_EMAIL}.`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 bg-muted/40 border border-border rounded-lg p-4 not-prose">
      <p className="text-sm font-medium text-foreground">Request data deletion</p>
      <p className="text-sm text-muted-foreground">
        Enter your email address and we will remove personal data we hold for that address, including purchase
        email links, magic sign-in links, saved report-access email associations, and Reset intake details where
        applicable.
      </p>
      {status === "success" ? (
        <p className="text-sm text-emerald-700 font-medium" data-testid="text-gdpr-success">
          {message}
        </p>
      ) : (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={status === "loading"}
            className="w-full border border-border rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            data-testid="input-gdpr-email"
          />
          {status === "error" && (
            <p className="text-sm text-destructive" data-testid="text-gdpr-error">
              {message}
            </p>
          )}
          <Button type="submit" variant="outline" size="sm" disabled={status === "loading"} data-testid="button-gdpr-submit">
            {status === "loading" ? "Processing…" : "Delete my data"}
          </Button>
        </>
      )}
    </form>
  );
}
