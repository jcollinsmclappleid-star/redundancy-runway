import { useQuery } from "@tanstack/react-query";
import type { RunwayInputs } from "@shared/schema";
import type { MaximiserInsights } from "@/lib/position-enhancement/buildMaximiserInsights";
import { fingerprintInputs } from "@/lib/private-runway-brief/formatBriefPlainText";
import { getSessionToken } from "@/lib/sessionToken";

export function useMaximiserInsights(inputs: RunwayInputs) {
  const fingerprint = fingerprintInputs(inputs);

  return useQuery<MaximiserInsights>({
    queryKey: ["/api/package-maximiser-insights", fingerprint],
    queryFn: async () => {
      const res = await fetch("/api/package-maximiser-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken: getSessionToken(), inputs }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message ?? `Insights request failed (${res.status})`);
      }
      return data.insights as MaximiserInsights;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
