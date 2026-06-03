export function getUniqueTimeZones(timeZones: readonly string[]): string[] {
  return Array.from(new Set(timeZones));
}

export function getTimeZones(): string[] {
  try {
    return getUniqueTimeZones(["UTC", ...Intl.supportedValuesOf("timeZone")]);
  } catch {
    return ["UTC"];
  }
}
