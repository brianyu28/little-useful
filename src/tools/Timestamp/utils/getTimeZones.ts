export function getTimeZones(): string[] {
  try {
    return ["UTC", ...Intl.supportedValuesOf("timeZone")];
  } catch {
    return ["UTC"];
  }
}
