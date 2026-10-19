export type ListingMetricDateRange = { start: string; end: string };

export function isValidMetricDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

export function getMetricRangeLastDate(start: string) {
  const [year, month, day] = start.split('-').map(Number);
  return new Date(Date.UTC(year + 1, month - 1, day) - 86400000).toISOString().slice(0, 10);
}

export function isValidMetricRange({ start, end }: ListingMetricDateRange) {
  return (
    isValidMetricDate(start) &&
    isValidMetricDate(end) &&
    start <= end &&
    end <= getMetricRangeLastDate(start)
  );
}

export function formatMetricDate(value: string) {
  return value.replaceAll('-', '.');
}
export function formatMetricRange({ start, end }: ListingMetricDateRange) {
  return `${formatMetricDate(start)} ~ ${formatMetricDate(end)}`;
}
