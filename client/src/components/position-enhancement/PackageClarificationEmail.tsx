import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EMAIL_TEMPLATE_DISCLAIMER } from "@shared/complianceCopy";
import { PACKAGE_CLARIFICATION_EMAIL } from "@shared/positionEnhancementCopy";
import { PositionModulePanel } from "./PositionModulePanel";

export function PackageClarificationEmail() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyEmail = (key: string, subject: string, body: string) => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <PositionModulePanel
      title="Package clarification email"
      subtitle="Copy-ready templates to clarify package figures or consultation details with HR or payroll."
      testId="module-clarification-email"
      disclaimer={EMAIL_TEMPLATE_DISCLAIMER}
    >
      <Tabs defaultValue="package">
        <TabsList className="mb-4">
          <TabsTrigger value="package">Package breakdown</TabsTrigger>
          <TabsTrigger value="consultation">Consultation questions</TabsTrigger>
        </TabsList>
        {(["package", "consultation"] as const).map((key) => {
          const template = PACKAGE_CLARIFICATION_EMAIL[key];
          return (
            <TabsContent key={key} value={key} className="space-y-3">
              <p className="text-xs font-medium text-primary">Subject: {template.subject}</p>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed rounded-lg border bg-slate-50 p-4">
                {template.body}
              </pre>
              <Button variant="outline" size="sm" onClick={() => copyEmail(key, template.subject, template.body)}>
                {copied === key ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                Copy email
              </Button>
            </TabsContent>
          );
        })}
      </Tabs>
    </PositionModulePanel>
  );
}
