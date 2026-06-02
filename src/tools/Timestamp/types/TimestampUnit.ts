export const TimestampUnit = {
  MILLIS: "milliseconds",
  SECONDS: "seconds",
} as const;

export type TimestampUnit = (typeof TimestampUnit)[keyof typeof TimestampUnit];
