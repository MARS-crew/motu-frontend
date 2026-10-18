export type TransactionDateRange = { start: string; end: string };

export function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function formatDateRange({ start, end }: TransactionDateRange) {
  const endLabel = start.slice(0, 4) === end.slice(0, 4) ? end.slice(5) : end;
  return `${start.replaceAll('-', '.')} ~ ${endLabel.replaceAll('-', '.')}`;
}

export function getCalendarWeeks(year: number, month: number) {
  const offset = new Date(year, month, 1).getDay();
  const count = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: Math.ceil((offset + count) / 7) }, (_, week) =>
    Array.from({ length: 7 }, (_, weekday) => {
      const day = week * 7 + weekday - offset + 1;
      return day > 0 && day <= count ? day : null;
    }),
  );
}
