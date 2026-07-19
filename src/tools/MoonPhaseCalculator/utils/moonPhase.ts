export type MoonPhase = {
  readonly age: number;
  readonly fraction: number;
  readonly illumination: number;
  readonly label: string;
  readonly shortLabel: string;
  readonly waxing: boolean;
};

type DateParts = {
  readonly day: number;
  readonly month: number;
  readonly year: number;
};

const SYNODIC_MONTH = 29.530588853;
const REFERENCE_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const phaseDefinitions = [
  { label: "New Moon", shortLabel: "New" },
  { label: "Waxing Crescent", shortLabel: "Waxing crescent" },
  { label: "First Quarter", shortLabel: "First quarter" },
  { label: "Waxing Gibbous", shortLabel: "Waxing gibbous" },
  { label: "Full Moon", shortLabel: "Full" },
  { label: "Waning Gibbous", shortLabel: "Waning gibbous" },
  { label: "Last Quarter", shortLabel: "Last quarter" },
  { label: "Waning Crescent", shortLabel: "Waning crescent" },
] as const;

function phaseIndexForAge(age: number) {
  // Each label covers one eighth of the cycle, centered on its ideal phase.
  return Math.floor(((age + SYNODIC_MONTH / 16) / SYNODIC_MONTH) * 8) % 8;
}

function datePartsToUtcDate({ day, month, year }: DateParts) {
  return new Date(Date.UTC(year, month - 1, day, 12));
}

function parseDateParts(value: string): DateParts | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return undefined;
  }

  const [, yearValue, monthValue, dayValue] = match;
  const parts = {
    day: Number(dayValue),
    month: Number(monthValue),
    year: Number(yearValue),
  };
  const date = datePartsToUtcDate(parts);

  return date.getUTCFullYear() === parts.year &&
    date.getUTCMonth() === parts.month - 1 &&
    date.getUTCDate() === parts.day
    ? parts
    : undefined;
}

function getDateParts(value: string) {
  const parts = parseDateParts(value);
  if (!parts) {
    throw new RangeError(`Invalid calendar date: ${value}`);
  }

  return parts;
}

function formatDateParts({ day, month, year }: DateParts) {
  return [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-");
}

/** Returns the approximate phase for a date-only calendar value. */
export function getMoonPhase(value: string): MoonPhase {
  const dateAtNoonUtc = datePartsToUtcDate(getDateParts(value)).getTime();
  const daysSinceReference =
    (dateAtNoonUtc - REFERENCE_NEW_MOON) / MILLISECONDS_PER_DAY;
  const age =
    ((daysSinceReference % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const fraction = age / SYNODIC_MONTH;
  const definition = phaseDefinitions[phaseIndexForAge(age)];

  return {
    age,
    fraction,
    illumination: (1 - Math.cos(fraction * Math.PI * 2)) / 2,
    ...definition,
    waxing: fraction < 0.5,
  };
}

/** Reads today's calendar date using the browser's local time zone. */
export function getTodayDate() {
  const date = new Date();

  return formatDateParts({
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  });
}

export function parseCalendarDate(value: string) {
  return parseDateParts(value) ? value : undefined;
}

export function addDays(value: string, days: number) {
  const date = datePartsToUtcDate(getDateParts(value));
  date.setUTCDate(date.getUTCDate() + days);

  return formatDateParts({
    day: date.getUTCDate(),
    month: date.getUTCMonth() + 1,
    year: date.getUTCFullYear(),
  });
}

/** Creates a local-noon Date solely for locale-aware display formatting. */
export function getDateForDisplay(value: string) {
  const { day, month, year } = getDateParts(value);
  return new Date(year, month - 1, day, 12);
}
