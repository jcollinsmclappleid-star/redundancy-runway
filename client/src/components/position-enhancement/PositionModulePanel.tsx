import type { ReactNode } from "react";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";

interface PositionModulePanelProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  testId: string;
  disclaimer: string;
}

export function PositionModulePanel({ title, subtitle, children, testId, disclaimer }: PositionModulePanelProps) {
  return (
    <DashboardPanel title={title} subtitle={subtitle} testId={testId} footer={disclaimer}>
      {children}
    </DashboardPanel>
  );
}
