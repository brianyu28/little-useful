export function getTwelveHourForHour(hour: number): number {
  return hour % 12 || 12;
}
