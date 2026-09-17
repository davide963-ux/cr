"use client";

import { useId, useRef, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { Button } from "@/components/ui/Button";
import { documentsPage } from "@/data/content";
import { cn } from "@/lib/cn";

/** Solo immagini e PDF: niente archivi né eseguibili. */
const ACCEPTED = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "application/pdf": ".pdf",
} as const;

const MAX_BYTES = 10 * 1024 * 1024;

interface SelectedFile {
  id: string;
  name: string;
  type: string;
  size: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Selezione dei documenti, per ora solo lato client.
 *
 * I file NON vengono inviati da nessuna parte e NON vengono scritti in
 * localStorage: restano in memoria finché la pagina è aperta. Non viene
 * generata alcuna anteprima, quindi il contenuto del file non viene mai
 * interpretato dal browser. Quando ci sarà un backend, questo componente
 * dovrà spedirli a uno storage autenticato e privato.
 */
export function DocumentUpload() {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  function accept(list: FileList | null) {
    if (!list || list.length === 0) return;
    const accepted: SelectedFile[] = [];
    let rejection: string | null = null;

    for (const file of Array.from(list)) {
      // Il tipo dichiarato dal browser non è una garanzia: è un filtro di
      // comodità, la verifica vera andrà fatta lato server al caricamento.
      if (!(file.type in ACCEPTED)) {
        rejection = documentsPage.errorType;
        continue;
      }
      if (file.size > MAX_BYTES) {
        rejection = documentsPage.errorSize;
        continue;
      }
      accepted.push({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        name: file.name,
        type: file.type,
        size: file.size,
      });
    }

    setError(rejection);
    if (accepted.length > 0) {
      setFiles((prev) => [...prev, ...accepted.filter((f) => !prev.some((p) => p.id === f.id))]);
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          accept(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-4 rounded-[var(--radius-panel)] border border-dashed px-6 py-12 text-center transition-colors duration-200",
          dragging ? "border-mint/60 bg-mint/[0.06]" : "border-line bg-panel-raised/40",
        )}
      >
        <Icon name="upload" size={26} className={dragging ? "text-mint" : "text-mist/70"} />
        <p className="max-w-sm text-[0.9375rem] text-mist">{documentsPage.dropzone}</p>

        <label htmlFor={inputId} className="sr-only">
          {documentsPage.selectFile}
        </label>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          multiple
          accept={Object.values(ACCEPTED).join(",")}
          className="sr-only"
          onChange={(e) => {
            accept(e.target.files);
            // Permette di riselezionare lo stesso file dopo averlo rimosso
            e.target.value = "";
          }}
        />
        <Button variant="secondary" onClick={() => inputRef.current?.click()}>
          {documentsPage.selectFile}
        </Button>

        <p className="text-xs text-mist/80">{documentsPage.accepted}</p>
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-loss">
          {error}
        </p>
      ) : null}

      {files.length > 0 ? (
        <>
          <ul className="mt-6 space-y-3">
            {files.map((file) => (
              <li
                key={file.id}
                className="flex flex-wrap items-center gap-4 rounded-[var(--radius-card)] border border-line bg-panel p-4"
              >
                <Icon name="document" size={20} className="shrink-0 text-mist/70" />
                <div className="min-w-0 flex-1">
                  {/* Il nome arriva dall'utente: resta testo, mai HTML */}
                  <p className="truncate text-[0.9375rem] text-paper">{file.name}</p>
                  <p className="mt-0.5 text-xs text-mist">
                    {ACCEPTED[file.type as keyof typeof ACCEPTED]} · {formatSize(file.size)}
                  </p>
                </div>
                <span className="rounded-full border border-line bg-panel-raised px-2.5 py-0.5 text-xs text-mist">
                  {documentsPage.statusReady}
                </span>
                <button
                  type="button"
                  onClick={() => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
                  aria-label={`${documentsPage.removeLabel}: ${file.name}`}
                  className="grid size-9 shrink-0 place-items-center rounded-lg text-mist transition-colors hover:bg-panel-raised hover:text-loss"
                >
                  <Icon name="trash" size={17} />
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-mist">{documentsPage.notUploaded}</p>
        </>
      ) : null}
    </div>
  );
}
