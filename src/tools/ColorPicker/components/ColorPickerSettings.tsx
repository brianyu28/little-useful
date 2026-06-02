import { SegmentedControl, Stack, Text } from "@mantine/core";
import type { z } from "zod";
import { colorPreferencesSchema } from "../utils/preferences";

import React from "react";
import { RgbScale } from "../types/RgbScale";

interface Props {
  readonly onChange: (
    preferences: z.infer<typeof colorPreferencesSchema>,
  ) => void;
  readonly value: z.infer<typeof colorPreferencesSchema>;
}

export default function ColorPickerSettings({ onChange, value }: Props) {
  const handleRgbScaleChange = React.useCallback(
    (rgbScale: string) => {
      const result = colorPreferencesSchema.shape.rgbScale.safeParse(rgbScale);
      if (result.success) onChange({ ...value, rgbScale: result.data });
    },
    [onChange, value],
  );

  return (
    <Stack gap={6}>
      <Text fw={500} size="sm">
        RGB scale
      </Text>
      <SegmentedControl
        data={[
          { label: "0-255", value: RgbScale.BYTE },
          { label: "0-1", value: RgbScale.UNIT },
        ]}
        onChange={handleRgbScaleChange}
        value={value.rgbScale}
      />
    </Stack>
  );
}
