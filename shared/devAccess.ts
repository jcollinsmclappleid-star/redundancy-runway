/** Local-only bypass for paid report routes — never active in production. */
export function isDevReportAccessGranted(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  const flag = process.env.DEV_GRANT_REPORT_ACCESS?.trim().toLowerCase();
  return flag === "1" || flag === "true" || flag === "yes";
}
