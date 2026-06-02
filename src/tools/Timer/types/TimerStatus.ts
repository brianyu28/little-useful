export const TimerStatus = {
  IDLE: "idle",
  PAUSED: "paused",
  RUNNING: "running",
} as const;

export type TimerStatus = (typeof TimerStatus)[keyof typeof TimerStatus];
