import { useState, useCallback, useEffect, useMemo } from "react";
import type { RunwayInputs } from "@shared/schema";
import type {
  PrivateRunwayBriefNarrative,
  PrivateRunwayBriefStatus,
  StoredPrivateRunwayBrief,
} from "@/lib/private-runway-brief/types";
import { isLegacyStoredBrief } from "@/lib/private-runway-brief/types";
import { fingerprintInputs } from "@/lib/private-runway-brief/formatBriefPlainText";

const STORAGE_KEY = "rruk_private_brief";

function loadStored(): StoredPrivateRunwayBrief | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (isLegacyStoredBrief(parsed)) return null;
    return parsed as StoredPrivateRunwayBrief;
  } catch {
    return null;
  }
}

export function usePrivateRunwayBrief(inputs: RunwayInputs) {
  const currentFingerprint = useMemo(() => fingerprintInputs(inputs), [inputs]);

  const [stored, setStored] = useState<StoredPrivateRunwayBrief | null>(() => loadStored());
  const [status, setStatus] = useState<PrivateRunwayBriefStatus>(() => {
    const s = loadStored();
    if (!s) return "idle";
    return fingerprintInputs(inputs) !== s.payloadFingerprint ? "stale" : "done";
  });

  useEffect(() => {
    if (!stored) {
      if (status !== "loading" && status !== "error") setStatus("idle");
      return;
    }
    if (status === "loading") return;
    setStatus(currentFingerprint !== stored.payloadFingerprint ? "stale" : "done");
  }, [currentFingerprint, stored, status]);

  const saveBrief = useCallback(
    (narrative: PrivateRunwayBriefNarrative, fingerprint?: string) => {
      const next: StoredPrivateRunwayBrief = {
        narrative,
        payloadFingerprint: fingerprint ?? currentFingerprint,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      setStored(next);
      setStatus("done");
    },
    [currentFingerprint],
  );

  const clearBrief = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setStored(null);
    setStatus("idle");
  }, []);

  const isStale = status === "stale";

  return {
    narrative: stored?.narrative ?? null,
    status,
    setStatus,
    isStale,
    saveBrief,
    clearBrief,
    fingerprint: currentFingerprint,
    storedFingerprint: stored?.payloadFingerprint ?? null,
  };
}
