import { cn } from "@/lib/cn";

/** Indicatore di quotazioni aggiornate in tempo reale (polling client su /api/market). */
export function LiveBadge({ stale = false, className }: { stale?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        stale
          ? "border-line bg-panel-raised text-mist"
          : "border-mint/25 bg-mint/[0.07] text-mint",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", stale ? "bg-mist" : "bg-mint motion-safe:animate-pulse")}
      />
      {stale ? "In pausa" : "Tempo reale"}
    </span>
  );
}
