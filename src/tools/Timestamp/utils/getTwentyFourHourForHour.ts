import { Meridiem } from "../types/Meridiem";

export function getTwentyFourHourForHour(
  hour: number | string,
  meridiem: Meridiem,
): number | string {
  if (hour === "" || !Number.isInteger(Number(hour))) return hour;
  return (Number(hour) % 12) + (meridiem === Meridiem.PM ? 12 : 0);
}
