import { Select, Stack, Text } from "@mantine/core";
import React from "react";
import { DatePart } from "../types/DatePart";
import { Meridiem } from "../types/Meridiem";
import { TimeFormat } from "../types/TimeFormat";
import { formatDate } from "../utils/formatDate";
import { formatTimeZone } from "../utils/formatTimeZone";
import { getDateForDateParts } from "../utils/getDateForDateParts";
import { getDatePartsForDate } from "../utils/getDatePartsForDate";
import { getTwelveHourForHour } from "../utils/getTwelveHourForHour";
import { getTwentyFourHourForHour } from "../utils/getTwentyFourHourForHour";
import DateInput from "./DateInput";
import styles from "./DateRow.module.scss";
import Separator from "./Separator";

interface Props {
  readonly date: Date;
  readonly label: string;
  readonly onChange: (milliseconds: number) => void;
  readonly timeFormat: TimeFormat;
  readonly timeZone: string;
}

export default function DateRow({
  date,
  label,
  onChange,
  timeFormat,
  timeZone,
}: Props) {
  const values = getDatePartsForDate(date, timeZone);
  const hour =
    timeFormat === TimeFormat.TWELVE
      ? getTwelveHourForHour(values.hour)
      : values.hour;
  const meridiem = values.hour >= 12 ? Meridiem.PM : Meridiem.AM;

  const updatePart = React.useCallback(
    (part: DatePart, value: number | string) => {
      if (value === "" || !Number.isInteger(Number(value))) return;
      onChange(
        getDateForDateParts(
          { ...values, [part]: Number(value) },
          timeZone,
        ).getTime(),
      );
    },
    [onChange, timeZone, values],
  );

  const updateMeridiem = React.useCallback(
    (nextMeridiem: string | null) => {
      if (!nextMeridiem || nextMeridiem === meridiem) return;
      updatePart(
        DatePart.HOUR,
        values.hour + (nextMeridiem === Meridiem.PM ? 12 : -12),
      );
    },
    [meridiem, updatePart, values.hour],
  );

  const updateYear = React.useCallback(
    (value: number | string) => updatePart(DatePart.YEAR, value),
    [updatePart],
  );

  const updateMonth = React.useCallback(
    (value: number | string) => updatePart(DatePart.MONTH, value),
    [updatePart],
  );

  const updateDay = React.useCallback(
    (value: number | string) => updatePart(DatePart.DAY, value),
    [updatePart],
  );

  const updateHour = React.useCallback(
    (value: number | string) =>
      updatePart(
        DatePart.HOUR,
        timeFormat === TimeFormat.TWELVE
          ? getTwentyFourHourForHour(value, meridiem)
          : value,
      ),
    [meridiem, timeFormat, updatePart],
  );

  const updateMinute = React.useCallback(
    (value: number | string) => updatePart(DatePart.MINUTE, value),
    [updatePart],
  );

  const updateSecond = React.useCallback(
    (value: number | string) => updatePart(DatePart.SECOND, value),
    [updatePart],
  );

  return (
    <Stack className={styles.dateRow} gap="xs">
      <Stack align="center" gap={0}>
        <Text fw={700}>{label}</Text>
        <Text c="dimmed" className={styles.timeZone}>
          {formatTimeZone(date, timeZone)}
        </Text>
      </Stack>
      <div className={styles.fields}>
        <div className={styles.fieldGroup}>
          <DateInput
            className={styles.year}
            label="Year"
            onChange={updateYear}
            pad={false}
            value={values.year}
          />
          <Separator>-</Separator>
          <DateInput
            label="Month"
            max={12}
            min={1}
            onChange={updateMonth}
            value={values.month}
          />
          <Separator>-</Separator>
          <DateInput
            label="Day"
            max={31}
            min={1}
            onChange={updateDay}
            value={values.day}
          />
        </div>
        <div className={styles.fieldGroup}>
          <DateInput
            label="Hour"
            max={timeFormat === TimeFormat.TWELVE ? 12 : 23}
            min={timeFormat === TimeFormat.TWELVE ? 1 : 0}
            onChange={updateHour}
            value={hour}
          />
          <Separator>:</Separator>
          <DateInput
            label="Minute"
            max={59}
            min={0}
            onChange={updateMinute}
            value={values.minute}
          />
          <Separator>:</Separator>
          <DateInput
            label="Second"
            max={59}
            min={0}
            onChange={updateSecond}
            value={values.second}
          />
        </div>
        {timeFormat === TimeFormat.TWELVE && (
          <Select
            allowDeselect={false}
            aria-label="AM / PM"
            className={styles.meridiem}
            data={[Meridiem.AM, Meridiem.PM]}
            onChange={updateMeridiem}
            value={meridiem}
          />
        )}
      </div>
      <Text c="dimmed" className={styles.formattedDate} size="sm">
        {formatDate(date, timeFormat, timeZone)}
      </Text>
    </Stack>
  );
}
