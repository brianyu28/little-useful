export const ColorChannel = {
  BLUE: "blue",
  GREEN: "green",
  RED: "red",
} as const;

export type ColorChannel = (typeof ColorChannel)[keyof typeof ColorChannel];
