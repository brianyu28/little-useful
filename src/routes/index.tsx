import {
  Container,
  Group,
  SimpleGrid,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import React from "react";
import ToolCard from "../components/ToolCard";
import { tools } from "../tools/tools";
import { searchTools } from "../utils/searchTools";
import styles from "./index.module.scss";

export const Route = createFileRoute("/")({ component: App });

const mobileSearchMediaQuery = "(max-width: 48em)";
const mobileSearchScrollOffset = 12;

function App() {
  const [query, setQuery] = React.useState("");
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [focusedToolPath, setFocusedToolPath] = React.useState<string>();
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const shouldScrollSearchOnFocusRef = React.useRef(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (window.matchMedia(mobileSearchMediaQuery).matches) {
      return;
    }

    searchInputRef.current?.focus();
  }, []);

  const filteredTools = React.useMemo(
    () => (query.trim() ? searchTools(query) : tools),
    [query],
  );

  const handleSearchKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && query.trim() && filteredTools[0]) {
        navigate({ to: filteredTools[0].path });
      }
    },
    [filteredTools, navigate, query],
  );

  const handleSearchBlur = React.useCallback(() => {
    shouldScrollSearchOnFocusRef.current = false;
    setSearchFocused(false);
  }, []);

  const handleSearchChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.currentTarget.value);
      setSearchFocused(true);
    },
    [],
  );

  const handleSearchFocus = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const input = event.currentTarget;

      setSearchFocused(true);

      if (!window.matchMedia(mobileSearchMediaQuery).matches) {
        return;
      }

      if (!shouldScrollSearchOnFocusRef.current) {
        return;
      }

      shouldScrollSearchOnFocusRef.current = false;

      window.requestAnimationFrame(() => {
        window.scrollTo({
          behavior: "smooth",
          top: Math.max(
            input.getBoundingClientRect().top +
              window.scrollY -
              mobileSearchScrollOffset,
            0,
          ),
        });
      });
    },
    [],
  );

  const handleSearchPointerDown = React.useCallback(() => {
    shouldScrollSearchOnFocusRef.current = window.matchMedia(
      mobileSearchMediaQuery,
    ).matches;
  }, []);

  return (
    <Container component="main" className={styles.home} size="lg">
      <header className={styles.header}>
        <Group className={styles.branding} justify="center">
          <img
            className={styles.logo}
            alt="Little Useful Logo"
            src="/logo.png"
          />
          <div className={styles.heading}>
            <Title order={1}>Little Useful</Title>
            <Text c="dimmed" mt="xs">
              A free collection of little useful tools
            </Text>
          </div>
        </Group>
        <TextInput
          aria-label="Search tools"
          className={styles.search}
          classNames={{ input: styles.searchInput }}
          leftSection={<Search size={20} />}
          onBlur={handleSearchBlur}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onKeyDown={handleSearchKeyDown}
          onPointerDown={handleSearchPointerDown}
          placeholder="Search tools..."
          ref={searchInputRef}
          radius="xl"
          size="lg"
          value={query}
        />
      </header>

      {filteredTools.length ? (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {filteredTools.map((tool, index) => (
            <ToolCard
              isHighlighted={
                query.trim().length > 0 &&
                ((searchFocused && index === 0) ||
                  focusedToolPath === tool.path)
              }
              key={tool.path}
              onBlur={() => setFocusedToolPath(undefined)}
              onFocus={() => setFocusedToolPath(tool.path)}
              tool={tool}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Text c="dimmed" ta="center">
          No tools found.
        </Text>
      )}
    </Container>
  );
}
