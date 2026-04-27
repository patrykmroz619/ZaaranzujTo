const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

export const formatRelativeDate = (iso: string, locale = "pl"): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  const diffMs = date.getTime() - Date.now();
  const absMs = Math.abs(diffMs);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (absMs < MINUTE) return rtf.format(Math.round(diffMs / SECOND), "second");
  if (absMs < HOUR) return rtf.format(Math.round(diffMs / MINUTE), "minute");
  if (absMs < DAY) return rtf.format(Math.round(diffMs / HOUR), "hour");
  if (absMs < MONTH) return rtf.format(Math.round(diffMs / DAY), "day");
  if (absMs < YEAR) {
    return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(date);
  }
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};
