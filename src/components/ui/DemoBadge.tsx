import { cn } from "@/lib/cn";

/** Etichetta visibile per ogni dato non verificato. */
export function DemoBadge({ label = "Dati dimostrativi", className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[#e8c24a]/25 bg-[#e8c24a]/[0.07] px-2.5 py-0.5 text-xs font-medium text-[#e9d38c]",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-[#e8c24a]" />
      {label}
    </span>
  );
}
