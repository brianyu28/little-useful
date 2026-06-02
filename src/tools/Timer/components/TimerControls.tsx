import { ActionIcon, Text } from "@mantine/core";
import classNames from "classnames";
import { Minus, Plus } from "lucide-react";
import React from "react";
import { EditingPart } from "../types/EditingPart";
import { TimerStatus } from "../types/TimerStatus";
import { parseTimerEntry } from "../utils/parseTimerEntry";
import styles from "./TimerControls.module.scss";

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Props {
  readonly editingPart?: EditingPart;
  readonly entry: string;
  readonly minutesInputRef: React.RefObject<HTMLInputElement | null>;
  readonly onAdjustMinutes: (amount: number) => void;
  readonly onBeginEditing: (part: EditingPart) => void;
  readonly onBlurInput: () => void;
  readonly onMinutesChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  readonly onMinutesKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => void;
  readonly onSecondsChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  readonly onSecondsKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => void;
  readonly progress: number;
  readonly secondsInputRef: React.RefObject<HTMLInputElement | null>;
  readonly showSeconds: boolean;
  readonly status: TimerStatus;
  readonly timeParts: { readonly minutes: string; readonly seconds: string };
}

export default function TimerControls({
  editingPart,
  entry,
  minutesInputRef,
  onAdjustMinutes,
  onBeginEditing,
  onBlurInput,
  onMinutesChange,
  onMinutesKeyDown,
  onSecondsChange,
  onSecondsKeyDown,
  progress,
  secondsInputRef,
  showSeconds,
  status,
  timeParts,
}: Props) {
  return (
    <div className={styles.timerControls}>
      {status === TimerStatus.IDLE ? (
        <ActionIcon
          aria-label="Subtract one minute"
          className={styles.adjust}
          disabled={parseTimerEntry(entry) < 60_000}
          onClick={() => onAdjustMinutes(-1)}
          radius="xl"
          size="lg"
          variant="light"
        >
          <Minus size={20} />
        </ActionIcon>
      ) : (
        <div />
      )}
      <div className={styles.circle}>
        <svg
          aria-label="Timer progress"
          className={styles.ring}
          role="img"
          viewBox="0 0 100 100"
        >
          <circle className={styles.track} cx="50" cy="50" r={RADIUS} />
          <circle
            className={styles.progress}
            cx="50"
            cy="50"
            data-testid="timer-progress"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          />
        </svg>
        <div aria-live="polite" className={styles.time}>
          <div className={styles.minutes}>
            {editingPart === EditingPart.MINUTES ? (
              <input
                aria-label="Timer minutes"
                className={classNames(styles.minutesInput, {
                  [styles.compactMinutes]: timeParts.minutes.length >= 3,
                })}
                onBlur={onBlurInput}
                onChange={onMinutesChange}
                onKeyDown={onMinutesKeyDown}
                ref={minutesInputRef}
                value={timeParts.minutes}
              />
            ) : (
              <Text
                className={classNames(styles.minutesValue, {
                  [styles.compactMinutes]: timeParts.minutes.length >= 3,
                  [styles.editableValue]: status === TimerStatus.IDLE,
                })}
                data-testid="timer-minutes"
                onClick={() => onBeginEditing(EditingPart.MINUTES)}
              >
                {timeParts.minutes}
              </Text>
            )}
          </div>
          {showSeconds && (
            <div className={styles.seconds}>
              {editingPart === EditingPart.SECONDS ? (
                <input
                  aria-label="Timer seconds"
                  className={styles.secondsInput}
                  onBlur={onBlurInput}
                  onChange={onSecondsChange}
                  onKeyDown={onSecondsKeyDown}
                  ref={secondsInputRef}
                  value={timeParts.seconds}
                />
              ) : (
                <Text
                  className={classNames(styles.secondsValue, {
                    [styles.editableValue]: status === TimerStatus.IDLE,
                  })}
                  data-testid="timer-seconds"
                  onClick={() => onBeginEditing(EditingPart.SECONDS)}
                >
                  {timeParts.seconds}
                </Text>
              )}
            </div>
          )}
        </div>
      </div>
      {status === TimerStatus.IDLE ? (
        <ActionIcon
          aria-label="Add one minute"
          className={styles.adjust}
          onClick={() => onAdjustMinutes(1)}
          radius="xl"
          size="lg"
          variant="light"
        >
          <Plus size={20} />
        </ActionIcon>
      ) : (
        <div />
      )}
    </div>
  );
}
