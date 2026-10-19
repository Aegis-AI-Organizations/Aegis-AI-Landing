"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth, useTableColumns } from "@payloadcms/ui";
import type { DefaultCellComponentProps } from "payload";

export function ArticleActions({
  rowData,
}: Pick<DefaultCellComponentProps, "rowData">) {
  const router = useRouter();
  const { user } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const href = `/admin/collections/posts/${encodeURIComponent(rowData.id)}`;
  const title = rowData.title || "Article sans titre";

  useEffect(() => {
    const row = ref.current?.closest("tr");
    if (!row) return;
    const open = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const target = event.target;
      if (
        !(target instanceof Element) ||
        target.closest("a, button, input, select, textarea, [role=button]")
      )
        return;
      if (window.getSelection()?.toString()) return;
      router.push(href);
    };
    row.classList.add("article-clickable-row");
    row.addEventListener("click", open);
    return () => {
      row.removeEventListener("click", open);
      row.classList.remove("article-clickable-row");
    };
  }, [href, router]);

  async function remove() {
    if (
      !window.confirm(
        `Supprimer définitivement « ${title} » ? Cette action est irréversible.`,
      )
    )
      return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        `/api/posts/${encodeURIComponent(rowData.id)}`,
        { method: "DELETE", credentials: "same-origin" },
      );
      if (!response.ok) throw new Error("La suppression a échoué. Réessayez.");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "La suppression a échoué.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div ref={ref} className="article-list-actions">
      <Link href={href} aria-label={`Modifier : ${title}`} title="Modifier">
        <Pencil size={16} aria-hidden="true" />
      </Link>
      {user?.role === "admin" && (
        <button
          type="button"
          className="article-delete"
          title="Supprimer"
          aria-label={`Supprimer : ${title}`}
          disabled={busy}
          onClick={remove}
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      )}
      {error && <span role="alert">{error}</span>}
    </div>
  );
}

/** Keep the action column last, including when a user has saved older columns. */
export function ArticleActionColumn() {
  const { columns, setActiveColumns } = useTableColumns();
  useEffect(() => {
    const active = columns
      .filter((column) => column.active)
      .map((column) => column.accessor);
    if (active.at(-1) === "articleActions") return;
    void setActiveColumns([
      ...active.filter((name) => name !== "articleActions"),
      "articleActions",
    ]);
  }, [columns, setActiveColumns]);
  return null;
}
