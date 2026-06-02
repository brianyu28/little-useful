import {
  Button,
  Container,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, FileQuestion } from "lucide-react";
import styles from "./NotFound.module.scss";

export default function NotFound() {
  return (
    <Container component="main" className={styles.notFound} size="sm">
      <Stack align="center" gap="md">
        <ThemeIcon radius="xl" size={72} variant="light">
          <FileQuestion size={36} />
        </ThemeIcon>
        <Text c="dimmed" fw={700} size="sm">
          404
        </Text>
        <Title order={1} ta="center">
          Page Not Found
        </Title>
        <Text c="dimmed" maw={440} ta="center">
          The page you are looking for does not exist.
        </Text>
        <Button
          component={Link}
          leftSection={<ArrowLeft size={16} />}
          mt="sm"
          to="/"
        >
          Back to Little Useful
        </Button>
      </Stack>
    </Container>
  );
}
