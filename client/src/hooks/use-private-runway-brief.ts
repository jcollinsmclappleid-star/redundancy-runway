import { useState, useCallback, useEffect, useMemo } from "react";
import type { RunwayInputs } from "@shared/schema";
import type {
  PrivateRunwayBriefNarrative,
  PrivateRunwayBriefStatus,
  StoredPrivateRunwayBrief,
} from "@/lib/private-runway-brief/types";
import type { BriefNarrativeLite } from "@/lib/private-runway-brief/briefDocumentTypes";
import { isLegacyStoredBrief } from "@/lib/private-runway-brief/types";
import { fingerprintInputs } from "@/lib/private-runway-brief/formatBriefPlainText";
import { legacyNarrativeToLite } from "@/lib/private-runway-brief/buildBriefDocument";

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

  const saveBriefLite = useCallback(
    (lite: BriefNarrativeLite, fingerprint?: string) => {
      const next: StoredPrivateRunwayBrief = {
        narrativeLite: lite,
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

  const saveBrief = useCallback(
    (narrative: PrivateRunwayBriefNarrative, fingerprint?: string) => {
      const next: StoredPrivateRunwayBrief = {
        narrative,
        narrativeLite: legacyNarrativeToLite(narrative),
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

  const narrativeLite = useMemo(() => {
    if (stored?.narrativeLite) return stored.narrativeLite;
    if (stored?.narrative) return legacyNarrativeToLite(stored.narrative);
    return null;
  }, [stored]);

  return {
    narrative: stored?.narrative ?? null,
    narrativeLite,
    status,
    setStatus,
    isStale,
    saveBrief,
    saveBriefLite,
    clearBrief,
    fingerprint: currentFingerprint,
    storedFingerprint: stored?.payloadFingerprint ?? null,
  };
}
