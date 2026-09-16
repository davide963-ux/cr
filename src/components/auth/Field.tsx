import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const control =
  "mt-1.5 h-11 w-full rounded-[var(--radius-control)] border border-line-strong bg-panel px-3.5 text-paper outline-none transition-colors placeholder:text-mist/60 focus:border-mint/60";

interface FieldProps extends Omit<ComponentProps<"input">, "id"> {
  name: string;
  label: string;
  hint?: string;
}

/** Campo di modulo: etichetta collegata, più un suggerimento opzionale. */
export function Field({ name, label, hint, className, ...props }: FieldProps) {
  const hintId = hint ? `${name}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={name} className="text-sm font-medium text-paper">
        {label}
      </label>
      <input id={name} name={name} className={control} aria-describedby={hintId} {...props} />
      {hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-mist">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Esito della Server Action: errore bloccante oppure avviso informativo. */
export function FormMessages({ error, notice }: { error?: string; notice?: string }) {
  return (
    <>
      {error ? (
        <p role="alert" className="text-sm text-loss">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p
          role="status"
          className={cn("rounded-[var(--radius-card)] border border-line bg-panel-raised p-3 text-sm text-mist")}
        >
          {notice}
        </p>
      ) : null}
    </>
  );
}
