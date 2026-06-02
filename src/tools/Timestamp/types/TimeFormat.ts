export const TimeFormat = {
  TWELVE: "12",
  TWENTY_FOUR: "24",
} as const;

export type TimeFormat = (typeof TimeFormat)[keyof typeof TimeFormat];
