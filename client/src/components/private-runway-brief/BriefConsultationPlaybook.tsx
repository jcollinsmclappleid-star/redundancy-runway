import type { BriefDocument } from "@/lib/private-runway-brief/briefDocumentTypes";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";
import { CONSULTATION_SECTIONS } from "@shared/positionEnhancementCopy";
import { CONSULTATION_PACK_DISCLAIMER } from "@shared/complianceCopy";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface BriefConsultationPlaybookProps {
  document: BriefDocument;
}

export function BriefConsultationPlaybook({ document }: BriefConsultationPlaybookProps) {
  if (!document.position.showConsultation) return null;

  return (
    <DashboardPanel
      title="Consultation preparation"
      subtitle="Structured questions for redundancy consultation — preparation only."
      testId="brief-consultation-playbook"
      footer={CONSULTATION_PACK_DISCLAIMER}
    >
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{document.position.consultationIntro}</p>
      <Accordion type="multiple" className="space-y-2">
        {CONSULTATION_SECTIONS.map((section) => (
          <AccordionItem
            key={section.sectionKey}
            value={section.sectionKey}
            className="border border-gold/15 rounded-xl bg-white px-4"
          >
            <AccordionTrigger className="text-sm font-semibold text-primary py-3 hover:no-underline">
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <ul className="space-y-2">
                {section.questions.map((q) => (
                  <li key={q} className="text-xs text-foreground/85 leading-relaxed pl-3 border-l-2 border-gold/30">
                    {q}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </DashboardPanel>
  );
}
