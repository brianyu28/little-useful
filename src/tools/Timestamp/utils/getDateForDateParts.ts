import { getDatePartsForDate } from "./getDatePartsForDate";
import type { DatePart } from "../types/DatePart";

export function getDateForDateParts(
  values: Record<DatePart, number>,
  timeZone: string,
): Date {
  const desired = Date.UTC(
    values.year,
    values.month - 1,
    values.day,
    values.hour,
    values.minute,
    values.second,
  );
  let result = desired;
  // Reverse Intl formatting iteratively; a retry handles offsets crossed near DST changes.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const actual = getDatePartsForDate(new Date(result), timeZone);
    const adjustment =
      desired -
      Date.UTC(
        actual.year,
        actual.month - 1,
        actual.day,
        actual.hour,
        actual.minute,
        actual.second,
      );
    if (!adjustment) break;
    result += adjustment;
  }
  return new Date(result);
}
