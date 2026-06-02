import {
  Button,
  ColorInput,
  CopyButton,
  Group,
  ColorPicker as MantineColorPicker,
  Stack,
} from "@mantine/core";
import { Check, Copy } from "lucide-react";
import React from "react";
import ToolPage from "../../components/ToolPage";
import { useToolState } from "../../hooks/useToolState";
import styles from "./ColorPicker.module.scss";
import { ColorPickerConfig } from "./ColorPickerConfig";
import ColorChannelInput from "./components/ColorChannelInput";
import ColorPalette from "./components/ColorPalette";
import ColorPickerSettings from "./components/ColorPickerSettings";
import { ColorChannel } from "./types/ColorChannel";
import { RgbScale } from "./types/RgbScale";
import { getColorForHex } from "./utils/getColorForHex";
import { getHexForColor } from "./utils/getHexForColor";
import { normalizeHex } from "./utils/normalizeHex";
import { colorDefaults, colorPreferencesSchema } from "./utils/preferences";

const INITIAL_COLOR = "#4f46e5";

export default function ColorPicker() {
  const [color, setColor] = React.useState(INITIAL_COLOR);
  const [hexInput, setHexInput] = React.useState(INITIAL_COLOR);
  const [preferences, setPreferences] = useToolState(
    "color",
    colorDefaults,
    colorPreferencesSchema,
  );
  const channels = getColorForHex(color);
  const scaleMax = preferences.rgbScale === RgbScale.UNIT ? 1 : 255;

  const updateColor = React.useCallback((nextColor: string) => {
    const normalized = normalizeHex(nextColor);
    if (!normalized) return;
    setColor(normalized);
    setHexInput(normalized);
  }, []);

  const updateHexInput = React.useCallback((nextColor: string) => {
    setHexInput(nextColor);
    const normalized = normalizeHex(nextColor);
    if (normalized) setColor(normalized);
  }, []);

  const updateChannel = React.useCallback(
    (channel: ColorChannel, value: number | string) => {
      if (typeof value !== "number") return;
      updateColor(
        getHexForColor({
          ...channels,
          [channel]: Math.max(
            0,
            Math.min(255, Math.round((value / scaleMax) * 255)),
          ),
        }),
      );
    },
    [channels, scaleMax, updateColor],
  );

  const updateRed = React.useCallback(
    (value: number | string) => updateChannel(ColorChannel.RED, value),
    [updateChannel],
  );

  const updateGreen = React.useCallback(
    (value: number | string) => updateChannel(ColorChannel.GREEN, value),
    [updateChannel],
  );

  const updateBlue = React.useCallback(
    (value: number | string) => updateChannel(ColorChannel.BLUE, value),
    [updateChannel],
  );

  const addToPalette = React.useCallback(() => {
    if (preferences.palette.includes(color)) return;
    setPreferences({
      ...preferences,
      palette: [...preferences.palette, color],
    });
  }, [color, preferences, setPreferences]);

  const removePaletteColor = React.useCallback(
    (colorToRemove: string) => {
      setPreferences({
        ...preferences,
        palette: preferences.palette.filter(
          (paletteColor) => paletteColor !== colorToRemove,
        ),
      });
    },
    [preferences, setPreferences],
  );

  const handleHexBlur = React.useCallback(() => setHexInput(color), [color]);

  const renderCopyButton = React.useCallback(
    ({ copied, copy }: { copied: boolean; copy: () => void }) => (
      <Button
        leftSection={copied ? <Check size={16} /> : <Copy size={16} />}
        onClick={copy}
        variant="subtle"
      >
        Copy
      </Button>
    ),
    [],
  );

  return (
    <ToolPage
      description={ColorPickerConfig.description}
      settings={
        <ColorPickerSettings onChange={setPreferences} value={preferences} />
      }
      title={ColorPickerConfig.title}
    >
      <Stack gap="lg">
        <div className={styles.colorControls}>
          <div
            aria-label={`Selected color ${color}`}
            className={styles.preview}
            role="img"
            style={{ backgroundColor: color }}
          />
          <MantineColorPicker
            className={styles.picker}
            format="hex"
            fullWidth
            onChange={updateColor}
            size="lg"
            value={color}
          />
        </div>
        <Group align="end" gap="sm" wrap="nowrap">
          <ColorInput
            className={styles.hexInput}
            format="hex"
            label="Hex"
            onBlur={handleHexBlur}
            onChange={updateHexInput}
            value={hexInput}
            withPicker={false}
          />
          <CopyButton value={color}>{renderCopyButton}</CopyButton>
        </Group>
        <Stack gap="sm">
          <ColorChannelInput
            label="Red"
            maxValue={scaleMax}
            onChange={updateRed}
            value={(channels.red / 255) * scaleMax}
          />
          <ColorChannelInput
            label="Green"
            maxValue={scaleMax}
            onChange={updateGreen}
            value={(channels.green / 255) * scaleMax}
          />
          <ColorChannelInput
            label="Blue"
            maxValue={scaleMax}
            onChange={updateBlue}
            value={(channels.blue / 255) * scaleMax}
          />
        </Stack>
        <ColorPalette
          onAdd={addToPalette}
          onRemove={removePaletteColor}
          onSelect={updateColor}
          palette={preferences.palette}
        />
      </Stack>
    </ToolPage>
  );
}
