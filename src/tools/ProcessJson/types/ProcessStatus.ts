export const ProcessStatus = {
  IDLE: "idle",
  LOADING: "loading",
  DONE: "done",
} as const;

export type ProcessStatus = (typeof ProcessStatus)[keyof typeof ProcessStatus];
