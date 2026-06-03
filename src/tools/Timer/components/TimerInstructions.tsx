import { List, Text } from "@mantine/core";

export default function TimerInstructions() {
  return (
    <>
      <Text mb="sm">
        Set a timer by pressing the + and - buttons or by typing a number of
        minutes.
      </Text>
      <List spacing="xs">
        <List.Item>
          Type <strong>:</strong> to specify a number of seconds.
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
