export const Meridiem = {
  AM: "AM",
  PM: "PM",
} as const;

export type Meridiem = (typeof Meridiem)[keyof typeof Meridiem];
