import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { CONSULTATION_PACK_DISCLAIMER } from "@shared/complianceCopy";
import type { PositionEnhancementData } from "@/lib/position-enhancement/buildPositionEnhancementData";
import { PositionModulePanel } from "./PositionModulePanel";

interface ConsultationDefencePackProps {
  data: PositionEnhancementData;
}

export function ConsultationDefencePack({ data }: ConsultationDefencePackProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const copyQuestions = (sectionKey: string, questions: readonly string[]) => {
    navigator.clipboard.writeText(questions.join("\n"));
    setCopiedKey(sectionKey);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <PositionModulePanel
      title="Consultation Defence Pack"
      subtitle="Prepare the questions and evidence that could strengthen your position before decisions are final."
      testId="module-consultation-defence"
      disclaimer={CONSULTATION_PACK_DISCLAIMER}
    >
      <Accordion type="multiple" className="w-full">
        {data.consultationSections.map((section) => (
          <AccordionItem key={section.sectionKey} value={section.sectionKey}>
            <AccordionTrigger className="text-sm font-semibold text-primary">{section.title}</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 mb-3">
                {section.questions.map((q) => (
                  <li key={q} className="text-xs text-muted-foreground leading-relaxed flex gap-2">
                    <span className="text-primary shrink-0">·</span>
                    {q}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => copyQuestions(section.sectionKey, section.questions)}
              >
                {copiedKey === section.sectionKey ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <Copy className="w-3 h-3 mr-1" />
                )}
                Copy questions
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-6 rounded-xl border border-slate-200 p-4">
        <p className="text-sm font-semibold text-primary mb-3">Evidence to prepare</p>
        <div className="space-y-2">
          {data.evidencePackItems.map((item) => (
            <label key={item} className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
              <Checkbox
                checked={checked[item] ?? false}
                onCheckedChange={(v) => setChecked((prev) => ({ ...prev, [item]: v === true }))}
              />
              {item}
            </label>
          ))}
        </div>
      </div>
    </PositionModulePanel>
  );
}
