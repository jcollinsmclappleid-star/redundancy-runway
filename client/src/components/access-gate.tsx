import { useAccess } from "@/hooks/use-access";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface AccessGateProps {
  children: React.ReactNode;
}

export function AccessGate({ children }: AccessGateProps) {
  const { hasAccess, isLoading, reason } = useAccess();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !hasAccess) {
      if (reason === "expired") {
        navigate("/unlock");
      } else {
        navigate("/preview");
      }
    }
  }, [hasAccess, isLoading, reason, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!hasAccess) return null;

  return <>{children}</>;
}
