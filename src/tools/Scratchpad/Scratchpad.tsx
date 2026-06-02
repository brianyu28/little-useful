import { Textarea } from "@mantine/core";
import throttle from "lodash-es/throttle";
import React from "react";
import { z } from "zod";
import ToolPage from "../../components/ToolPage";
import { useToolState } from "../../hooks/useToolState";
import { ScratchpadSettings } from "./components/ScratchpadSettings";
import styles from "./Scratchpad.module.scss";
import { ScratchpadConfig } from "./ScratchpadConfig";
import {
  saveScratchpadState,
  scratchpadDefaults,
} from "./utils/saveScratchpadState";

const scratchpadSchema = z.object({ saveNote: z.boolean(), text: z.string() });

export default function Scratchpad() {
  const saveScratchpad = React.useMemo(
    () => throttle(saveScratchpadState, 500),
    [],
  );
  const [scratchpad, setScratchpad] = useToolState(
    "scratchpad",
    scratchpadDefaults,
    scratchpadSchema,
    saveScratchpad,
  );

  React.useEffect(() => () => saveScratchpad.flush(), [saveScratchpad]);

  const handleSaveNoteChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const saveNote = event.currentTarget.checked;
      const nextScratchpad = { ...scratchpad, saveNote };

      if (!saveNote) {
        saveScratchpad.cancel();
        saveScratchpadState("scratchpad", nextScratchpad);
      }

      setScratchpad(nextScratchpad);
    },
    [saveScratchpad, scratchpad, setScratchpad],
  );

  const handleTextChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) =>
      setScratchpad({ ...scratchpad, text: event.currentTarget.value }),
    [scratchpad, setScratchpad],
  );

  return (
    <ToolPage
      contentClassName={styles.paper}
      contentPadding="xs"
      description={ScratchpadConfig.description}
      settings={
        <ScratchpadSettings
          isSaveNoteOn={scratchpad.saveNote}
          onSaveNoteChange={handleSaveNoteChange}
        />
      }
      title={ScratchpadConfig.title}
    >
      <Textarea
        aria-label="Scratchpad"
        autoFocus
        classNames={{ input: styles.input }}
        onChange={handleTextChange}
        value={scratchpad.text}
      />
    </ToolPage>
  );
}
