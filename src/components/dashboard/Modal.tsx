"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * Finestra modale basata su <dialog>: il browser si occupa già di focus trap,
 * chiusura con Esc e sfondo inerte, quindi non serve reimplementarli.
 */
export function Modal({ open, onClose, title, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // Il clic sullo sfondo arriva al <dialog> stesso, non ai figli
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "panel m-auto w-[min(32rem,calc(100vw-2rem))] p-6 text-paper backdrop:bg-ink/80 sm:p-8",
        "motion-safe:duration-200 motion-safe:animate-rise",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-wide text-lg font-semibold text-paper">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Chiudi"
          className="-mr-1 -mt-1 grid size-9 shrink-0 place-items-center rounded-lg text-mist transition-colors hover:bg-panel-raised hover:text-paper"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
      <div className="mt-4 text-[0.9375rem] leading-relaxed text-mist">{children}</div>
    </dialog>
  );
}
