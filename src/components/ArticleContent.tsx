import Image from "next/image";
import {
  RichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import type { Media, Post } from "@/payload-types";
import styles from "./Blog.module.css";

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: ({ node }) => {
    const media = node.value as Media | number;
    if (!media || typeof media !== "object" || typeof media.url !== "string")
      return null;
    return (
      <figure>
        <Image
          src={media.url}
          alt={String(media.alt || "")}
          width={Number(media.width) || 1200}
          height={Number(media.height) || 750}
          unoptimized
        />
        {node.fields?.caption && (
          <figcaption>{String(node.fields.caption)}</figcaption>
        )}
      </figure>
    );
  },
  blocks: {
    callout: ({
      node,
    }: {
      node: { fields: { tone?: string; title: string; body: string } };
    }) => (
      <aside className={styles.callout} data-tone={node.fields.tone}>
        <strong>{node.fields.title}</strong>
        <p>{node.fields.body}</p>
      </aside>
    ),
    codeSnippet: ({
      node,
    }: {
      node: { fields: { filename?: string; code: string } };
    }) => (
      <figure className={styles.codeBlock}>
        {node.fields.filename && (
          <figcaption>{node.fields.filename}</figcaption>
        )}
        <pre>
          <code>{node.fields.code}</code>
        </pre>
      </figure>
    ),
    articleTable: ({
      node,
    }: {
      node: {
        fields: {
          caption: string;
          headers: { text: string }[];
          rows: { cells?: { text?: string }[] }[];
        };
      };
    }) => {
      const headers = (node.fields.headers || []) as { text: string }[];
      const rows = (node.fields.rows || []) as {
        cells?: { text?: string }[];
      }[];
      return (
        <div
          className={styles.tableWrap}
          role="region"
          aria-label={node.fields.caption}
          tabIndex={0}
        >
          <table>
            <caption>{node.fields.caption}</caption>
            <thead>
              <tr>
                {headers.map((header, i) => (
                  <th scope="col" key={i}>
                    {header.text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {headers.map((_, j) => (
                    <td key={j}>{row.cells?.[j]?.text || ""}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
    articleFAQ: ({
      node,
    }: {
      node: { fields: { items: { question: string; answer: string }[] } };
    }) => (
      <div className={styles.faq}>
        {(
          (node.fields.items || []) as { question: string; answer: string }[]
        ).map((item, i) => (
          <details key={i}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    ),
  },
});
export function ArticleContent({ content }: { content: Post["content"] }) {
  return (
    <RichText className={styles.prose} data={content} converters={converters} />
  );
}
