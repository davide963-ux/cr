import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionHeaderProps {
  id: string;
  title: string;
  description?: ReactNode;
  aside?: ReactNode;
  className?: string;
}

/** Intestazione di sezione: il titolo è sempre un <h2> collegato via aria-labelledby. */
export function SectionHeader({ id, title, description, aside, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        <h2 id={id} className="font-display text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.02] text-paper text-balance">
          {title}
        </h2>
        {description ? <p className="mt-4 max-w-xl text-lg text-mist text-pretty">{description}</p> : null}
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}
