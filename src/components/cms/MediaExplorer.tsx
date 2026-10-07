"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Folder,
  FolderPlus,
  Upload,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import type { Media } from "@/payload-types";

type Directory = { id: number; name: string; folder?: number | null };
type Page<T> = { docs: T[]; totalPages: number };
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { credentials: "same-origin", ...options });
  const data = await response.json();
  if (!response.ok)
    throw new Error(
      data.errors?.[0]?.message || "L’opération a échoué. Réessayez.",
    );
  return data;
}
export function MediaExplorer() {
  const router = useRouter();
  const search = useSearchParams();
  const current = search.get("folder") || "";
  const page = Math.max(1, Number(search.get("page")) || 1);
  const [folders, setFolders] = useState<Directory[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [trail, setTrail] = useState<Directory[]>([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, refresh] = useState(0);
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState<"folder" | "upload">("folder");
  const [formError, setFormError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const destination = (id = "", nextPage = 1) =>
    `/admin/media?${new URLSearchParams({
      ...(id ? { folder: id } : {}),
      ...(nextPage > 1 ? { page: String(nextPage) } : {}),
    })}`;
  useEffect(() => {
    const abort = new AbortController();
    setLoading(true);
    setError("");
    const params = new URLSearchParams({
      depth: "0",
      limit: "24",
      page: String(page),
      sort: "name",
    });
    params.set(
      current ? "where[folder][equals]" : "where[folder][exists]",
      current || "false",
    );
    const load = async () => {
      const dirs = await request<Page<Directory>>(
        `/api/payload-folders?${params}`,
        { signal: abort.signal },
      );
      params.set("sort", "-createdAt");
      const images = await request<Page<Media>>(`/api/media?${params}`, {
        signal: abort.signal,
      });
      const breadcrumbs: Directory[] = [];
      let id = current;
      const seen = new Set<string>();
      while (id && !seen.has(id)) {
        seen.add(id);
        const item = await request<Directory>(
          `/api/payload-folders/${encodeURIComponent(id)}?depth=0`,
          { signal: abort.signal },
        );
        breadcrumbs.unshift(item);
        id = item.folder ? String(item.folder) : "";
      }
      if (abort.signal.aborted) return;
      setFolders(dirs.docs);
      setMedia(images.docs);
      setTrail(breadcrumbs);
      setPages(Math.max(dirs.totalPages, images.totalPages, 1));
      setLoading(false);
    };
    load().catch((e: Error) => {
      if (!abort.signal.aborted) {
        setError(e.message);
        setLoading(false);
      }
    });
    return () => abort.abort();
  }, [current, page, revision]);
  const open = (kind: "folder" | "upload") => {
    setModal(kind);
    setFormError("");
    form.current?.reset();
    dialog.current?.showModal();
  };
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setFormError("");
    const values = new FormData(event.currentTarget);
    try {
      if (modal === "folder") {
        const name = String(values.get("name") || "").trim();
        if (!name) throw new Error("Donnez un nom au dossier.");
        await request("/api/payload-folders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            folderType: ["media"],
            folder: current ? Number(current) : null,
          }),
        });
      } else {
        const file = values.get("file") as File;
        if (!file?.size) throw new Error("Choisissez une image.");
        if (file.size > 10000000)
          throw new Error("L’image doit peser moins de 10 Mo.");
        const body = new FormData();
        body.set("file", file);
        body.set(
          "_payload",
          JSON.stringify({
            alt: String(values.get("alt") || "").trim(),
            folder: current ? Number(current) : null,
          }),
        );
        await request("/api/media", { method: "POST", body });
      }
      dialog.current?.close();
      refresh((n) => n + 1);
      if (page !== 1) router.push(destination(current));
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "L’opération a échoué.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="cms-explorer">
      <header className="cms-explorer-header">
        <h1>Médias</h1>
        <div>
          <button type="button" onClick={() => open("folder")}>
            <FolderPlus size={17} />
            Créer un dossier
          </button>
          <button
            type="button"
            className="cms-explorer-primary"
            onClick={() => open("upload")}
          >
            <Upload size={17} />
            Importer un média
          </button>
        </div>
      </header>
      <nav className="cms-explorer-trail" aria-label="Emplacement">
        <Link href="/admin/media" aria-current={!current ? "page" : undefined}>
          Racine
        </Link>
        {trail.map((item, index) => (
          <span key={item.id}>
            <ChevronRight size={14} aria-hidden="true" />
            <Link
              href={destination(String(item.id))}
              aria-current={index === trail.length - 1 ? "page" : undefined}
            >
              {item.name}
            </Link>
          </span>
        ))}
      </nav>
      {error ? (
        <p role="alert">
          {error}{" "}
          <button onClick={() => refresh((n) => n + 1)}>Réessayer</button>
        </p>
      ) : loading ? (
        <p role="status" className="cms-explorer-empty">
          Chargement…
        </p>
      ) : (
        <>
          {!folders.length && !media.length && (
            <p className="cms-explorer-empty">
              Ce dossier est vide. Créez un dossier ou importez une image.
            </p>
          )}
          <div className="cms-explorer-grid">
            {folders.map((item) => (
              <Link
                className="cms-explorer-folder"
                href={destination(String(item.id))}
                key={`folder-${item.id}`}
              >
                <Folder size={30} strokeWidth={1.4} />
                <span>{item.name}</span>
              </Link>
            ))}
            {media.map((item) => (
              <Link
                className="cms-explorer-file"
                href={`/admin/collections/media/${item.id}`}
                key={`media-${item.id}`}
              >
                {item.url ? (
                  <Image
                    width={240}
                    height={145}
                    unoptimized
                    src={item.sizes?.card?.url || item.url}
                    alt={item.alt}
                    loading="lazy"
                  />
                ) : (
                  <ImageIcon size={30} />
                )}
                <span>{item.filename || item.alt}</span>
              </Link>
            ))}
          </div>
          {pages > 1 && (
            <nav className="cms-explorer-pages" aria-label="Pagination">
              {page > 1 && (
                <Link href={destination(current, page - 1)}>Précédent</Link>
              )}
              <span>
                {page} / {pages}
              </span>
              {page < pages && (
                <Link href={destination(current, page + 1)}>Suivant</Link>
              )}
            </nav>
          )}
        </>
      )}
      <dialog
        ref={dialog}
        className="cms-explorer-dialog"
        onCancel={(event) => {
          if (busy) event.preventDefault();
        }}
        aria-labelledby="media-dialog-title"
      >
        <form ref={form} onSubmit={submit}>
          <h2 id="media-dialog-title">
            {modal === "folder" ? "Créer un dossier" : "Importer un média"}
          </h2>
          {modal === "folder" ? (
            <label>
              Nom du dossier
              <input name="name" required maxLength={120} autoFocus />
            </label>
          ) : (
            <>
              <label>
                Image
                <input
                  name="file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  required
                />
              </label>
              <p>JPG, PNG, WebP ou AVIF · 10 Mo maximum</p>
              <label>
                Description de l’image
                <input
                  name="alt"
                  required
                  maxLength={500}
                  placeholder="Décrivez ce que montre l’image"
                />
              </label>
            </>
          )}
          {formError && <p role="alert">{formError}</p>}
          <footer>
            <button
              type="button"
              disabled={busy}
              onClick={() => dialog.current?.close()}
            >
              Annuler
            </button>
            <button
              className="cms-explorer-primary"
              disabled={busy}
              type="submit"
            >
              {busy ? "En cours…" : modal === "folder" ? "Créer" : "Importer"}
            </button>
          </footer>
        </form>
      </dialog>
    </section>
  );
}
