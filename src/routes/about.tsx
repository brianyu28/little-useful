import { Button, Container, Group, Stack, Text, Title } from "@mantine/core";
import { Link, createFileRoute } from "@tanstack/react-router";
import styles from "./about.module.scss";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  return (
    <Container component="main" className={styles.page} size="sm">
      <Stack gap="md" mt="xl">
        <img className={styles.logo} src="/logo.png" alt="Little Useful" />
        <Title order={1}>About Little Useful</Title>
        <Text>
          Little Useful is a free, open-source collection of web utilities.
        </Text>
        <Text>
          Little Useful is maintained by{" "}
          <a href="https://brianyu.me">Brian Yu</a>.
        </Text>
        <Group>
          <Button component={Link} to="/" w="fit-content">
            Find a tool
          </Button>
          <Button
            component="a"
            href="https://github.com/brianyu28/little-useful"
            variant="default"
          >
            Contribute
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
