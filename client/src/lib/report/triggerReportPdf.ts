/** Opens the browser print dialog — user chooses Save as PDF for a formatted export. */
export function triggerReportPdfDownload(): void {
  document.body.classList.add("report-print-mode");
  const cleanup = () => document.body.classList.remove("report-print-mode");
  window.addEventListener("afterprint", cleanup, { once: true });
  window.print();
}
