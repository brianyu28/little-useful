import { Alert, Button, Group, Text } from "@mantine/core";
import { Pause, Play, RotateCcw } from "lucide-react";
import React from "react";
import ToolPage from "../../components/ToolPage";
import { hasCommandModifier } from "../../utils/hasCommandModifier";
import { requestNotificationPermission } from "../../utils/requestNotificationPermission";
import styles from "./Timer.module.scss";
import { TimerConfig } from "./TimerConfig";
import TimerControls from "./components/TimerControls";
import TimerInstructions from "./components/TimerInstructions";
import { EditingPart } from "./types/EditingPart";
import { TimerStatus } from "./types/TimerStatus";
import { ensureSecondsEntry } from "./utils/ensureSecondsEntry";
import { formatDuration } from "./utils/formatDuration";
import { formatEndTime } from "./utils/formatEndTime";
import { formatEntry } from "./utils/formatEntry";
import { formatRemaining } from "./utils/formatRemaining";
import { getEntryParts } from "./utils/getEntryParts";
import { getRawMinutes } from "./utils/getRawMinutes";
import { getRawSeconds } from "./utils/getRawSeconds";
import { getRemainingParts } from "./utils/getRemainingParts";
import { notifyFinished } from "./utils/notifyFinished";
import { parseTimerEntry } from "./utils/parseTimerEntry";
import { updateEntryPart } from "./utils/updateEntryPart";

const PAGE_TITLE = "Timer | Little Useful";

export default function Timer() {
  const [entry, setEntry] = React.useState("");
  const [hasFinished, setHasFinished] = React.useState(false);
  const [editingPart, setEditingPart] = React.useState<EditingPart>();
  const [duration, setDuration] = React.useState(0);
  const [remaining, setRemaining] = React.useState(0);
  const [endsAt, setEndsAt] = React.useState<number>();
  const [status, setStatus] = React.useState<TimerStatus>(TimerStatus.IDLE);
  const minutesInputRef = React.useRef<HTMLInputElement>(null);
  const secondsInputRef = React.useRef<HTMLInputElement>(null);

  const reset = React.useCallback(() => {
    setDuration(0);
    setEndsAt(undefined);
    setEntry("");
    setHasFinished(false);
    setEditingPart(undefined);
    setRemaining(0);
    setStatus(TimerStatus.IDLE);
  }, []);

  const pause = React.useCallback(() => {
    if (status === TimerStatus.RUNNING) {
      setRemaining((current) =>
        endsAt == null ? current : Math.max(0, endsAt - Date.now()),
      );
      setEndsAt(undefined);
      setStatus(TimerStatus.PAUSED);
      return;
    }

    if (status === TimerStatus.PAUSED && remaining > 0) {
      setEndsAt(Date.now() + remaining);
      setStatus(TimerStatus.RUNNING);
    }
  }, [endsAt, remaining, status]);

  const start = React.useCallback(() => {
    const nextDuration = parseTimerEntry(entry);
    if (nextDuration <= 0) return;

    requestNotificationPermission();
    setHasFinished(false);
    setDuration(nextDuration);
    setRemaining(nextDuration);
    setEndsAt(Date.now() + nextDuration);
    setStatus(TimerStatus.RUNNING);
    setEditingPart(undefined);
  }, [entry]);

  const adjustMinutes = React.useCallback((amount: number) => {
    setEntry((current) => {
      const milliseconds = Math.max(
        0,
        parseTimerEntry(current) + amount * 60_000,
      );
      return milliseconds === 0 ? "" : formatEntry(milliseconds);
    });
  }, []);

  const beginEditing = React.useCallback(
    (part: EditingPart) => {
      if (status !== TimerStatus.IDLE) return;
      setEditingPart(part);
    },
    [status],
  );

  const updateRemaining = React.useCallback(() => {
    if (endsAt == null) return;
    const nextRemaining = Math.max(0, endsAt - Date.now());
    setRemaining(nextRemaining);

    if (nextRemaining === 0) {
      setEndsAt(undefined);
      setStatus(TimerStatus.IDLE);
      setEntry("");
      setHasFinished(true);
      notifyFinished();
    }
  }, [endsAt]);

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      const isInput = event.target instanceof HTMLInputElement;

      if (event.key === "Delete" || (event.key === "Backspace" && !isInput)) {
        event.preventDefault();
        reset();
      } else if (event.key === " " && status !== TimerStatus.IDLE) {
        event.preventDefault();
        pause();
      } else if (event.key === "Enter" && status === TimerStatus.IDLE) {
        event.preventDefault();
        start();
      } else if (
        !isInput &&
        status === TimerStatus.IDLE &&
        !hasCommandModifier(event) &&
        /^\d$/.test(event.key)
      ) {
        event.preventDefault();
        setEntry((current) => {
          const part = current.includes(":")
            ? EditingPart.SECONDS
            : EditingPart.MINUTES;
          const rawValue =
            part === EditingPart.MINUTES
              ? getRawMinutes(current)
              : getRawSeconds(current);
          return updateEntryPart(current, part, `${rawValue}${event.key}`);
        });
      } else if (status === TimerStatus.IDLE && event.key === ":" && !isInput) {
        event.preventDefault();
        setEntry((current) => ensureSecondsEntry(current));
      }
    },
    [pause, reset, start, status],
  );

  const handleBlurInput = React.useCallback(
    () => setEditingPart(undefined),
    [],
  );

  const handleMinutesChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setEntry((current) =>
        updateEntryPart(current, EditingPart.MINUTES, event.target.value),
      ),
    [],
  );

  const handleMinutesKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === ":") {
        event.preventDefault();
        setEntry((current) => ensureSecondsEntry(current));
        setEditingPart(EditingPart.SECONDS);
      } else if (event.key === "Enter") {
        start();
      }
    },
    [start],
  );

  const handleSecondsChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setEntry((current) =>
        updateEntryPart(current, EditingPart.SECONDS, event.target.value),
      ),
    [],
  );

  const handleSecondsKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") start();
    },
    [start],
  );

  const handleFinishedClose = React.useCallback(
    () => setHasFinished(false),
    [],
  );

  React.useEffect(() => {
    const input =
      editingPart === EditingPart.MINUTES
        ? minutesInputRef.current
        : secondsInputRef.current;
    input?.focus();
    input?.select();
  }, [editingPart]);

  React.useEffect(() => {
    if (status !== TimerStatus.RUNNING || endsAt == null) return;
    const timeout = window.setTimeout(updateRemaining, 0);
    const interval = window.setInterval(updateRemaining, 100);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [endsAt, status, updateRemaining]);

  React.useEffect(() => {
    document.title =
      status === TimerStatus.RUNNING
        ? `${formatRemaining(remaining)} | Little Useful`
        : PAGE_TITLE;
  }, [remaining, status]);

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const progress = duration === 0 ? 0 : remaining / duration;
  const timeParts =
    status === TimerStatus.IDLE
      ? getEntryParts(entry)
      : getRemainingParts(remaining);
  const showSeconds = status !== TimerStatus.IDLE || entry.includes(":");
  const endMessage =
    status === TimerStatus.RUNNING && endsAt != null
      ? `${formatDuration(duration)} timer will end at ${formatEndTime(endsAt)}`
      : undefined;

  return (
    <ToolPage
      contentClassName={styles.timer}
      description={TimerConfig.description}
      instructions={<TimerInstructions />}
      title={TimerConfig.title}
    >
      <TimerControls
        editingPart={editingPart}
        entry={entry}
        minutesInputRef={minutesInputRef}
        onAdjustMinutes={adjustMinutes}
        onBeginEditing={beginEditing}
        onBlurInput={handleBlurInput}
        onMinutesChange={handleMinutesChange}
        onMinutesKeyDown={handleMinutesKeyDown}
        onSecondsChange={handleSecondsChange}
        onSecondsKeyDown={handleSecondsKeyDown}
        progress={progress}
        secondsInputRef={secondsInputRef}
        showSeconds={showSeconds}
        status={status}
        timeParts={timeParts}
      />

      <Group justify="center">
        {status === TimerStatus.IDLE ? (
          <Button
            disabled={parseTimerEntry(entry) <= 0}
            leftSection={<Play size={16} />}
            onClick={start}
          >
            Start
          </Button>
        ) : (
          <Button
            leftSection={
              status === TimerStatus.RUNNING ? (
                <Pause size={16} />
              ) : (
                <Play size={16} />
              )
            }
            onClick={pause}
          >
            {status === TimerStatus.RUNNING ? "Pause" : "Resume"}
          </Button>
        )}
        <Button
          leftSection={<RotateCcw size={16} />}
          onClick={reset}
          variant="default"
        >
          Reset
        </Button>
      </Group>

      {endMessage != null && (
        <Text className={styles.endMessage}>{endMessage}</Text>
      )}
      {hasFinished && (
        <Alert
          className={styles.finished}
          color="indigo"
          onClose={handleFinishedClose}
          title="Timer complete"
          variant="light"
          withCloseButton
        >
          Your countdown has finished.
        </Alert>
      )}
    </ToolPage>
  );
}
