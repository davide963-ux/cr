"use client";

import { useEffect, useRef } from "react";
import { formatFixed } from "@/lib/format";
import { observeOnce, prefersReducedMotion } from "@/lib/observe";

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Contatore animato.
 * - SSR: rende il valore finale (SEO, no-JS, nessun hydration mismatch).
 * - Client: se l'elemento non è ancora visibile, azzera e anima all'ingresso.
 * - Aggiorna textContent via rAF: nessun re-render React per frame.
 */
export function AnimatedCounter({ value, decimals = 0, prefix = "", suffix = "", durationMs = 1600 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const render = (v: number) => {
      el.textContent = `${prefix}${formatFixed(v, decimals)}${suffix}`;
    };

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return; // già visibile: niente animazione

    render(0);
    let frame = 0;
    const stop = observeOnce(el, () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / durationMs);
        render(value * easeOutExpo(p));
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });

    return () => {
      stop();
      cancelAnimationFrame(frame);
      render(value);
    };
  }, [value, decimals, prefix, suffix, durationMs]);

  return (
    <span ref={ref} className="tabular">
      {`${prefix}${formatFixed(value, decimals)}${suffix}`}
    </span>
  );
}
