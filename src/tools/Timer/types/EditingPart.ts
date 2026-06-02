export const EditingPart = {
  MINUTES: "minutes",
  SECONDS: "seconds",
} as const;

export type EditingPart = (typeof EditingPart)[keyof typeof EditingPart];
