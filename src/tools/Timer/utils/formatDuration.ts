import { formatRemaining } from "./formatRemaining";

export function formatDuration(milliseconds: number): string {
  const seconds = Math.round(milliseconds / 1000);
  if (seconds % 60 === 0) {
    const minutes = seconds / 60;
    return `${minutes} minute`;
  }
  return formatRemaining(milliseconds);
}
