import { TimestampUnit } from "../types/TimestampUnit";

const MILLISECOND_THRESHOLD = 100_000_000_000;

interface ParsedTimestamp {
  readonly milliseconds: number;
  readonly unit: TimestampUnit;
}

export function parseTimestamp(value: string): ParsedTimestamp | undefined {
  if (!/^-?\d+$/.test(value.trim())) return;
  const timestamp = Number(value);
  const unit: TimestampUnit =
    Math.abs(timestamp) >= MILLISECOND_THRESHOLD
      ? TimestampUnit.MILLIS
      : TimestampUnit.SECONDS;
  const milliseconds =
    unit === TimestampUnit.MILLIS ? timestamp : timestamp * 1000;
  if (
    !Number.isSafeInteger(timestamp) ||
    Number.isNaN(new Date(milliseconds).getTime())
  )
    return;
  return { milliseconds, unit };
}
