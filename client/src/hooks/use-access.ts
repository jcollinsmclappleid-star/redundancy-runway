import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { getSessionToken, setSessionToken, clearSessionToken } from "@/lib/sessionToken";

export function useSessionToken(): string {
  return getSessionToken();
}

interface AccessStatus {
  hasAccess: boolean;
  reason?: string;
  expiresAt?: string;
  purchasedAt?: string;
  devGranted?: boolean;
}

interface ServerSession {
  authenticated: boolean;
  email?: string;
  hasAccess: boolean;
  expiresAt?: string;
  purchasedAt?: string;
  sessionToken?: string;
  devGranted?: boolean;
}

export function useAccess() {
  const queryClient = useQueryClient();
  const sessionToken = getSessionToken();

  const serverSessionQuery = useQuery<ServerSession>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) return { authenticated: false, hasAccess: false };
      return res.json();
    },
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  const localQuery = useQuery<AccessStatus>({
    queryKey: ["/api/access", sessionToken],
    queryFn: async () => {
      const res = await fetch(`/api/access/${encodeURIComponent(sessionToken)}`);
      if (!res.ok) throw new Error("Failed to check access");
      return res.json();
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    enabled: !serverSessionQuery.data?.hasAccess,
  });

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    queryClient.invalidateQueries({ queryKey: ["/api/access"] });
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      // ignore
    }
    clearSessionToken();
    queryClient.clear();
  }, [queryClient]);

  const serverAccess = serverSessionQuery.data;
  const localAccess = localQuery.data;

  useEffect(() => {
    if (serverAccess?.hasAccess && serverAccess.sessionToken) {
      setSessionToken(serverAccess.sessionToken);
    }
  }, [serverAccess?.hasAccess, serverAccess?.sessionToken]);

  const hasAccess = serverAccess?.hasAccess ?? localAccess?.hasAccess ?? false;
  const isAuthenticated = serverAccess?.authenticated ?? false;
  const email = serverAccess?.email;
  const expiresAt = serverAccess?.expiresAt ?? localAccess?.expiresAt;
  const reason = localAccess?.reason;
  const devGranted = serverAccess?.devGranted ?? localAccess?.devGranted ?? false;
  const isLoading = serverSessionQuery.isLoading || (!serverAccess?.hasAccess && localQuery.isLoading);

  return {
    hasAccess,
    isLoading,
    isAuthenticated,
    email,
    expiresAt,
    reason,
    devGranted,
    sessionToken,
    refresh,
    logout,
  };
}
