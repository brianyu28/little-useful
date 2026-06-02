import { dateParts } from "./dateParts";
import type { DatePart } from "../types/DatePart";

export function getDatePartsForDate(
  date: Date,
  timeZone: string,
): Record<DatePart, number> {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "numeric",
    hourCycle: "h23",
    minute: "numeric",
    month: "numeric",
    second: "numeric",
    timeZone,
    year: "numeric",
  }).formatToParts(date);
  return Object.fromEntries(
    parts
      .filter(({ type }) => dateParts.includes(type as DatePart))
      .map(({ type, value }) => [type, Number(value)]),
  ) as Record<DatePart, number>;
}
