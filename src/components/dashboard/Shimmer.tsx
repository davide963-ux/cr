import { cn } from "@/lib/cn";

/**
 * Barra luminosa al posto di un valore che sta arrivando.
 *
 * Un trattino dice "questo dato non esiste"; questa dice "sta arrivando".
 * Sono due cose diverse e l'interfaccia le distingue: il trattino resta per i
 * dati davvero mancanti. Il testo di servizio va in aria-label, così chi usa
 * uno screen reader sente lo stato invece di un elemento muto.
 */
export function Shimmer({ label, className }: { label: string; className?: string }) {
  return (
    <span role="status" aria-label={label} className={cn("skeleton inline-block", className)} />
  );
}
