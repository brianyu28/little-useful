export function formatTimeZone(date: Date, timeZone: string): string {
  if (timeZone === "UTC") return "Coordinated Universal Time";
  return (
    new Intl.DateTimeFormat(undefined, {
      timeZone,
      timeZoneName: "longGeneric",
    })
      .formatToParts(date)
      .find(({ type }) => type === "timeZoneName")?.value ?? timeZone
  );
}
