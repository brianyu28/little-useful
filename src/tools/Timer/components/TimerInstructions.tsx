import { List, Text } from "@mantine/core";

export default function TimerInstructions() {
  return (
    <>
      <Text mb="sm">
        Set a timer with the circle controls or type a duration directly.
      </Text>
      <List spacing="xs">
        <List.Item>
          Type minutes. Press <strong>:</strong> to switch to seconds for a more
          precise timer.
        </List.Item>
        <List.Item>
          Press <strong>Enter</strong> to start.
        </List.Item>
        <List.Item>
          Press <strong>Space</strong> to pause or resume.
        </List.Item>
        <List.Item>
          Press <strong>Delete</strong> or <strong>Backspace</strong> to reset.
        </List.Item>
      </List>
    </>
  );
}
