import { Anchor, Stack, Text, TextInput } from "@mantine/core";
import React from "react";
import ToolPage from "../../components/ToolPage";
import { useToolState } from "../../hooks/useToolState";
import styles from "./Timestamp.module.scss";
import { TimestampConfig } from "./TimestampConfig";
import DateRow from "./components/DateRow";
import TimestampSettings from "./components/TimestampSettings";
import { TimestampUnit } from "./types/TimestampUnit";
import { getInitialTimestamp } from "./utils/getInitialTimestamp";
import { getLocalTimeZone } from "./utils/getLocalTimeZone";
import { parseTimestamp } from "./utils/parseTimestamp";
import {
  timestampDefaults,
  timestampPreferencesSchema,
} from "./utils/preferences";

export default function Timestamp() {
  const [timestamp, setTimestamp] = React.useState(() =>
    String(getInitialTimestamp()),
  );
  const [milliseconds, setMilliseconds] = React.useState(
    () => Number(timestamp) * 1000,
  );
  const [unit, setUnit] = React.useState<TimestampUnit>(TimestampUnit.SECONDS);
  const [error, setError] = React.useState<string>();
  const [localTimeZone] = React.useState(() => getLocalTimeZone());
  const [preferences, setPreferences] = useToolState(
    "timestamp",
    timestampDefaults,
    timestampPreferencesSchema,
  );

  const updateTimestamp = React.useCallback((value: string) => {
    setTimestamp(value);
    const parsed = parseTimestamp(value);
    if (!parsed) {
      setError("Enter a valid Unix timestamp in seconds or milliseconds.");
      return;
    }
    setMilliseconds(parsed.milliseconds);
    setUnit(parsed.unit);
    setError(undefined);
  }, []);

  const updateDate = React.useCallback(
    (nextMilliseconds: number) => {
      setMilliseconds(nextMilliseconds);
      setTimestamp(
        String(
          unit === TimestampUnit.MILLIS
            ? nextMilliseconds
            : Math.floor(nextMilliseconds / 1000),
        ),
      );
      setError(undefined);
    },
    [unit],
  );

  const resetToNow = React.useCallback(() => {
    const now = getInitialTimestamp();
    setTimestamp(String(now));
    setMilliseconds(now * 1000);
    setUnit(TimestampUnit.SECONDS);
    setError(undefined);
  }, []);

  const handleTimestampChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      updateTimestamp(event.currentTarget.value),
    [updateTimestamp],
  );

  return (
    <ToolPage
      description={TimestampConfig.description}
      settings={
        <TimestampSettings onChange={setPreferences} value={preferences} />
      }
      title={TimestampConfig.title}
    >
      <Stack gap="lg">
        <TextInput
          aria-label="Unix timestamp"
          className={styles.timestamp}
          error={error}
          onChange={handleTimestampChange}
          size="xl"
          value={timestamp}
        />
        <Stack className={styles.timestampMeta} gap={0}>
          {error == null && <Text className={styles.unit}>{unit}</Text>}
          <Anchor
            component="button"
            onClick={resetToNow}
            size="xs"
            type="button"
          >
            Reset to now
          </Anchor>
        </Stack>
        <DateRow
          date={new Date(milliseconds)}
          label="Local time"
          onChange={updateDate}
          timeFormat={preferences.timeFormat}
          timeZone={localTimeZone}
        />
        {preferences.timeZones
          .filter((timeZone) => timeZone !== localTimeZone)
          .map((timeZone) => (
            <DateRow
              date={new Date(milliseconds)}
              key={timeZone}
              label={timeZone === "UTC" ? "UTC time" : timeZone}
              onChange={updateDate}
              timeFormat={preferences.timeFormat}
              timeZone={timeZone}
            />
          ))}
      </Stack>
    </ToolPage>
  );
}
