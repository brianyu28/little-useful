import { TimeFormat } from "../types/TimeFormat";

export function formatDate(
  date: Date,
  timeFormat: TimeFormat,
  timeZone: string,
): string {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    hour: "numeric",
    hour12: timeFormat === TimeFormat.TWELVE,
    minute: "2-digit",
    month: "long",
    timeZone,
    timeZoneName: "short",
    weekday: "long",
    year: "numeric",
  }).format(date);
}
