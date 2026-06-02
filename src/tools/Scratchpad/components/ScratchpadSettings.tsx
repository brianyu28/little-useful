import { Switch } from "@mantine/core";

interface Props {
  readonly isSaveNoteOn: boolean;
  readonly onSaveNoteChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

export function ScratchpadSettings({ isSaveNoteOn, onSaveNoteChange }: Props) {
  return (
    <>
      <Switch
        checked={isSaveNoteOn}
        description="When on, your note is stored in your browser so that it appears next time you visit."
        label="Save note in browser"
        onChange={onSaveNoteChange}
      />
    </>
  );
}
