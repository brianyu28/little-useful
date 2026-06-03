import { ActionIcon, Button, Stack, Text, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { Plus, Trash2 } from "lucide-react";
import React from "react";
import { z } from "zod";
import ToolPage from "../../components/ToolPage";
import { useToolState } from "../../hooks/useToolState";
import styles from "./EventCountdown.module.scss";
import { EventCountdownConfig } from "./EventCountdownConfig";
import EventCountdownInstructions from "./components/EventCountdownInstructions";

interface CountdownEvent {
  id: string;
  startsAt: string;
  title: string;
}

const eventSchema = z.object({
  id: z.string(),
  startsAt: z.string(),
  title: z.string(),
});
const eventCountdownSchema = z.object({ events: z.array(eventSchema) });

const DEFAULT_TITLE = "New event";

function createEvent(offset = 24 * 60 * 60 * 1000): CountdownEvent {
  return {
    id: crypto.randomUUID(),
    startsAt: formatDateTimeInput(new Date(Date.now() + offset)),
    title: DEFAULT_TITLE,
  };
}

const eventCountdownDefaults = { events: [] as CountdownEvent[] };

function formatDateTimeInput(date: Date) {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day} ${hours}:${minutes}:00`;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatCountdown(startsAt: string, now: number) {
  const target = getEventTime(normalizeDateTimeValue(startsAt));
  if (!Number.isFinite(target)) return "Choose a date and time";

  const milliseconds = target - now;
  const isFuture = milliseconds > 0;
  const totalSeconds = isFuture
    ? Math.ceil(milliseconds / 1000)
    : Math.floor(Math.abs(milliseconds) / 1000);
  const duration = formatDuration(totalSeconds);

  return isFuture ? `in ${duration}` : `${duration} ago`;
}

function getEventTime(startsAt: string) {
  const match = startsAt.match(
    /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})(?::(\d{2}))?$/,
  );
  if (match == null) return Number.NaN;

  const [, year, month, day, hours, minutes, seconds = "00"] = match;
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    Number(seconds),
  ).getTime();
}

function normalizeDateTimeValue(startsAt: string) {
  if (!startsAt) return "";
  const [date, time = "00:00"] = startsAt.replace("T", " ").split(" ");
  const [hours = "00", minutes = "00", seconds = "00"] = time.split(":");
  return `${date} ${hours}:${minutes}:${seconds}`;
}

function getPickerTimeValue(startsAt: string) {
  const [, time = "00:00:00"] = normalizeDateTimeValue(startsAt).split(" ");
  return time;
}

function formatDuration(totalSeconds: number) {
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [
    days > 0 ? pluralize(days, "day") : undefined,
    days > 0 || hours > 0 ? pluralize(hours, "hour") : undefined,
    days > 0 || hours > 0 || minutes > 0
      ? pluralize(minutes, "minute")
      : undefined,
    pluralize(seconds, "second"),
  ];

  return parts.filter(Boolean).join(", ");
}

function pluralize(value: number, unit: string) {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}

export default function EventCountdown() {
  const [{ events }, setCountdown] = useToolState(
    "event-countdown",
    eventCountdownDefaults,
    eventCountdownSchema,
  );
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const updateEvent = React.useCallback(
    (id: string, patch: Partial<Omit<CountdownEvent, "id">>) => {
      setCountdown((current) => ({
        events: current.events.map((event) =>
          event.id === id ? { ...event, ...patch } : event,
        ),
      }));
    },
    [setCountdown],
  );

  const addEvent = React.useCallback(() => {
    setCountdown((current) => ({ events: [...current.events, createEvent()] }));
  }, [setCountdown]);

  const removeEvent = React.useCallback(
    (id: string) => {
      setCountdown((current) => ({
        events: current.events.filter((event) => event.id !== id),
      }));
    },
    [setCountdown],
  );

  return (
    <ToolPage
      contentClassName={styles.toolSurface}
      contentPadding={0}
      description={EventCountdownConfig.description}
      title={EventCountdownConfig.title}
      instructions={<EventCountdownInstructions />}
    >
      <Stack className={styles.events}>
        {events.map((event, index) => (
          <section
            aria-label={event.title.trim() || `Event ${index + 1}`}
            className={styles.eventCard}
            key={event.id}
          >
            <div className={styles.eventHeader}>
              <TextInput
                aria-label={`Event ${index + 1} title`}
                classNames={{ input: styles.titleInput }}
                onChange={(changeEvent) =>
                  updateEvent(event.id, { title: changeEvent.target.value })
                }
                placeholder="Event title"
                value={event.title}
              />
              <DateTimePicker
                aria-label={`Event ${index + 1} date and time`}
                className={styles.dateTimePicker}
                clearable={false}
                defaultTimeValue={getPickerTimeValue(event.startsAt)}
                onChange={(value) =>
                  updateEvent(event.id, {
                    startsAt:
                      value == null
                        ? ""
                        : normalizeDateTimeValue(String(value)),
                  })
                }
                timePickerProps={{
                  format: "12h",
                  minutesStep: 1,
                }}
                value={normalizeDateTimeValue(event.startsAt) || null}
                valueFormat="MMM D, YYYY h:mm A"
              />
              <ActionIcon
                aria-label={`Delete ${event.title || "event"}`}
                color="red"
                onClick={() => removeEvent(event.id)}
                size="lg"
                variant="subtle"
              >
                <Trash2 size={18} />
              </ActionIcon>
            </div>

            <Text className={styles.countdown}>
              {formatCountdown(event.startsAt, now)}
            </Text>
          </section>
        ))}

        {events.length === 0 && (
          <Text c="dimmed" ta="center">
            No events yet.
          </Text>
        )}

        <Button
          className={styles.newButton}
          leftSection={<Plus size={16} />}
          onClick={addEvent}
          variant="default"
        >
          New
        </Button>
      </Stack>
    </ToolPage>
  );
}
