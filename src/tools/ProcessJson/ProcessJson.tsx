import { useToolState } from "#/hooks/useToolState";
import {
  ActionIcon,
  Alert,
  Group,
  Loader,
  Menu,
  NumberInput,
  Switch,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import * as jq from "jq-wasm";
import { Check, Clipboard, ClipboardCheck, Settings } from "lucide-react";
import React from "react";
import { z } from "zod";
import ToolPage from "../../components/ToolPage";
import CodeMirrorEditor from "./components/CodeMirrorEditor";
import ProcessJSONInstructions from "./components/ProcessJsonInstructions";
import styles from "./ProcessJson.module.scss";
import { ProcessJSONConfig } from "./ProcessJsonConfig";
import { ProcessStatus } from "./types/ProcessStatus";

const processJsonDefaults = {
  indentationWidth: 2,
  isCompactOutput: false,
  rawOutput: false,
};

const processJsonSchema = z.object({
  indentationWidth: z.number().int().min(0).max(7),
  isCompactOutput: z.boolean(),
  rawOutput: z.boolean(),
});

export default function ProcessJSON() {
  const [toolState, setToolState] = useToolState(
    "jq",
    processJsonDefaults,
    processJsonSchema,
  );
  const [input, setInput] = React.useState("{}");
  const [query, setQuery] = React.useState(".");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<ProcessStatus>(ProcessStatus.IDLE);
  const [isCopied, setIsCopied] = React.useState(false);

  const doneTimeoutRef = React.useRef<number>(undefined);
  const copyTimeoutRef = React.useRef<number>(undefined);
  const runIdRef = React.useRef(0);

  // Re-run jq when state changes
  React.useEffect(() => {
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    window.clearTimeout(doneTimeoutRef.current);

    const requestId = window.setTimeout(() => {
      setStatus(ProcessStatus.LOADING);
      setError(null);

      void (async () => {
        try {
          const jsonInputError = getJsonInputError(input);

          if (jsonInputError != null) {
            setOutput("");
            setError(jsonInputError);
            setStatus(ProcessStatus.IDLE);
            return;
          }

          const flags = [
            ...(toolState.isCompactOutput
              ? ["--compact-output"]
              : ["--indent", String(toolState.indentationWidth)]),
            ...(toolState.rawOutput ? ["--raw-output"] : []),
          ];

          const result = await jq.raw(input, query || ".", [...flags]);

          if (runIdRef.current !== runId) return;

          if (result.exitCode !== 0 || result.stderr.trim().length > 0) {
            setOutput("");
            setError(result.stderr.trim() || "jq exited with an error.");
          } else {
            setOutput(result.stdout.trimEnd());
            setError(null);
          }

          setStatus(ProcessStatus.DONE);
          doneTimeoutRef.current = window.setTimeout(
            () => setStatus(ProcessStatus.IDLE),
            1000,
          );
        } catch (jqError) {
          if (runIdRef.current !== runId) return;
          setOutput("");
          setError(getErrorMessage(jqError));
          setStatus(ProcessStatus.IDLE);
        }
      })();
    }, 250);

    return () => {
      window.clearTimeout(requestId);
      window.clearTimeout(doneTimeoutRef.current);
    };
  }, [
    toolState.indentationWidth,
    input,
    toolState.isCompactOutput,
    query,
    toolState.rawOutput,
  ]);

  React.useEffect(
    () => () => {
      window.clearTimeout(doneTimeoutRef.current);
      window.clearTimeout(copyTimeoutRef.current);
    },
    [],
  );

  const handleQueryChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setQuery(event.currentTarget.value),
    [],
  );

  const handleInputChange = React.useCallback(
    (nextInput: string) => setInput(nextInput),
    [],
  );

  const handleIndentationWidthChange = React.useCallback(
    (indentationWidth: number) =>
      setToolState({ ...toolState, indentationWidth }),
    [setToolState, toolState],
  );

  const handleRawOutputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setToolState({ ...toolState, rawOutput: event.currentTarget.checked }),
    [setToolState, toolState],
  );

  const handleCompactOutputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setToolState({
        ...toolState,
        isCompactOutput: event.currentTarget.checked,
      }),
    [setToolState, toolState],
  );

  const handleCopy = React.useCallback(() => {
    if (!output) return;

    void navigator.clipboard.writeText(output).then(() => {
      window.clearTimeout(copyTimeoutRef.current);
      setIsCopied(true);
      copyTimeoutRef.current = window.setTimeout(
        () => setIsCopied(false),
        1000,
      );
    });
  }, [output]);

  const queryRightSection =
    status === ProcessStatus.LOADING ? (
      <Loader aria-label="Processing jq expression" size={18} />
    ) : status === ProcessStatus.DONE ? (
      <Check className={styles.statusDone} size={18} />
    ) : null;

  return (
    <ToolPage
      contentClassName={styles.surface}
      contentPadding="md"
      description={ProcessJSONConfig.description}
      instructions={<ProcessJSONInstructions />}
      size="xl"
      title={ProcessJSONConfig.title}
    >
      <div className={styles.form}>
        <TextInput
          aria-label="jq expression"
          className={styles.query}
          classNames={{ input: styles.queryInput }}
          onChange={handleQueryChange}
          placeholder="jq expression"
          rightSection={queryRightSection}
          value={query}
        />

        {error != null && (
          <Alert color="red" title="Error">
            <Text className={styles.error} size="sm">
              {error}
            </Text>
          </Alert>
        )}

        <div className={styles.editorGrid}>
          <section className={styles.editorPanel}>
            <header className={styles.editorHeader}>
              <Text className={styles.editorTitle} fw={700} size="sm">
                Input
              </Text>
            </header>
            <CodeMirrorEditor
              aria-label="JSON input"
              onChange={handleInputChange}
              value={input}
            />
          </section>

          <section className={styles.editorPanel}>
            <header className={styles.editorHeader}>
              <Text className={styles.editorTitle} fw={700} size="sm">
                Output
              </Text>
              <Group className={styles.editorActions} gap={4}>
                <Tooltip label="Copy output">
                  <ActionIcon
                    aria-label="Copy output"
                    disabled={!output}
                    onClick={handleCopy}
                    variant="subtle"
                  >
                    {isCopied ? (
                      <ClipboardCheck size={18} />
                    ) : (
                      <Clipboard size={18} />
                    )}
                  </ActionIcon>
                </Tooltip>
                <Menu position="bottom-end" shadow="md" width={260}>
                  <Menu.Target>
                    <Tooltip label="Output settings">
                      <ActionIcon aria-label="Output settings" variant="subtle">
                        <Settings size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <div className={styles.outputSettings}>
                      <NumberInput
                        allowDecimal={false}
                        allowNegative={false}
                        clampBehavior="strict"
                        disabled={toolState.isCompactOutput}
                        label="Tab indentation (spaces)"
                        max={7}
                        min={0}
                        onChange={(value) => {
                          if (typeof value === "number") {
                            handleIndentationWidthChange(value);
                          }
                        }}
                        size="sm"
                        value={toolState.indentationWidth}
                      />
                      <Switch
                        checked={toolState.isCompactOutput}
                        label="Compact output"
                        onChange={handleCompactOutputChange}
                        size="sm"
                      />
                      <Switch
                        checked={toolState.rawOutput}
                        label="Raw output"
                        onChange={handleRawOutputChange}
                        size="sm"
                      />
                    </div>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </header>
            <CodeMirrorEditor
              aria-label="JSON output"
              editable={false}
              value={output}
            />
          </section>
        </div>
      </div>
    </ToolPage>
  );
}

function getJsonInputError(input: string) {
  try {
    JSON.parse(input);
    return null;
  } catch (error) {
    return `Invalid JSON input: ${getErrorMessage(error)}`;
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unable to process JSON";
}
