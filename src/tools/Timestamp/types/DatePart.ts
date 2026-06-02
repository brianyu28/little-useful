export const DatePart = {
  DAY: "day",
  HOUR: "hour",
  MINUTE: "minute",
  MONTH: "month",
  SECOND: "second",
  YEAR: "year",
} as const;

export type DatePart = (typeof DatePart)[keyof typeof DatePart];
