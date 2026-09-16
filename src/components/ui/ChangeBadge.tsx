import { formatChangePct } from "@/lib/format";
import { cn } from "@/lib/cn";

/** Variazione 24h: colore + segno + testo accessibile (il colore non è l'unico indicatore). */
export function ChangeBadge({ value, className }: { value: number; className?: string }) {
  const positive = value >= 0;
  return (
    <span
      className={cn(
        "tabular inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-sm font-medium",
        positive ? "bg-mint/10 text-mint" : "bg-loss/10 text-loss",
        className,
      )}
    >
      <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true" className={positive ? "" : "rotate-180"}>
        <path d="M4 1 7.5 6.5h-7L4 1Z" fill="currentColor" />
      </svg>
      <span className="sr-only">{positive ? "In rialzo del" : "In ribasso del"} </span>
      {formatChangePct(value)}
    </span>
  );
}
