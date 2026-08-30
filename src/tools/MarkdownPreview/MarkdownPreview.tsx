import { useMounted } from "@mantine/hooks";
import createDOMPurify from "dompurify";
import { marked } from "marked";
import React from "react";
import ToolPage from "../../components/ToolPage";
import styles from "./MarkdownPreview.module.scss";
import { MarkdownPreviewConfig } from "./MarkdownPreviewConfig";

const initialMarkdown = `# Markdown Preview

Type **Markdown** here and see it rendered in real time.`;

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = React.useState(initialMarkdown);
  const isMounted = useMounted();

  const renderedMarkdown = React.useMemo(() => {
    if (!isMounted) return "";

    const html = marked.parse(markdown, { async: false, gfm: true });
    return createDOMPurify(window).sanitize(html);
  }, [isMounted, markdown]);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) =>
      setMarkdown(event.currentTarget.value),
    [],
  );

  return (
    <ToolPage
      contentClassName={styles.surface}
      contentPadding={0}
      description={MarkdownPreviewConfig.description}
      size="xl"
      title={MarkdownPreviewConfig.title}
    >
      <div className={styles.grid}>
        <section className={styles.panel}>
          <label className={styles.panelHeader} htmlFor="markdown-input">
            Markdown
          </label>
          <textarea
            aria-label="Markdown input"
            autoFocus
            className={styles.input}
            id="markdown-input"
            onChange={handleChange}
            spellCheck={false}
            value={markdown}
          />
        </section>

        <section aria-label="Markdown preview" className={styles.panel}>
          <div className={styles.panelHeader}>Preview</div>
          {markdown.trim() ? (
            <div
              className={styles.preview}
              dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
            />
          ) : (
            <div className={styles.empty}>
              Markdown preview will appear here.
            </div>
          )}
        </section>
      </div>
    </ToolPage>
  );
}
