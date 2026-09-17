import type { ReactNode } from "react";

/** Intestazione di pagina dell'area riservata: titolo, occhiello e azione. */
export function DashboardHeader({
  title,
  eyebrow,
  action,
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div>
        {eyebrow ? <p className="text-sm text-mist">{eyebrow}</p> : null}
        <h1 className="font-display mt-1 text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-paper">{title}</h1>
      </div>
      {action}
    </header>
  );
}
