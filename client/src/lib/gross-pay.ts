/** Canonical storage is weekly gross; UI may accept monthly. */
export function weeklyFromMonthlyGross(monthly: number): number {
  if (monthly <= 0) return 0;
  return Math.round((monthly * 12) / 52);
}

export function monthlyFromWeeklyGross(weekly: number): number {
  if (weekly <= 0) return 0;
  return Math.round((weekly * 52) / 12);
}
