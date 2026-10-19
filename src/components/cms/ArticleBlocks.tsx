"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useField, useForm, useFormFields } from "@payloadcms/ui";
import { useBlockComponentContext } from "@payloadcms/richtext-lexical/client";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import type { FormState } from "payload";

/** Fields stay in Payload's block form, preserving validation, drafts and autosave. */
function Text({
  path,
  label,
  multiline = false,
  className = "",
}: {
  path: string;
  label: string;
  multiline?: boolean;
  className?: string;
}) {
  const { value, setValue, showError, errorMessage, disabled } =
    useField<string>({ path });
  const editable = useLexicalEditable();
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value]);
  const props = {
    "aria-label": label,
    "aria-invalid": showError || undefined,
    placeholder: label,
    value: value ?? "",
    disabled: disabled || !editable,
    className: `article-inline-text ${className}`,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setValue(event.target.value),
  };
  return (
    <>
      {multiline ? (
        <textarea {...props} ref={ref} rows={1} />
      ) : (
        <input {...props} />
      )}
      {showError && (
        <span role="alert" className="article-inline-error">
          {errorMessage}
        </span>
      )}
    </>
  );
}

function Frame({ label, children }: { label: string; children: ReactNode }) {
  const { RemoveButton, errorCount } = useBlockComponentContext();
  const editable = useLexicalEditable();
  return (
    <section className="article-visual-block" aria-label={label}>
      <div className="article-block-tools">
        <span>{label}</span>
        {editable && <RemoveButton />}
      </div>
      {children}
      {errorCount > 0 && (
        <p role="alert" className="article-inline-error">
          Complétez les champs obligatoires de ce bloc.
        </p>
      )}
    </section>
  );
}

export function CalloutBlock() {
  const { value, setValue, disabled } = useField<string>({ path: "tone" });
  const editable = useLexicalEditable();
  return (
    <Frame label="Encadré">
      <aside className="article-live-callout" data-tone={value || "info"}>
        <select
          aria-label="Style de l’encadré"
          value={value || "info"}
          disabled={disabled || !editable}
          onChange={(event) => setValue(event.target.value)}
        >
          <option value="info">À retenir</option>
          <option value="tip">Conseil</option>
          <option value="warning">Attention</option>
        </select>
        <Text
          path="title"
          label="Titre de l’encadré"
          className="article-inline-heading"
        />
        <Text path="body" label="Texte de l’encadré" multiline />
      </aside>
    </Frame>
  );
}

function useRows(path: string) {
  return useFormFields(([fields]) => fields[path]?.rows || []);
}
const field = (value: string) => ({ value, initialValue: value, valid: true });

export function TableBlock() {
  const headers = useRows("headers");
  const rows = useRows("rows");
  const { addFieldRow, removeFieldRow } = useForm();
  const editable = useLexicalEditable();
  const addColumn = () => {
    addFieldRow({
      path: "headers",
      schemaPath: "headers",
      subFieldState: { text: field("") },
    });
    rows.forEach((_, index) =>
      addFieldRow({
        path: `rows.${index}.cells`,
        schemaPath: "rows.cells",
        subFieldState: { text: field("") },
      }),
    );
  };
  const addRow = () => {
    const cells = Array.from({ length: headers.length }, () => ({
      id: crypto.randomUUID(),
    }));
    const subFieldState: FormState = {
      cells: {
        value: headers.length,
        rows: cells,
        valid: true,
        disableFormData: true,
      },
    };
    cells.forEach((_, index) => {
      subFieldState[`cells.${index}.text`] = field("");
    });
    addFieldRow({ path: "rows", schemaPath: "rows", subFieldState });
  };
  const removeColumn = (index: number) => {
    removeFieldRow({ path: "headers", rowIndex: index });
    rows.forEach((_, row) =>
      removeFieldRow({ path: `rows.${row}.cells`, rowIndex: index }),
    );
  };
  return (
    <Frame label="Tableau">
      <Text
        path="caption"
        label="Titre du tableau"
        className="article-inline-heading"
      />
      <div className="article-live-table">
        <table>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={header.id} scope="col">
                  <Text
                    path={`headers.${index}.text`}
                    label={`En-tête ${index + 1}`}
                  />
                  {editable && headers.length > 2 && (
                    <button
                      type="button"
                      className="article-remove"
                      aria-label={`Supprimer la colonne ${index + 1}`}
                      onClick={() => removeColumn(index)}
                    >
                      ×
                    </button>
                  )}
                </th>
              ))}
              {editable && (
                <th className="article-row-action">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id}>
                {headers.map((header, column) => (
                  <td key={header.id}>
                    <Text
                      path={`rows.${rowIndex}.cells.${column}.text`}
                      label={`Ligne ${rowIndex + 1}, colonne ${column + 1}`}
                      multiline
                    />
                  </td>
                ))}
                {editable && (
                  <td className="article-row-action">
                    <button
                      type="button"
                      disabled={rows.length <= 1}
                      aria-label={`Supprimer la ligne ${rowIndex + 1}`}
                      onClick={() =>
                        removeFieldRow({ path: "rows", rowIndex: rowIndex })
                      }
                    >
                      ×
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editable && (
        <div className="article-block-actions">
          <button type="button" onClick={addRow}>
            + Ligne
          </button>
          <button
            type="button"
            disabled={headers.length >= 6}
            onClick={addColumn}
          >
            + Colonne
          </button>
        </div>
      )}
    </Frame>
  );
}

export function CodeBlock() {
  return (
    <Frame label="Code">
      <div className="article-live-code">
        <Text path="filename" label="Fichier ou légende" />
        <Text path="code" label="Code" multiline />
      </div>
    </Frame>
  );
}

export function FAQBlock() {
  const items = useRows("items");
  const { addFieldRow, removeFieldRow } = useForm();
  const editable = useLexicalEditable();
  return (
    <Frame label="Questions / réponses">
      <div className="article-live-faq">
        {items.map((item, index) => (
          <div className="article-faq-item" key={item.id}>
            <Text
              path={`items.${index}.question`}
              label="Question"
              className="article-inline-heading"
            />
            <Text path={`items.${index}.answer`} label="Réponse" multiline />
            {editable && items.length > 1 && (
              <button
                type="button"
                className="article-remove"
                aria-label={`Supprimer la question ${index + 1}`}
                onClick={() =>
                  removeFieldRow({ path: "items", rowIndex: index })
                }
              >
                ×
              </button>
            )}
          </div>
        ))}
        {editable && (
          <div className="article-block-actions">
            <button
              type="button"
              onClick={() =>
                addFieldRow({
                  path: "items",
                  schemaPath: "items",
                  subFieldState: { question: field(""), answer: field("") },
                })
              }
            >
              + Question
            </button>
          </div>
        )}
      </div>
    </Frame>
  );
}
