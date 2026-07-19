import {
  ActionIcon,
  Group,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { ClientOnly } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import ToolPage from "../../components/ToolPage";
import MoonIcon from "./MoonIcon";
import styles from "./MoonPhaseCalculator.module.scss";
import { MoonPhaseCalculatorConfig } from "./MoonPhaseCalculatorConfig";
import type { MoonPhase } from "./utils/moonPhase";
import {
  addDays,
  getDateForDisplay,
  getMoonPhase,
  getTodayDate,
  parseCalendarDate,
} from "./utils/moonPhase";

const DAYS_PER_WEEK = 7;
const FORECAST_WEEKS = 2;

const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
});
const weekdayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
});

type ForecastDay = {
  readonly date: string;
  readonly phase: MoonPhase;
};

function getForecastWeeks(startDate: string): ForecastDay[][] {
  return Array.from({ length: FORECAST_WEEKS }, (_week, weekIndex) =>
    Array.from({ length: DAYS_PER_WEEK }, (_day, dayIndex) => {
      const date = addDays(startDate, weekIndex * DAYS_PER_WEEK + dayIndex);
      return { date, phase: getMoonPhase(date) };
    }),
  );
}

function ForecastDayCell({ date, phase }: ForecastDay) {
  const displayDate = getDateForDisplay(date);

  return (
    <Table.Td>
      <div className={styles.dayPhase}>
        <time dateTime={date}>
          <span>{weekdayFormatter.format(displayDate)}</span>
          <strong>{shortDateFormatter.format(displayDate)}</strong>
        </time>
        <MoonIcon phase={phase} size={42} />
        <span>{phase.shortLabel}</span>
      </div>
    </Table.Td>
  );
}

function MoonPhaseResults({ date }: { readonly date: string }) {
  const phase = getMoonPhase(date);
  const forecastWeeks = getForecastWeeks(date);

  return (
    <>
      <section aria-live="polite" className={styles.result}>
        <MoonIcon className={styles.heroMoon} phase={phase} size={190} />
        <div className={styles.phaseLabel}>{phase.label}</div>
        <Text c="white" size="sm">
          {Math.round(phase.illumination * 100)}% illuminated
        </Text>
      </section>

      <section aria-labelledby="forecast-heading">
        <Text id="forecast-heading" fw={800} mb="xs" size="lg">
          Next 14 days
        </Text>
        <div className={styles.tableScroll}>
          <Table className={styles.table} withTableBorder withColumnBorders>
            <colgroup>
              {Array.from({ length: DAYS_PER_WEEK }, (_, index) => (
                <col key={index} />
              ))}
            </colgroup>
            <Table.Tbody>
              {forecastWeeks.map((week, weekIndex) => (
                <Table.Tr key={weekIndex}>
                  {week.map((day) => (
                    <ForecastDayCell key={day.date} {...day} />
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </section>
    </>
  );
}

function MoonPhaseContent() {
  const [inputValue, setInputValue] = React.useState(getTodayDate);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const selectedDate = parseCalendarDate(inputValue);

  // The native date control must stay uncontrolled so it can retain partial input.
  const selectDate = (date: string) => {
    setInputValue(date);
    if (inputRef.current) {
      inputRef.current.value = date;
    }
  };

  const moveDate = (days: number) => {
    if (selectedDate) {
      selectDate(addDays(selectedDate, days));
    }
  };

  return (
    <Stack gap="xl">
      <div className={styles.datePicker}>
        <Group className={styles.dateControls} gap="sm" wrap="nowrap">
          <ActionIcon
            aria-label="Previous date"
            className={styles.dateButton}
            disabled={!selectedDate}
            onClick={() => moveDate(-1)}
            size="xl"
            variant="default"
          >
            <ChevronLeft />
          </ActionIcon>
          <TextInput
            aria-label="Moon phase date"
            className={styles.dateInput}
            defaultValue={inputValue}
            onInput={(event) => setInputValue(event.currentTarget.value)}
            ref={inputRef}
            size="xl"
            type="date"
          />
          <ActionIcon
            aria-label="Next date"
            className={styles.dateButton}
            disabled={!selectedDate}
            onClick={() => moveDate(1)}
            size="xl"
            variant="default"
          >
            <ChevronRight />
          </ActionIcon>
        </Group>
      </div>

      {selectedDate && <MoonPhaseResults date={selectedDate} />}
    </Stack>
  );
}

function MoonPhaseFallback() {
  return (
    <Stack aria-hidden="true" gap="xl">
      <Skeleton className={styles.dateSkeleton} height={50} />
      <Skeleton height={324} radius="md" />
      <Skeleton height={210} radius="md" />
    </Stack>
  );
}

export default function MoonPhaseCalculator() {
  return (
    <ToolPage
      contentClassName={styles.content}
      description={MoonPhaseCalculatorConfig.description}
      size="md"
      title={MoonPhaseCalculatorConfig.title}
    >
      <ClientOnly fallback={<MoonPhaseFallback />}>
        <MoonPhaseContent />
      </ClientOnly>
    </ToolPage>
  );
}
