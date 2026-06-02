interface RemainingParts {
  readonly minutes: string;
  readonly seconds: string;
}

export function getRemainingParts(milliseconds: number): RemainingParts {
  const seconds = Math.ceil(milliseconds / 1000);
  return {
    minutes: String(Math.floor(seconds / 60)),
    seconds: String(seconds % 60).padStart(2, "0"),
  };
}
