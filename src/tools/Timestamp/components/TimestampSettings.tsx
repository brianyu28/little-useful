import { MultiSelect, SegmentedControl, Stack, Text } from "@mantine/core";
import React from "react";
import type { z } from "zod";
import { timestampPreferencesSchema } from "../utils/preferences";

import { TimeFormat } from "../types/TimeFormat";
import { getTimeZones } from "../utils/getTimeZones";

interface Props {
  readonly onChange: (
    preferences: z.infer<typeof timestampPreferencesSchema>,
  ) => void;
  readonly value: z.infer<typeof timestampPreferencesSchema>;
}

export default function TimestampSettings({ onChange, value }: Props) {
  const availableTimeZones = React.useMemo(() => getTimeZones(), []);

  const handleTimeFormatChange = React.useCallback(
    (timeFormat: string) => {
      const result =
        timestampPreferencesSchema.shape.timeFormat.safeParse(timeFormat);
      if (result.success) onChange({ ...value, timeFormat: result.data });
    },
    [onChange, value],
  );

  const handleTimeZonesChange = React.useCallback(
    (timeZones: string[]) => onChange({ ...value, timeZones }),
    [onChange, value],
  );

  return (
    <Stack gap="lg">
      <Stack gap={6}>
        <Text fw={500} size="sm">
          Time format
        </Text>
        <SegmentedControl
          data={[
            { label: "12-hour", value: TimeFormat.TWELVE },
            { label: "24-hour", value: TimeFormat.TWENTY_FOUR },
          ]}
          onChange={handleTimeFormatChange}
          value={value.timeFormat}
        />
      </Stack>
      <MultiSelect
        data={availableTimeZones}
        description="Local time is always shown."
        label="Additional time zones"
        onChange={handleTimeZonesChange}
        placeholder="Choose time zones"
        searchable
        value={value.timeZones}
      />
    </Stack>
  );
}
