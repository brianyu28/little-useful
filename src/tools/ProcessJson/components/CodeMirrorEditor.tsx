import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { useColorScheme } from "@mantine/hooks";
import { basicSetup, EditorView } from "codemirror";
import React from "react";
import styles from "../ProcessJson.module.scss";

interface Props {
  readonly "aria-label": string;
  readonly editable?: boolean;
  readonly onChange?: (value: string) => void;
  readonly value: string;
}

const editorLayout = EditorView.theme({
  "&": {
    fontSize: "14px",
    height: "100%",
  },
  ".cm-editor": {
    height: "100%",
  },
  ".cm-scroller": {
    overflow: "auto",
  },
});

export default function CodeMirrorEditor({
  "aria-label": ariaLabel,
  editable = true,
  onChange,
  value,
}: Props) {
  const colorScheme = useColorScheme(undefined, {
    getInitialValueInEffect: false,
  });
  const editorRef = React.useRef<HTMLDivElement>(null);
  const viewRef = React.useRef<EditorView | null>(null);
  const onChangeRef = React.useRef(onChange);
  const valueRef = React.useRef(value);

  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  React.useEffect(() => {
    valueRef.current = value;
  }, [value]);

  React.useEffect(() => {
    if (editorRef.current == null) return;

    const extensions = [
      basicSetup,
      json(),
      ...(colorScheme === "dark" ? [oneDark] : []),
      editorLayout,
      EditorView.contentAttributes.of({ "aria-label": ariaLabel }),
      EditorView.updateListener.of((update) => {
        if (!update.docChanged) return;
        onChangeRef.current?.(update.state.doc.toString());
      }),
    ];

    if (!editable) {
      extensions.push(EditorView.editable.of(false));
    }

    const view = new EditorView({
      parent: editorRef.current,
      doc: valueRef.current,
      extensions,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [ariaLabel, colorScheme, editable]);

  React.useEffect(() => {
    const view = viewRef.current;
    if (view == null) return;

    const currentValue = view.state.doc.toString();
    if (currentValue === value) return;

    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: value,
      },
    });
  }, [value]);

  return <div className={styles.editorHost} ref={editorRef} />;
}
