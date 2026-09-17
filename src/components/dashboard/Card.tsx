import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

interface CardProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Pannello base dell'area riservata: stessa cornice usata in tutto il sito. */
export function Card({ title, action, children, className }: CardProps) {
  return (
    <section className={cn("panel p-6 transition-colors duration-200 hover:border-line-strong sm:p-7", className)}>
      {title || action ? (
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          {title ? <h2 className="font-wide text-base font-semibold text-paper">{title}</h2> : <span />}
          {action}
        </header>
      ) : null}
      {children}
    </section>
  );
}

/** Coppia etichetta/valore, con trattino se il dato non c'è. */
export function DataRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line py-3 last:border-0">
      <dt className="text-sm text-mist">{label}</dt>
      <dd className={cn("text-[0.9375rem]", value ? "text-paper" : "text-mist")}>{value ?? "—"}</dd>
    </div>
  );
}

/**
 * Stato vuoto onesto: dice che il dato non c'è ancora, invece di riempire
 * lo spazio con numeri inventati.
 */
export function EmptyState({ message, icon = "alert" }: { message: string; icon?: IconName }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border border-dashed border-line px-6 py-10 text-center">
      <Icon name={icon} size={22} className="text-mist/70" />
      <p className="max-w-sm text-sm text-mist">{message}</p>
    </div>
  );
}
