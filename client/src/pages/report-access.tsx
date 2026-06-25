import { useEffect } from "react";
import { useLocation } from "wouter";

/** Legacy path — redirects to unified /access?token= handler */
export default function ReportAccessPage() {
  const [, navigate] = useLocation();
  const token = window.location.pathname.split("/").filter(Boolean).pop() ?? "";

  useEffect(() => {
    if (token) {
      navigate(`/access?token=${encodeURIComponent(token)}`);
    } else {
      navigate("/recover");
    }
  }, [token, navigate]);

  return null;
}
