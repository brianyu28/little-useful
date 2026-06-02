import { ActionIcon, Button, Group, Popover, Stack, Text } from "@mantine/core";
import { Plus, Trash2 } from "lucide-react";
import React from "react";
import styles from "./ColorPalette.module.scss";

interface Props {
  readonly onAdd: () => void;
  readonly onRemove: (paletteColor: string) => void;
  readonly onSelect: (paletteColor: string) => void;
  readonly palette: readonly string[];
}

export default function ColorPalette({
  onAdd,
  onRemove,
  onSelect,
  palette,
}: Props) {
  const [menuColor, setMenuColor] = React.useState<string>();

  return (
    <Stack className={styles.palette} gap="sm">
      <Group justify="space-between">
        <Text fw={700}>Color palette</Text>
        <ActionIcon
          aria-label="Add current color to palette"
          onClick={onAdd}
          variant="light"
        >
          <Plus size={16} />
        </ActionIcon>
      </Group>
      {palette.length ? (
        <Group gap="sm">
          {palette.map((paletteColor) => (
            <Popover
              key={paletteColor}
              onChange={(opened) => !opened && setMenuColor(undefined)}
              opened={menuColor === paletteColor}
              position="bottom-start"
            >
              <Popover.Target>
                <button
                  aria-label={`Use ${paletteColor}`}
                  className={styles.swatch}
                  onClick={() => onSelect(paletteColor)}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    setMenuColor(paletteColor);
                  }}
                  style={{ backgroundColor: paletteColor }}
                  title={`${paletteColor} (right-click to remove)`}
                  type="button"
                />
              </Popover.Target>
              <Popover.Dropdown p={4}>
                <Button
                  color="red"
                  leftSection={<Trash2 size={14} />}
                  onClick={() => {
                    onRemove(paletteColor);
                    setMenuColor(undefined);
                  }}
                  size="compact-sm"
                  variant="subtle"
                >
                  Remove
                </Button>
              </Popover.Dropdown>
            </Popover>
          ))}
        </Group>
      ) : (
        <Text c="dimmed" size="sm">
          Save colors here for quick access
        </Text>
      )}
    </Stack>
  );
}
