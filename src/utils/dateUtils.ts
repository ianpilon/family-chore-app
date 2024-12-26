export function getCurrentMonthRange() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: firstDay, end: lastDay };
}

export function getCurrentWeekRange() {
  const now = new Date();
  const first = now.getDate() - now.getDay();
  const last = first + 6;
  const firstDay = new Date(now.setDate(first));
  const lastDay = new Date(now.setDate(last));
  firstDay.setHours(0, 0, 0, 0);
  lastDay.setHours(23, 59, 59, 999);
  return { start: firstDay, end: lastDay };
}

export function formatDateRange(start: Date, end: Date) {
  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
}