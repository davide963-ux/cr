import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

/** Scheletro di caricamento mostrato dal boundary <Suspense> mentre arrivano i dati. */
export function MarketSkeleton({ className, rows = 1 }: { className?: string; rows?: number }) {
  return (
    <div className={cn("panel animate-pulse p-6 sm:p-8", className)} role="status" aria-live="polite">
      <span className="sr-only">Caricamento dati di mercato…</span>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="mb-6 last:mb-0">
          <div className="h-4 w-32 rounded bg-panel-raised" />
          <div className="mt-4 h-10 w-64 max-w-full rounded bg-panel-raised" />
          <div className="mt-6 h-24 w-full rounded bg-panel-raised" />
        </div>
      ))}
    </div>
  );
}

/** Stato d'errore: spiega cosa è successo e cosa fare, senza dettagli tecnici. */
export function MarketError({ message, className }: { message: string; className?: string }) {
  return (
    <div className={cn("panel flex items-start gap-4 p-6 sm:p-8", className)} role="alert">
      <Icon name="alert" className="mt-0.5 shrink-0 text-loss" />
      <div>
        <p className="font-medium text-paper">{message}</p>
        <p className="mt-1 text-sm text-mist">Aggiorna la pagina tra qualche istante per riprovare.</p>
      </div>
    </div>
  );
}
