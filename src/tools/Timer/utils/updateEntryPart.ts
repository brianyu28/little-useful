import { EditingPart } from "../types/EditingPart";
import { getEntryParts } from "./getEntryParts";

export function updateEntryPart(
  entry: string,
  part: EditingPart,
  value: string,
): string {
  const sanitized = value.replace(/\D/g, "");
  const { minutes, seconds } = getEntryParts(entry);
  return part === EditingPart.MINUTES
    ? entry.includes(":")
      ? `${sanitized}:${seconds}`
      : sanitized
    : `${minutes}:${sanitized.slice(0, 2)}`;
}
