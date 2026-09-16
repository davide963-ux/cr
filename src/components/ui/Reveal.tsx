"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { observeOnce } from "@/lib/observe";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Ritardo in ms, utile per scaglionare elementi vicini */
  delay?: number;
}

/**
 * Rivela il contenuto all'ingresso nel viewport.
 * Lo stato è scritto direttamente sul DOM (data-visible): nessun re-render.
 * Senza JS o con prefers-reduced-motion il contenuto è sempre visibile (vedi globals.css).
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeOnce(el, () => el.setAttribute("data-visible", "true"), {
      threshold: 0.12,
      rootMargin: "0px 0px -6% 0px",
    });
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
